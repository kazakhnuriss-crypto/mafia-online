function showSettings() {
  document.getElementById("settings")
    .classList.toggle("hidden");
}

function setLanguage(lang) {
  alert("Language selected: " + lang);
}

function createRoom() {
  alert("Room system is coming soon!");
}

function joinRoom() {
  const code = prompt("Enter room code:");
  if (code) alert("Room code: " + code);
}
