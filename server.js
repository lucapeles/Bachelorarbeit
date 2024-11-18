const express = require("express");
const http = require("http");
const socketIO = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static("public"));

const lobbies = {}; // Um alle Lobbies zu speichern

function generateLobbyCode() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

io.on("connection", (socket) => {
  console.log("check");

  // Event zum Erstellen einer neuen Lobby
  socket.on("createLobby", () => {
    const lobbyCode = generateLobbyCode();
    lobbies[lobbyCode] = []; // Neue Lobby erstellen
    socket.emit("lobbyCreated", lobbyCode); // Lobby-Code an den Client zurücksenden
  });

  // Event zum Beitreten einer bestehenden Lobby
  socket.on("joinLobby", (lobbyCode) => {
    if (lobbies[lobbyCode]) {
      lobbies[lobbyCode].push(socket.id); // Benutzer zu Lobby hinzufügen
      socket.join(lobbyCode); // Den Client dem Raum hinzufügen
      console.log(`Benutzer ${socket.id} zu Lobby ${lobbyCode} hinzugefügt.`);
      io.to(lobbyCode).emit("updateParticipants", lobbies[lobbyCode]); // Teilnehmer aktualisieren
    } else {
      socket.emit("errorMessage", "Lobby nicht gefunden");
    }
  });

  // Event zum Senden einer Nachricht
  socket.on("sendMessage", (lobbyCode, message) => {
    console.log("Nachricht empfangen:", message, lobbyCode); // Debugging
    io.to(lobbyCode).emit("newMessage", message); // Nachricht an alle in der Lobby senden
  });

  // Event für Benutzer-Abmeldung
  socket.on("disconnect", () => {
    for (const [code, participants] of Object.entries(lobbies)) {
      const index = participants.indexOf(socket.id);
      if (index !== -1) {
        participants.splice(index, 1);
        io.to(code).emit("updateParticipants", participants);
      }
    }
    console.log("Benutzer getrennt");
  });
});

server.listen(3000, () => {
  console.log("Server läuft auf Port 3000");
});

