
const app = window.mafiaAppwrite;

const createBtn = document.getElementById("createBtn");
const joinBtn = document.getElementById("joinBtn");
const modal = document.getElementById("modal");
const closeModal = document.getElementById("closeModal");
const confirmBtn = document.getElementById("confirmBtn");
const nickname = document.getElementById("nickname");
const roomCode = document.getElementById("roomCode");
const result = document.getElementById("result");
const toast = document.getElementById("toast");

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(() => toast.classList.remove("show"), 3000);
}

function generateCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

function getName() {
  let name = localStorage.getItem("mafia_name");

  if (!name) {
    name = prompt("Ойыншы никнейміңді енгіз:");
  }

  if (!name || !name.trim()) return null;

  name = name.trim().slice(0, 20);
  localStorage.setItem("mafia_name", name);

  return name;
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
  const host = nickname.value.trim();

  if (!host) {
    showToast("Никнейм енгіз!");
    return;
  }

  confirmBtn.disabled = true;

  try {
    const code = generateCode();

    await app.tablesDB.createRow({
      databaseId: app.databaseId,
      tableId: app.tableId,
      rowId: Appwrite.ID.unique(),
      data: {
        code,
        host,
        maxPlayers: 20,
        currentPlayers: 1,
        status: "waiting",
        players: JSON.stringify([host])
      }
    });

    localStorage.setItem("mafia_name", host);

    result.textContent = "Бөлме коды: " + code;
    showToast("Бөлме құрылды!");

  } catch (error) {
    console.error(error);
    showToast("Қате: " + error.message);
  } finally {
    confirmBtn.disabled = false;
  }
});

// БӨЛМЕГЕ ҚОСЫЛУ
async function joinRoom(code) {
  if (!app) {
    showToast("Appwrite табылмады!");
    return;
  }

  code = code.trim().toUpperCase();

  if (!code) {
    showToast("Бөлме кодын енгіз!");
    return;
  }

  const player = getName();
  if (!player) return;

  try {
    showToast("Бөлме ізделуде...");

    const response = await app.tablesDB.listRows({
      databaseId: app.databaseId,
      tableId: app.tableId,
      queries: [
        Appwrite.Query.equal("code", code),
        Appwrite.Query.limit(1)
      ]
    });

    if (response.rows.length === 0) {
      showToast("Бөлме табылмады!");
      return;
    }

    const room = response.rows[0];

    if (room.status !== "waiting") {
      showToast("Бұл ойын басталып кеткен!");
      return;
    }

    let players = [];

    try {
      players = JSON.parse(room.players || "[]");
    } catch {
      players = [];
    }

    if (players.includes(player)) {
      showToast("Сен бұл бөлмедесің!");
      return;
    }

    const count = players.length;

    if (count >= room.maxPlayers) {
      showToast("Бөлме толып кетті!");
      return;
    }

    players.push(player);

    await app.tablesDB.updateRow({
      databaseId: app.databaseId,
      tableId: app.tableId,
      rowId: room.$id,
      data: {
        players: JSON.stringify(players),
        currentPlayers: players.length
      }
    });

    showToast("Бөлмеге сәтті қосылдың!");

  } catch (error) {
    console.error(error);
    showToast("Қосылу қатесі: " + error.message);
  }
}

joinBtn.addEventListener("click", () => {
  joinRoom(roomCode.value);
});

document.querySelectorAll(".room-join-btn").forEach(button => {
  button.addEventListener("click", () => {
    joinRoom(button.dataset.code);
  });
});

// ПРОФИЛЬ
document.getElementById("profileBtn").addEventListener("click", () => {
  const oldName = localStorage.getItem("mafia_name") || "";
  const name = prompt("Жаңа никнейм:", oldName);

  if (name && name.trim()) {
    localStorage.setItem("mafia_name", name.trim().slice(0, 20));
    showToast("Никнейм сақталды!");
  }
});

// БӨЛМЕГЕ ЖЫЛЖУ
document.getElementById("scrollJoin").addEventListener("click", () => {
  document.getElementById("joinSection").scrollIntoView({
    behavior: "smooth"
  });
});

// КЕЗДЕЙСОҚ ОЙЫН
document.getElementById("randomBtn").addEventListener("click", () => {
  showToast("Кездейсоқ іздеу келесі кезеңде қосылады.");
});

console.log("Mafia Online іске қосылды!");
