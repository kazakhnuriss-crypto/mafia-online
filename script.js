
const app = window.mafiaAppwrite;

const $ = id => document.getElementById(id);

const createBtn = $("createBtn");
const joinBtn = $("joinBtn");
const modal = $("modal");
const closeModal = $("closeModal");
const confirmBtn = $("confirmBtn");
const nickname = $("nickname");
const roomCode = $("roomCode");
const result = $("result");
const toast = $("toast");

let currentRoom = null;
let refreshTimer = null;
let busy = false;

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

function openModal() {
  modal.classList.remove("hidden");
  nickname.value = localStorage.getItem("mafia_name") || "";
  result.textContent = "";
}

function hideModal() {
  modal.classList.add("hidden");
}

createBtn.addEventListener("click", openModal);
closeModal.addEventListener("click", hideModal);

// БӨЛМЕ ҚҰРУ
confirmBtn.addEventListener("click", async () => {
  if (busy) return;

  const name = nickname.value.trim();

  if (!name) {
    showToast("Никнейм енгіз!");
    return;
  }

  busy = true;
  confirmBtn.disabled = true;

  try {
    const player = getPlayer();
    player.name = name;
    saveName(name);

    const code = generateCode();

    const response = await app.tablesDB.createRow({
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
        ])
      }
    });

    hideModal();
    await enterLobby(response);

    showToast("Бөлме құрылды!");

  } catch (error) {
    console.error(error);
    showToast("Қате: " + error.message);
  } finally {
    busy = false;
    confirmBtn.disabled = false;
  }
});

// БӨЛМЕНІ КОДПЕН ТАБУ
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
    player.name = name;

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

// LOBBY АШУ
async function enterLobby(room) {
  currentRoom = room;

  $("lobby").classList.remove("hidden");
  $("lobbyCode").textContent = room.code;

  $("lobby").scrollIntoView({
    behavior: "smooth"
  });

  await refreshLobby();

  if (refreshTimer) clearInterval(refreshTimer);

  refreshTimer = setInterval(refreshLobby, 3000);
}

// LOBBY ЖАҢАРТУ
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

    const list = $("playersList");
    list.replaceChildren();

    players.forEach(player => {
      const card = document.createElement("article");
      card.className = "room-card";

      const title = document.createElement("h3");
      title.textContent = player.name;

      const status = document.createElement("p");
      status.textContent = player.ready ? "🟢 ДАЙЫН" : "🔴 КҮТУДЕ";

      const owner = document.createElement("span");
      owner.className = "room-status";
      owner.textContent =
        player.name === room.host ? "OWNER" : "PLAYER";

      card.append(owner, title, status);
      list.append(card);
    });

    const isOwner = me.name === room.host;

    $("startGameBtn").classList.toggle("hidden", !isOwner);

    $("readyBtn").textContent =
      players.find(p => p.id === me.id)?.ready
        ? "ДАЙЫН ЕМЕСПІН"
        : "ДАЙЫН";

    if (room.status === "playing") {
      showToast("Ойын басталды!");
    }

  } catch (error) {
    console.error(error);
    showToast("Lobby жаңарту қатесі");
  }
}

// ДАЙЫНДЫҚ
$("readyBtn").addEventListener("click", async () => {
  if (!currentRoom || busy) return;

  busy = true;

  try {
    const players = normalizePlayers(currentRoom.players);
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
      rowId: currentRoom.$id,
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

// БӨЛМЕДЕН ШЫҒУ
$("leaveBtn").addEventListener("click", async () => {
  if (!currentRoom || busy) return;

  busy = true;

  try {
    const players = normalizePlayers(currentRoom.players);
    const me = getPlayer();

    const remaining = players.filter(p => p.id !== me.id);

    const newHost =
      remaining.length > 0 ? remaining[0].name : currentRoom.host;

    await app.tablesDB.updateRow({
      databaseId: app.databaseId,
      tableId: app.tableId,
      rowId: currentRoom.$id,
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

// ОЙЫНДЫ БАСТАУ
$("startGameBtn").addEventListener("click", async () => {
  if (!currentRoom || busy) return;

  const players = normalizePlayers(currentRoom.players);

  if (players.length < 2) {
    showToast("Кемінде 2 ойыншы керек!");
    return;
  }

  if (!players.every(p => p.ready)) {
    showToast("Барлық ойыншы дайын болуы керек!");
    return;
  }

  busy = true;

  try {
    await app.tablesDB.updateRow({
      databaseId: app.databaseId,
      tableId: app.tableId,
      rowId: currentRoom.$id,
      data: {
        status: "playing"
      }
    });

    showToast("Ойын басталды!");

  } catch (error) {
    console.error(error);
    showToast("Ойынды бастау қатесі: " + error.message);
  } finally {
    busy = false;
  }
});

// ПРОФИЛЬ
$("profileBtn").addEventListener("click", () => {
  const oldName = localStorage.getItem("mafia_name") || "";
  const name = prompt("Жаңа никнейм:", oldName);

  if (name && name.trim()) {
    saveName(name);
    showToast("Никнейм сақталды!");
  }
});

// БӨЛМЕГЕ ЖЫЛЖУ
$("scrollJoin").addEventListener("click", () => {
  $("joinSection").scrollIntoView({
    behavior: "smooth"
  });
});

// КЕЗДЕЙСОҚ ОЙЫН
$("randomBtn").addEventListener("click", () => {
  showToast("Кездейсоқ іздеу кейін қосылады.");
});

console.log("M MAFIA Lobby дайын!");
