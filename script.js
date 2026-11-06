
const app = window.mafiaAppwrite;

const $ = id => document.getElementById(id);

let currentRoom = null;
let refreshTimer = null;
let busy = false;
let lastGameStatus = "waiting";

const createBtn = $("createBtn");
const joinBtn = $("joinBtn");
const modal = $("modal");
const nickname = $("nickname");
const result = $("result");
const toast = $("toast");

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 3000);
}

function getPlayer() {
  let id = localStorage.getItem("mafia_player_id");

  if (!id) {
    id = Appwrite.ID.unique();
    localStorage.setItem("mafia_player_id", id);
  }

  return {
    id,
    name: localStorage.getItem("mafia_name") || ""
  };
}

function saveName(name) {
  localStorage.setItem("mafia_name", name.trim().slice(0, 20));
}

function generateCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

function normalizePlayers(value) {
  try {
    const list = JSON.parse(value || "[]");

    return list.map(item => {
      if (typeof item === "string") {
        return {
          id: "old_" + item,
          name: item,
          ready: false
        };
      }

      return {
        id: item.id,
        name: item.name,
        ready: Boolean(item.ready)
      };
    });
  } catch {
    return [];
  }
}

function normalizeMessages(value) {
  try {
    const messages = JSON.parse(value || "[]");
    return Array.isArray(messages) ? messages : [];
  } catch {
    return [];
  }
}

// MODAL

function openModal() {
  modal.classList.remove("hidden");
  nickname.value = localStorage.getItem("mafia_name") || "";
  result.textContent = "";
}

function hideModal() {
  modal.classList.add("hidden");
}

createBtn.addEventListener("click", openModal);
$("closeModal").addEventListener("click", hideModal);

// CREATE ROOM

$("confirmBtn").addEventListener("click", async () => {
  if (busy) return;

  const name = nickname.value.trim();

  if (!name) {
    showToast("Никнейм енгіз!");
    return;
  }

  busy = true;
  $("confirmBtn").disabled = true;

  try {
    const player = getPlayer();
    player.name = name;
    saveName(name);

    const code = generateCode();

    const room = await app.tablesDB.createRow({
      databaseId: app.databaseId,
      tableId: app.tableId,
      rowId: Appwrite.ID.unique(),
      data: {
        code,
        host: name,
        maxPlayers: 20,
        currentPlayers: 1,
        status: "waiting",
        players: JSON.stringify([
          {
            id: player.id,
            name,
            ready: true
          }
        ]),
        messages: "[]"
      }
    });

    hideModal();
    await enterLobby(room);
    showToast("Бөлме құрылды!");

  } catch (error) {
    console.error(error);
    showToast("Қате: " + error.message);
  } finally {
    busy = false;
    $("confirmBtn").disabled = false;
  }
});

// JOIN ROOM

async function joinRoom(code) {
  if (busy) return;

  code = code.trim().toUpperCase();

  if (!code) {
    showToast("Бөлме кодын енгіз!");
    return;
  }

  let name = localStorage.getItem("mafia_name");

  if (!name) {
    name = prompt("Никнейм енгіз:");

    if (!name || !name.trim()) return;

    name = name.trim().slice(0, 20);
    saveName(name);
  }

  busy = true;

  try {
    const response = await app.tablesDB.listRows({
      databaseId: app.databaseId,
      tableId: app.tableId,
      queries: [
        Appwrite.Query.equal("code", code),
        Appwrite.Query.limit(1)
      ]
    });

    if (!response.rows.length) {
      showToast("Бөлме табылмады!");
      return;
    }

    const room = response.rows[0];

    if (room.status !== "waiting") {
      showToast("Ойын басталып кеткен!");
      return;
    }

    const player = getPlayer();
    let players = normalizePlayers(room.players);

    if (!players.some(p => p.id === player.id)) {
      if (players.length >= room.maxPlayers) {
        showToast("Бөлме толып кетті!");
        return;
      }

      players.push({
        id: player.id,
        name,
        ready: false
      });

      await app.tablesDB.updateRow({
        databaseId: app.databaseId,
        tableId: app.tableId,
        rowId: room.$id,
        data: {
          players: JSON.stringify(players),
          currentPlayers: players.length
        }
      });
    }

    await enterLobby(room);
    showToast("Бөлмеге кірдің!");

  } catch (error) {
    console.error(error);
    showToast("Қосылу қатесі: " + error.message);
  } finally {
    busy = false;
  }
}

