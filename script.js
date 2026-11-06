
const db = window.supabaseClient;

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
    friendsTitle:"Friends", friendsText:"Friends feature is coming soon.",
    leaderTitle:"Leaderboard", leaderText:"Leaderboard is coming soon.",
    historyTitle:"Game history", historyText:"Your game history will appear here.",
    createTitle:"Create a room", roomName:"Room name",
    createNow:"CREATE", joinTitle:"Join a room", roomCode:"Enter room code",
    joinNow:"JOIN", roomCreated:"Room created!",
    invalidCode:"Enter a valid room code.", joined:"You joined the room!",
    copied:"Room code copied!", left:"You left the room.",
    voiceTitle:"Voice chat", voiceText:"Voice chat will be added later.",
    close:"CLOSE", roomDesc:"Share this code with your friends.",
    login:"Sign in", signup:"Create account",
    email:"Email address", password:"Password",
    authRequired:"Sign in or create an account first.",
    authSuccess:"You are signed in!",
    checkEmail:"Check your email to confirm registration.",
    authError:"Authentication failed.",
    logout:"Sign out", account:"Account",
    loading:"Please wait...", roomError:"Could not create room.",
    joinError:"Could not join this room.",
    noRoom:"You are not in a room."
  },
  ru: {
    online:"В СЕТИ", subtitle:"Твои друзья. Твои враги. Один город.",
    create:"СОЗДАТЬ КОМНАТУ", join:"ВОЙТИ В КОМНАТУ",
    ready:"ГОРОД ЖДЁТ", playersOnline:"ИГРОКОВ В СЕТИ",
    gamesPlayed:"СЫГРАНО ИГР", menu:"РАЗДЕЛЫ",
    friends:"Друзья", friendsDesc:"Твои друзья",
    leaderboard:"Рейтинг", leaderDesc:"Лучшие игроки",
    history:"История", historyDesc:"Прошлые игры",
    settings:"Настройки", settingsDesc:"Изменить",
    yourRoom:"ТВОЯ КОМНАТА", waiting:"ОЖИДАНИЕ ИГРОКОВ",
    copyCode:"КОПИРОВАТЬ КОД", leave:"ВЫЙТИ",
    home:"Главная", play:"Играть", settingsTitle:"Настройки",
    language:"Выбери язык", profile:"Твой профиль",
    guest:"Игрок", friendsTitle:"Друзья",
    friendsText:"Функция друзей появится позже.",
    leaderTitle:"Рейтинг", leaderText:"Рейтинг появится позже.",
    historyTitle:"История игр", historyText:"История игр появится здесь.",
    createTitle:"Создать комнату", roomName:"Название комнаты",
    createNow:"СОЗДАТЬ", joinTitle:"Войти в комнату",
    roomCode:"Введи код комнаты", joinNow:"ВОЙТИ",
    roomCreated:"Комната создана!", invalidCode:"Введи правильный код.",
    joined:"Ты вошёл в комнату!", copied:"Код скопирован!",
    left:"Ты вышел из комнаты.", voiceTitle:"Голосовой чат",
    voiceText:"Голосовой чат добавим позже.", close:"ЗАКРЫТЬ",
    roomDesc:"Отправь этот код друзьям.",
    login:"Войти", signup:"Создать аккаунт",
    email:"Электронная почта", password:"Пароль",
    authRequired:"Сначала войди или создай аккаунт.",
    authSuccess:"Ты вошёл в аккаунт!",
    checkEmail:"Подтверди регистрацию через почту.",
    authError:"Ошибка авторизации.", logout:"Выйти",
    account:"Аккаунт", loading:"Подожди...",
    roomError:"Не удалось создать комнату.",
    joinError:"Не удалось войти в комнату.",
    noRoom:"Ты не находишься в комнате."
  },
  kz: {
    online:"ЖЕЛІДЕ", subtitle:"Достарың. Жауларың. Бір қала.",
    create:"БӨЛМЕ ҚҰРУ", join:"БӨЛМЕГЕ КІРУ",
    ready:"ҚАЛА СЕНІ КҮТУДЕ", playersOnline:"ЖЕЛІДЕГІ ОЙЫНШЫЛАР",
    gamesPlayed:"ОЙНАЛҒАН ОЙЫН", menu:"БӨЛІМДЕР",
    friends:"Достар", friendsDesc:"Сенің достарың",
    leaderboard:"Рейтинг", leaderDesc:"Үздік ойыншылар",
    history:"Тарих", historyDesc:"Өткен ойындар",
    settings:"Баптаулар", settingsDesc:"Өзгерту",
    yourRoom:"СЕНІҢ БӨЛМЕҢ", waiting:"ОЙЫНШЫЛАР КҮТІЛУДЕ",
    copyCode:"КОДТЫ КӨШІРУ", leave:"ШЫҒУ",
    home:"Басты бет", play:"Ойнау", settingsTitle:"Баптаулар",
    language:"Тілді таңда", profile:"Сенің профилің",
    guest:"Ойыншы", friendsTitle:"Достар",
    friendsText:"Достар функциясы кейін қосылады.",
    leaderTitle:"Рейтинг", leaderText:"Рейтинг кейін қосылады.",
    historyTitle:"Ойын тарихы", historyText:"Ойын тарихы осында көрсетіледі.",
    createTitle:"Бөлме құру", roomName:"Бөлме атауы",
    createNow:"ҚҰРУ", joinTitle:"Бөлмеге кіру",
    roomCode:"Бөлме кодын енгіз", joinNow:"КІРУ",
    roomCreated:"Бөлме құрылды!", invalidCode:"Дұрыс код енгіз.",
    joined:"Бөлмеге кірдің!", copied:"Код көшірілді!",
    left:"Бөлмеден шықтың.", voiceTitle:"Дауыс чаты",
    voiceText:"Дауыс чаты кейін қосылады.", close:"ЖАБУ",
    roomDesc:"Достарыңды шақыру үшін осы кодты жібер.",
    login:"Кіру", signup:"Аккаунт ашу",
    email:"Электрондық пошта", password:"Құпиясөз",
    authRequired:"Алдымен аккаунтқа кір немесе тіркел.",
    authSuccess:"Аккаунтқа кірдің!",
    checkEmail:"Поштаңа барып тіркелуді раста.",
    authError:"Кіру қатесі.", logout:"Аккаунттан шығу",
    account:"Аккаунт", loading:"Күте тұр...",
    roomError:"Бөлме құру мүмкін болмады.",
    joinError:"Бөлмеге кіру мүмкін болмады.",
    noRoom:"Сен қазір бөлмеде жоқсың."
  }
};

