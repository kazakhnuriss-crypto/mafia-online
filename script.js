const translations = {
  en: {
    online:"ONLINE", subtitle:"Your friends. Your enemies. One city.",
    create:"CREATE ROOM", join:"JOIN ROOM", ready:"THE CITY IS WAITING",
    playersOnline:"PLAYERS ONLINE", gamesPlayed:"GAMES PLAYED",
    menu:"EXPLORE", friends:"Friends", friendsDesc:"Your people",
    leaderboard:"Leaderboard", leaderDesc:"Top players",
    history:"History", historyDesc:"Past games",
    settings:"Settings", settingsDesc:"Customize",
    yourRoom:"YOUR ROOM", waiting:"WAITING FOR PLAYERS",
    copyCode:"COPY CODE", leave:"LEAVE", home:"Home", play:"Play",
    settingsTitle:"Settings", language:"Choose language",
    profile:"Your profile", guest:"Guest Player",
    friendsTitle:"Friends", friendsText:"Your friends list will appear here.",
    leaderTitle:"Leaderboard", leaderText:"The leaderboard will appear here.",
    historyTitle:"Game history", historyText:"Your completed games will appear here.",
    createTitle:"Create a room", roomName:"Room name",
    createNow:"CREATE", joinTitle:"Join a room", roomCode:"Enter room code",
    joinNow:"JOIN", roomCreated:"Room created!",
    invalidCode:"Enter a valid room code.", joined:"Demo room joined!",
    copied:"Room code copied!", left:"You left the room.",
    voiceTitle:"Voice chat", voiceText:"Voice chat will be connected after the online server is added.",
    close:"CLOSE", roomDesc:"Share this code with your friends to invite them.",
    noRoom:"You are not in a room."
  },
  ru: {
    online:"В СЕТИ", subtitle:"Твои друзья. Твои враги. Один город.",
    create:"СОЗДАТЬ КОМНАТУ", join:"ВОЙТИ В КОМНАТУ", ready:"ГОРОД ЖДЁТ",
    playersOnline:"ИГРОКОВ В СЕТИ", gamesPlayed:"СЫГРАНО ИГР",
    menu:"РАЗДЕЛЫ", friends:"Друзья", friendsDesc:"Твои друзья",
    leaderboard:"Рейтинг", leaderDesc:"Лучшие игроки",
    history:"История", historyDesc:"Прошлые игры",
    settings:"Настройки", settingsDesc:"Изменить",
    yourRoom:"ТВОЯ КОМНАТА", waiting:"ОЖИДАНИЕ ИГРОКОВ",
    copyCode:"КОПИРОВАТЬ КОД", leave:"ВЫЙТИ", home:"Главная", play:"Играть",
    settingsTitle:"Настройки", language:"Выбери язык",
    profile:"Твой профиль", guest:"Игрок",
    friendsTitle:"Друзья", friendsText:"Список друзей появится здесь.",
    leaderTitle:"Рейтинг", leaderText:"Таблица лидеров появится здесь.",
    historyTitle:"История игр", historyText:"Здесь будут твои завершённые игры.",
    createTitle:"Создать комнату", roomName:"Название комнаты",
    createNow:"СОЗДАТЬ", joinTitle:"Войти в комнату", roomCode:"Введи код комнаты",
    joinNow:"ВОЙТИ", roomCreated:"Комната создана!",
    invalidCode:"Введи правильный код.", joined:"Демо-комната открыта!",
    copied:"Код комнаты скопирован!", left:"Ты покинул комнату.",
    voiceTitle:"Голосовой чат", voiceText:"Голосовой чат подключим после добавления онлайн-сервера.",
    close:"ЗАКРЫТЬ", roomDesc:"Отправь этот код друзьям для приглашения.",
    noRoom:"Ты не находишься в комнате."
  },
  kz: {
    online:"ЖЕЛІДЕ", subtitle:"Достарың. Жауларың. Бір қала.",
    create:"БӨЛМЕ ҚҰРУ", join:"БӨЛМЕГЕ КІРУ", ready:"ҚАЛА СЕНІ КҮТУДЕ",
    playersOnline:"ЖЕЛІДЕГІ ОЙЫНШЫЛАР", gamesPlayed:"ОЙНАЛҒАН ОЙЫН",
    menu:"БӨЛІМДЕР", friends:"Достар", friendsDesc:"Сенің достарың",
    leaderboard:"Рейтинг", leaderDesc:"Үздік ойыншылар",
    history:"Тарих", historyDesc:"Өткен ойындар",
    settings:"Баптаулар", settingsDesc:"Өзгерту",
    yourRoom:"СЕНІҢ БӨЛМЕҢ", waiting:"ОЙЫНШЫЛАР КҮТІЛУДЕ",
    copyCode:"КОДТЫ КӨШІРУ", leave:"ШЫҒУ", home:"Басты бет", play:"Ойнау",
    settingsTitle:"Баптаулар", language:"Тілді таңда",
    profile:"Сенің профилің", guest:"Қонақ ойыншы",
    friendsTitle:"Достар", friendsText:"Достар тізімі осында көрсетіледі.",
    leaderTitle:"Рейтинг", leaderText:"Үздік ойыншылар кестесі осында болады.",
    historyTitle:"Ойын тарихы", historyText:"Аяқталған ойындарың осында көрсетіледі.",
    createTitle:"Бөлме құру", roomName:"Бөлме атауы",
    createNow:"ҚҰРУ", joinTitle:"Бөлмеге кіру", roomCode:"Бөлме кодын енгіз",
    joinNow:"КІРУ", roomCreated:"Бөлме құрылды!",
    invalidCode:"Дұрыс бөлме кодын енгіз.", joined:"Демо бөлмеге кірдің!",
    copied:"Бөлме коды көшірілді!", left:"Бөлмеден шықтың.",
    voiceTitle:"Дауыс чаты", voiceText:"Дауыс чатын онлайн сервер қосылғаннан кейін іске қосамыз.",
    close:"ЖАБУ", roomDesc:"Достарыңды шақыру үшін осы кодты жібер.",
    noRoom:"Сен қазір бөлмеде жоқсың."
  }
};