joinBtn.addEventListener("click", () => {
  joinRoom($("roomCode").value);
});

document.querySelectorAll(".room-join-btn").forEach(button => {
  button.addEventListener("click", () => {
    joinRoom(button.dataset.code);
  });
});

// ENTER LOBBY

async function enterLobby(room) {
  currentRoom = room;
  lastGameStatus = room.status;

  $("lobby").classList.remove("hidden");
  $("lobbyCode").textContent = room.code;
  $("lobby").scrollIntoView({ behavior: "smooth" });

  await refreshLobby();

  if (refreshTimer) clearInterval(refreshTimer);

  refreshTimer = setInterval(refreshLobby, 3000);
}

// REFRESH LOBBY

async function refreshLobby() {
  if (!currentRoom) return;

  try {
    const room = await app.tablesDB.getRow({
      databaseId: app.databaseId,
      tableId: app.tableId,
      rowId: currentRoom.$id
    });

    currentRoom = room;

    const players = normalizePlayers(room.players);
    const me = getPlayer();

    $("lobbyCode").textContent = room.code;
    $("lobbyCount").textContent =
      `Ойыншылар: ${players.length} / ${room.maxPlayers}`;

    // PLAYER LIST

    const list = $("playersList");
    list.replaceChildren();

    players.forEach(player => {
      const card = document.createElement("article");
      card.className = "room-card";

      const owner = document.createElement("span");
      owner.className = "room-status";
      owner.textContent =
        player.name === room.host ? "OWNER" : "PLAYER";

      const title = document.createElement("h3");
      title.textContent = player.name;

      const status = document.createElement("p");
      status.textContent = player.ready
        ? "🟢 ДАЙЫН"
        : "🔴 КҮТУДЕ";

      card.append(owner, title, status);
      list.append(card);
    });

    const isOwner = me.name === room.host;

    $("startGameBtn").classList.toggle("hidden", !isOwner);

    const myPlayer = players.find(p => p.id === me.id);

    $("readyBtn").textContent =
      myPlayer?.ready ? "ДАЙЫН ЕМЕСПІН" : "ДАЙЫН";

    // CHAT

    renderMessages(normalizeMessages(room.messages));

    // GAME STATUS

    if (room.status === "playing" && lastGameStatus !== "playing") {
      showToast("Ойын басталды!");
    }

    lastGameStatus = room.status;

  } catch (error) {
    console.error(error);
    showToast("Lobby жаңарту қатесі");
  }
}

// CHAT DISPLAY

function renderMessages(messages) {
  const box = $("chatMessages");
  box.replaceChildren();

  if (!messages.length) {
    const empty = document.createElement("p");
    empty.className = "chat-empty";
    empty.textContent = "Әзірге хабарлама жоқ...";
    box.append(empty);
    return;
  }

  messages.forEach(message => {
    const item = document.createElement("div");
    item.className = "chat-message";

    const name = document.createElement("strong");
    name.textContent = message.name + ": ";

    const text = document.createElement("span");
    text.textContent = message.text;

    item.append(name, text);
    box.append(item);
  });

  box.scrollTop = box.scrollHeight;
}

// SEND CHAT MESSAGE

async function sendMessage() {
  if (!currentRoom || busy) return;

  const input = $("chatInput");
  const text = input.value.trim();

  if (!text) return;

  busy = true;
  $("sendMessageBtn").disabled = true;

  try {
    const room = await app.tablesDB.getRow({
      databaseId: app.databaseId,
      tableId: app.tableId,
      rowId: currentRoom.$id
    });

    const me = getPlayer();
    const players = normalizePlayers(room.players);

    if (!players.some(p => p.id === me.id)) {
      showToast("Сен бұл бөлмеде жоқсың!");
      return;
    }

    const messages = normalizeMessages(room.messages);

    messages.push({
      id: Appwrite.ID.unique(),
      name: me.name,
      text: text.slice(0, 100),
      time: Date.now()
    });

    // Соңғы 5 хабарламаны ғана сақтау
    const recentMessages = messages.slice(-5);

    await app.tablesDB.updateRow({
      databaseId: app.databaseId,
      tableId: app.tableId,
      rowId: room.$id,
      data: {
        messages: JSON.stringify(recentMessages)
      }
    });

    input.value = "";
    await refreshLobby();

  } catch (error) {
    console.error(error);
    showToast("Хабарлама жіберілмеді: " + error.message);
  } finally {
    busy = false;
    $("sendMessageBtn").disabled = false;
  }
}

