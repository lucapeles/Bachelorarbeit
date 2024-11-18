const socket = io();

function joinLobby() {
  const lobbyCode = document.getElementById("lobbyCodeInput").value;
  socket.emit("joinLobby", lobbyCode);
}

socket.on("updateParticipants", (participants) => {
  // Teilnehmerliste aktualisieren
});

socket.on("lobbyCreated", (lobbyCode) => {
  console.log("Lobby erstellt mit Code:", lobbyCode);
  window.location.href = `/lobby.html?code=${lobbyCode}`;
});

socket.on("errorMessage", (message) => {
  alert(message);
});
