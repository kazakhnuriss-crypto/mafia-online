
const $ = id => document.getElementById(id);

let playerName = localStorage.getItem("mafia_name") || "";

function toast(message) {
  const box = $("toast");
  if (!box) {
    alert(message);
    return;
  }

  box.textContent = message;
  box.classList.add("show");

  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => {
    box.classList.remove("show");
  }, 2500);
}

// Бөлме терезесін ашу
$("createBtn").onclick = () => {
  $("modal").classList.remove("hidden");
  $("nickname").value = playerName;
  $("result").textContent = "";
};

// Терезені жабу
$("closeModal").onclick = () => {
  $("modal").classList.add("hidden");
};

// Сыртқы аймақты басқанда жабу
$("modal").onclick = event => {
  if (event.target === $("modal")) {
    $("modal").classList.add("hidden");
  }
};

// Бөлме жасау
$("confirmBtn").onclick = () => {
  const name = $("nickname").value.trim();

  if (name.length < 2) {
    toast("Ойыншы атын енгіз!");
    return;
  }

  playerName = name;
  localStorage.setItem("mafia_name", name);

  const code = Math.random()
    .toString(36)
    .substring(2, 6)
    .toUpperCase();

  $("result").innerHTML =
    `Сәлем, <b>${name}</b>!<br><br>
     Бөлме коды: <b>${code}</b><br>
     <small>Онлайн жүйені Appwrite қосылғанда іске қосамыз.</small>`;

  $("confirmBtn").textContent = "ДАЙЫН";
  $("confirmBtn").onclick = () => {
    $("modal").classList.add("hidden");
    $("confirmBtn").textContent = "ЖАЛҒАСТЫРУ →";
  };
};

// Бөлме кодымен кіру
function joinRoom(code) {
  code = code.trim().toUpperCase();

  if (code.length < 4) {
    toast("Бөлме кодын дұрыс енгіз!");
    return;
  }

  toast("Код қабылданды: " + code);
}

$("joinBtn").onclick = () => {
  joinRoom($("roomCode").value);
};

$("roomCode").addEventListener("keydown", event => {
  if (event.key === "Enter") {
    joinRoom($("roomCode").value);
  }
});

$("roomCode").addEventListener("input", event => {
  event.target.value = event.target.value
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "");
});

// Дайын бөлмеге кіру
document.querySelectorAll(".join[data-code]").forEach(button => {
  button.onclick = () => {
    joinRoom(button.dataset.code);
  };
});

// Кездейсоқ ойын
$("randomBtn").onclick = () => {
  toast("Кездейсоқ ойын әзірге дайындалуда.");
};

// Лоббиге жылжу
$("scrollJoin").onclick = () => {
  $("joinPanel").scrollIntoView({
    behavior: "smooth",
    block: "center"
  });

  $("roomCode").focus();
};

// Профиль
$("profileBtn").onclick = () => {
  const name = prompt("Жаңа ойыншы атыңды енгіз:", playerName);

  if (name && name.trim().length >= 2) {
    playerName = name.trim();
    localStorage.setItem("mafia_name", playerName);
    toast("Профиль жаңартылды!");
  }
};
