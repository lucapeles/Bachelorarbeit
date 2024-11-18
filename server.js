const express = require("express");
const http = require("http");
const socketIO = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static("public"));

const UserManager = require("./users/userManager");
const userManager = new UserManager();

let lobbies = {}; // Um alle Lobbies zu speichern

function generateLobbyCode() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

io.on("connection", (socket) => {

  // Event zum Erstellen einer neuen Lobby
  socket.on("createLobby", (name) => {
    currentUser = userManager.addUser(name);  // Benutzer erstellen
    const lobbyCode = generateLobbyCode();    // Neuer Lobbycode
    lobbies[lobbyCode] = [currentUser];       // Neue Lobby mit dem Benutzer erstellen
    currentUser.joinLobby(lobbyCode);        // Lobby dem Benutzer zuweisen
    console.log("Name: ", name, " und Lobby: ", lobbyCode)
    socket.emit("lobbyCreated", lobbyCode);   // Lobby-Code an den Client zurücksenden
  });

  // Event zum Beitreten einer bestehenden Lobby
  socket.on("joinLobby", (lobbyCode, name) => {
    if (lobbies[lobbyCode]) {
      console.log(lobbyCode, " trtt hinzu: ", name)
      currentUser = userManager.addUser(name);  // Benutzer erstellen
      currentUser.joinLobby(lobbyCode);         // Lobby dem Benutzer zuweisen
      lobbies[lobbyCode].push(currentUser);     // Benutzer zur Lobby hinzufügen
      socket.join(lobbyCode);                   // Benutzer zur Lobby-Session hinzufügen
      socket.emit("lobbyCreated", lobbyCode);   // Lobby-Code an den Client zurücksenden
      io.to(lobbyCode).emit("updateParticipants", lobbies[lobbyCode].map(user => user.name)); // Benutzernamen der Teilnehmer senden
    } else {
      socket.emit("errorMessage", "Lobby nicht gefunden");
    }
  });

  // Event zum Abrufen der Teilnehmer in einer Lobby (wird an die Clients gesendet)
  socket.on("getParticipants", (lobbyCode) => {
    if (lobbies[lobbyCode]) {
    }
  });


  //TODO: remove USER???????????????????????????????????????????????????



  // Event für Benutzer-Abmeldung, aber bei disconnect wird immer aufgerufen sobald seite anders
  /*socket.on("disc", () => {
    console.log("geht in disconnect")

    for (const [code, participants] of Object.entries(lobbies)) {
      const index = participants.indexOf(socket.id);
      if (index !== -1) {
        participants.splice(index, 1);
        io.to(code).emit("updateParticipants", participants);
      }
    }
    console.log("Benutzer getrennt");
  });*/
});

server.listen(3000, () => {
  console.log("Server läuft auf Port 3000");
});