$("sendMessageBtn").addEventListener("click", sendMessage);

$("chatInput").addEventListener("keydown", event => {
  if (event.key === "Enter") sendMessage();
});

// READY

$("readyBtn").addEventListener("click", async () => {
  if (!currentRoom || busy) return;

  busy = true;

  try {
    const room = await app.tablesDB.getRow({
      databaseId: app.databaseId,
      tableId: app.tableId,
      rowId: currentRoom.$id
    });

    const players = normalizePlayers(room.players);
    const me = getPlayer();
    const player = players.find(p => p.id === me.id);

    if (!player) {
      showToast("Ойыншы табылмады!");
      return;
    }

    player.ready = !player.ready;

    await app.tablesDB.updateRow({
      databaseId: app.databaseId,
      tableId: app.tableId,
      rowId: room.$id,
      data: {
        players: JSON.stringify(players),
        currentPlayers: players.length
      }
    });

    await refreshLobby();

  } catch (error) {
    console.error(error);
    showToast("Қате: " + error.message);
  } finally {
    busy = false;
  }
});

// LEAVE ROOM

$("leaveBtn").addEventListener("click", async () => {
  if (!currentRoom || busy) return;

  busy = true;

  try {
    const room = await app.tablesDB.getRow({
      databaseId: app.databaseId,
      tableId: app.tableId,
      rowId: currentRoom.$id
    });

    const players = normalizePlayers(room.players);
    const me = getPlayer();

    const remaining = players.filter(p => p.id !== me.id);

    const newHost = remaining.length
      ? remaining[0].name
      : room.host;

    await app.tablesDB.updateRow({
      databaseId: app.databaseId,
      tableId: app.tableId,
      rowId: room.$id,
      data: {
        players: JSON.stringify(remaining),
        currentPlayers: remaining.length,
        host: newHost,
        status: remaining.length ? "waiting" : "finished"
      }
    });

    currentRoom = null;

    clearInterval(refreshTimer);
    refreshTimer = null;

    $("lobby").classList.add("hidden");

    showToast("Бөлмеден шықтың!");

  } catch (error) {
    console.error(error);
    showToast("Шығу қатесі: " + error.message);
  } finally {
    busy = false;
  }
});

// START GAME

$("startGameBtn").addEventListener("click", async () => {
  if (!currentRoom || busy) return;

  busy = true;

  try {
    const room = await app.tablesDB.getRow({
      databaseId: app.databaseId,
      tableId: app.tableId,
      rowId: currentRoom.$id
    });

    const players = normalizePlayers(room.players);

    if (players.length < 2) {
      showToast("Кемінде 2 ойыншы керек!");
      return;
    }

    if (!players.every(p => p.ready)) {
      showToast("Барлық ойыншы дайын болуы керек!");
      return;
    }

    await app.tablesDB.updateRow({
      databaseId: app.databaseId,
      tableId: app.tableId,
      rowId: room.$id,
      data: {
        status: "playing"
      }
    });

    await refreshLobby();
    showToast("Ойын басталды!");

  } catch (error) {
    console.error(error);
    showToast("Ойынды бастау қатесі: " + error.message);
  } finally {
    busy = false;
  }
});

// PROFILE

$("profileBtn").addEventListener("click", () => {
  const oldName = localStorage.getItem("mafia_name") || "";
  const name = prompt("Жаңа никнейм:", oldName);

  if (name && name.trim()) {
    saveName(name);
    showToast("Никнейм сақталды!");
  }
});

// NAVIGATION

$("scrollJoin").addEventListener("click", () => {
  $("joinSection").scrollIntoView({ behavior: "smooth" });
});

$("randomBtn").addEventListener("click", () => {
  showToast("Кездейсоқ іздеу кейін қосылады.");
});

console.log("M MAFIA — CHAT SYSTEM READY!");
