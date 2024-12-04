const express = require("express");
const http = require("http");
const socketIO = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static("public"));

const UserManager = require("./users/userManager");
const userManager = new UserManager();

io.on("connection", (socket) => {

  // Event zum Beitreten einer bestehenden Lobby
  socket.on("joinLobby", (name) => {
      console.log(name, " tritt hinzu")
      currentUserID = userManager.addUser(name);  // Benutzer erstellen
      socket.emit("lobbyCreated", currentUserID, name);   // Lobby-Code an den Client zurücksenden
  });

  // Event zum Abrufen der Teilnehmer in einer Lobby (wird an die Clients gesendet)
  socket.on("getParticipants", (lobbyCode) => {
    const participants = lobbies[lobbyCode]?.map(user => user.name) || [];
    console.log(participants)
    socket.emit("updateParticipants", participants);
  });
  


  //TODO: remove USER???????????????????????????????????????????????????

});

server.listen(3000, () => {
  console.log("Server läuft auf Port 3000");
});

