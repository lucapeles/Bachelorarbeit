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
    currentUserID = userManager.addUser(name);  // Benutzer erstellen
    socket.emit("lobbyCreated", currentUserID, name);   // Lobby-Code an den Client zurücksenden
    listOfUsers = userManager.getAllUsers().map(user => user.getName);
    socket.emit("updateUserList", listOfUsers);
    console.log(name, " tritt hinzu bei: ", listOfUsers)
  });

  // Benutzer beim Trennen der Verbindung entfernen
  socket.on("disconnectUser", (userID) => {
    if (userID) {
      userManager.removeUserByID(userID);
      listOfUsers = userManager.getAllUsers().map(user => user.getName);
      socket.emit("updateUserList", listOfUsers);
      console.log(`Benutzer mit ID ${userID} wurde entfernt.`, listOfUsers);
    }
  });

  socket.on("requestUserList", () => {
    socket.emit("updateUserList", userManager.getAllUsers().map(user => user.getName));
  });
});

server.listen(3000, () => {
  console.log("Server läuft auf Port 3000");
});

