
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

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

function generateCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

function openModal() {
  modal.classList.remove("hidden");
  result.textContent = "";
  nickname.value = localStorage.getItem("mafia_name") || "";
}

function hideModal() {
  modal.classList.add("hidden");
}

createBtn.addEventListener("click", openModal);
closeModal.addEventListener("click", hideModal);

confirmBtn.addEventListener("click", async () => {
  const host = nickname.value.trim();

  if (!host) {
    showToast("Никнейм енгіз!");
    return;
  }

  if (!app) {
    showToast("Appwrite конфигурациясы табылмады!");
    return;
  }

  confirmBtn.disabled = true;
  confirmBtn.textContent = "ЖАСАЛУДА...";

  try {
    const code = generateCode();

    await app.tablesDB.createRow({
      databaseId: app.databaseId,
      tableId: app.tableId,
      rowId: Appwrite.ID.unique(),
      data: {
        code: code,
        host: host,
        maxPlayers: 20,
        status: "waiting",
        players: JSON.stringify([host])
      }
    });

    localStorage.setItem("mafia_name", host);

    result.textContent = "Бөлме коды: " + code;
    showToast("Бөлме сәтті құрылды!");

  } catch (error) {
    console.error(error);
    showToast("Қате: " + error.message);
  } finally {
    confirmBtn.disabled = false;
    confirmBtn.textContent = "ЖАЛҒАСТЫРУ →";
  }
});

async function joinRoom(code) {
  if (!app) {
    showToast("Appwrite қосылмаған!");
    return;
  }

  code = code.trim().toUpperCase();

  if (!code) {
    showToast("Бөлме кодын енгіз!");
    return;
  }

  try {
    const response = await app.tablesDB.listRows({
      databaseId: app.databaseId,
      tableId: app.tableId,
      queries: [
        Appwrite.Query.equal("code", code),
        Appwrite.Query.limit(1)
      ]
    });

    if (response.rows.length === 0) {
      showToast("Мұндай бөлме табылмады!");
      return;
    }

    const room = response.rows[0];

    showToast("Бөлме табылды: " + room.code);

  } catch (error) {
    console.error(error);
    showToast("Бөлмеге қосылу қатесі: " + error.message);
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

document.getElementById("profileBtn").addEventListener("click", () => {
  const oldName = localStorage.getItem("mafia_name") || "";
  const newName = prompt("Жаңа никнейм:", oldName);

  if (newName && newName.trim()) {
    localStorage.setItem("mafia_name", newName.trim());
    showToast("Никнейм сақталды!");
  }
});

document.getElementById("scrollJoin").addEventListener("click", () => {
  document.getElementById("joinSection").scrollIntoView({
    behavior: "smooth"
  });
});

document.getElementById("randomBtn").addEventListener("click", () => {
  showToast("Әзірге бөлмелер іздеу функциясы дайындалуда.");
});

console.log("Mafia Online дайын!");
console.log("Appwrite конфигурациясы:", app ? "табылды" : "табылмады");