let currentLanguage = "kz";
let currentRoom = null;
let gamesPlayed = 0;

function t(key) {
  return translations[currentLanguage][key] || translations.en[key] || key;
}

function applyLanguage() {
  document.documentElement.lang = currentLanguage;
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.dataset.i18n;
    if (t(key)) el.textContent = t(key);
  });
  document.getElementById("games-count").textContent = gamesPlayed;
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 2200);
}

function openModal(html) {
  document.getElementById("modal-content").innerHTML = html;
  document.getElementById("modal").hidden = false;
}

function closeModal() {
  document.getElementById("modal").hidden = true;
}

function showSettings() {
  openModal(`
    <h2>${t("settingsTitle")}</h2>
    <p>${t("language")}</p>
    <div class="language-list">
      <button class="language-btn ${currentLanguage==="en"?"selected":""}" onclick="setLanguage('en')">🇬🇧 EN</button>
      <button class="language-btn ${currentLanguage==="ru"?"selected":""}" onclick="setLanguage('ru')">🇷🇺 RU</button>
      <button class="language-btn ${currentLanguage==="kz"?"selected":""}" onclick="setLanguage('kz')">🇰🇿 KZ</button>
    </div>
    <button class="btn btn-outline modal-action" onclick="closeModal()">${t("close")}</button>
  `);
}

function setLanguage(lang) {
  if (!translations[lang]) return;
  currentLanguage = lang;
  applyLanguage();
  showSettings();
}

function createRoom() {
  openModal(`
    <h2>${t("createTitle")}</h2>
    <input class="modal-input" id="room-name" maxlength="24" placeholder="${t("roomName")}">
    <button class="btn btn-primary modal-action" onclick="confirmCreateRoom()">${t("createNow")}</button>
  `);
}

function makeRoomCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

function confirmCreateRoom() {
  const name = document.getElementById("room-name").value.trim() || "MAFIA ROOM";
  currentRoom = { code: makeRoomCode(), name };
  gamesPlayed++;
  document.getElementById("games-count").textContent = gamesPlayed;
  updateRoom();
  closeModal();
  showToast(t("roomCreated"));
}

function joinRoom() {
  openModal(`
    <h2>${t("joinTitle")}</h2>
    <input class="modal-input" id="join-code" maxlength="6" placeholder="${t("roomCode")}">
    <button class="btn btn-primary modal-action" onclick="confirmJoinRoom()">${t("joinNow")}</button>
  `);
}

function confirmJoinRoom() {
  const code = document.getElementById("join-code").value.trim().toUpperCase();
  if (code.length !== 6) {
    showToast(t("invalidCode"));
    return;
  }
  currentRoom = { code, name: "MAFIA ROOM" };
  updateRoom();
  closeModal();
  showToast(t("joined"));
}

function updateRoom() {
  const section = document.getElementById("room-section");
  section.hidden = !currentRoom;
  if (!currentRoom) return;
  document.getElementById("room-code").textContent = currentRoom.code;
  document.getElementById("room-title").textContent = currentRoom.name;
  document.getElementById("room-description").textContent = t("roomDesc");
  section.scrollIntoView({ behavior: "smooth", block: "center" });
}

async function copyRoomCode() {
  if (!currentRoom) return;
  try {
    await navigator.clipboard.writeText(currentRoom.code);
    showToast(t("copied"));
  } catch {
    showToast(currentRoom.code);
  }
}

function leaveRoom() {
  currentRoom = null;
  document.getElementById("room-section").hidden = true;
  showToast(t("left"));
}

function showProfile() {
  openModal(`
    <h2>${t("profile")}</h2>
    <div class="info-row">👤 ${t("guest")}</div>
    <div class="info-row">🎮 ${gamesPlayed} ${t("gamesPlayed")}</div>
    <button class="btn btn-outline modal-action" onclick="showVoiceInfo()">${t("voiceTitle")}</button>
  `);
}

function showFriends() {
  openModal(`<h2>${t("friendsTitle")}</h2><p>${t("friendsText")}</p>`);
}

function showLeaderboard() {
  openModal(`<h2>${t("leaderTitle")}</h2><p>${t("leaderText")}</p>`);
}

function showHistory() {
  openModal(`<h2>${t("historyTitle")}</h2><p>${t("historyText")}</p>`);
}

function showVoiceInfo() {
  openModal(`<h2>${t("voiceTitle")}</h2><p>${t("voiceText")}</p>`);
}

function goHome() {
  window.scrollTo({ top: 0, behavior: "smooth" });
  closeModal();
}

applyLanguage();