let currentLanguage = "kz";
let currentRoom = null;
let currentUser = null;
let gamesPlayed = 0;

function t(key) {
  return translations[currentLanguage][key] || translations.en[key] || key;
}

function applyLanguage() {
  document.documentElement.lang = currentLanguage;
  document.querySelectorAll("[data-i18n]").forEach(el => {
    el.textContent = t(el.dataset.i18n);
  });
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 2500);
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
    <button class="btn btn-outline" onclick="closeModal()">${t("close")}</button>
  `);
}

function setLanguage(lang) {
  if (!translations[lang]) return;
  currentLanguage = lang;
  applyLanguage();
  showSettings();
}

function showAuth() {
  openModal(`
    <h2>${t("account")}</h2>
    <input class="modal-input" id="auth-email" type="email" autocomplete="email" placeholder="${t("email")}">
    <input class="modal-input" id="auth-password" type="password" autocomplete="current-password" placeholder="${t("password")}">
    <button class="btn btn-primary modal-action" onclick="signIn()">${t("login")}</button>
    <button class="btn btn-outline modal-action" onclick="signUp()">${t("signup")}</button>
  `);
}

function getAuthValues() {
  return {
    email: document.getElementById("auth-email").value.trim(),
    password: document.getElementById("auth-password").value
  };
}

async function signIn() {
  const { email, password } = getAuthValues();
  if (!email || !password) return showToast(t("authError"));

  const { data, error } = await db.auth.signInWithPassword({ email, password });

  if (error) return showToast(error.message);

  currentUser = data.user;
  closeModal();
  showToast(t("authSuccess"));
}

async function signUp() {
  const { email, password } = getAuthValues();
  if (!email || password.length < 6) {
    return showToast("Email енгіз. Құпиясөз кемінде 6 таңба болсын.");
  }

  const { data, error } = await db.auth.signUp({ email, password });

  if (error) return showToast(error.message);

  if (data.session) {
    currentUser = data.user;
    closeModal();
    showToast(t("authSuccess"));
  } else {
    openModal(`<h2>${t("signup")}</h2><p>${t("checkEmail")}</p>`);
  }
}

async function signOut() {
  const { error } = await db.auth.signOut();
  if (error) return showToast(error.message);
  currentUser = null;
  currentRoom = null;
  document.getElementById("room-section").hidden = true;
  closeModal();
  showToast(t("logout"));
}

function showProfile() {
  if (!currentUser) return showAuth();

  openModal(`
    <h2>${t("profile")}</h2>
    <p id="profile-email"></p>
    <button class="btn btn-outline modal-action" onclick="showVoiceInfo()">${t("voiceTitle")}</button>
    <button class="btn btn-primary modal-action" onclick="signOut()">${t("logout")}</button>
  `);

  document.getElementById("profile-email").textContent = currentUser.email || "";
}

function requireAuth() {
  if (currentUser) return true;
  showAuth();
  showToast(t("authRequired"));
  return false;
}

function makeRoomCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

function createRoom() {
  if (!requireAuth()) return;

  openModal(`
    <h2>${t("createTitle")}</h2>
    <input class="modal-input" id="room-name" maxlength="24" placeholder="${t("roomName")}">
    <button class="btn btn-primary modal-action" onclick="confirmCreateRoom()">${t("createNow")}</button>
  `);
}

async function confirmCreateRoom() {
  const name = document.getElementById("room-name").value.trim() || "MAFIA ROOM";
  const code = makeRoomCode();

  const button = document.querySelector("#modal-content .btn-primary");
  if (button) button.disabled = true;

  const { data: room, error } = await db
    .from("rooms")
    .insert({
      code,
      name,
      host_id: currentUser.id,
      status: "waiting",
      max_players: 15
    })
    .select()
    .single();

  if (error) {
    if (button) button.disabled = false;
    return showToast(error.message || t("roomError"));
  }

  const { error: playerError } = await db
    .from("room_players")
    .insert({
      room_id: room.id,
      user_id: currentUser.id,
      nickname: "Player-" + currentUser.id.slice(0, 4)
    });

  if (playerError) {
    showToast(playerError.message);
    return;
  }

  currentRoom = room;
  gamesPlayed++;
  document.getElementById("games-count").textContent = gamesPlayed;
  updateRoom();
  closeModal();
  showToast(t("roomCreated"));
}

function joinRoom() {
  if (!requireAuth()) return;

  openModal(`
    <h2>${t("joinTitle")}</h2>
    <input class="modal-input" id="join-code" maxlength="6" placeholder="${t("roomCode")}">
    <button class="btn btn-primary modal-action" onclick="confirmJoinRoom()">${t("joinNow")}</button>
  `);
}

async function confirmJoinRoom() {
  const code = document.getElementById("join-code").value.trim().toUpperCase();

  if (code.length !== 6) return showToast(t("invalidCode"));

  const { data: room, error } = await db
    .from("rooms")
    .select("*")
    .eq("code", code)
    .eq("status", "waiting")
    .maybeSingle();

  if (error || !room) return showToast(t("joinError"));

  const { error: playerError } = await db
    .from("room_players")
    .insert({
      room_id: room.id,
      user_id: currentUser.id,
      nickname: "Player-" + currentUser.id.slice(0, 4)
    });

  if (playerError) return showToast(playerError.message);

  currentRoom = room;
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

async function initializeApp() {
  if (!db) {
    showToast("Supabase config.js байланысын тексер!");
    return;
  }

  const { data, error } = await db.auth.getSession();

  if (error) {
    showToast(error.message);
    return;
  }

  currentUser = data.session?.user || null;

  db.auth.onAuthStateChange((_event, session) => {
    currentUser = session?.user || null;
  });
}

applyLanguage();
initializeApp();
