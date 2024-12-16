const express = require("express");
const http = require("http");
const socketIO = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static("public"));

const UserManager = require("./users/userManager");
const TaskManager = require("./tasks/TaskManager");
const userManager = new UserManager();
const taskManager = new TaskManager(userManager);

io.on("connection", (socket) => {

  // Event zum Beitreten einer bestehenden Lobby
  socket.on("joinLobby", (name) => {
    currentUserID = userManager.addUser(name);  // Benutzer erstellen
    socket.emit("lobbyCreated", currentUserID, name);   // Lobby-Code an den Client zurücksenden
    io.emit("updateUserList", userManager.getAllUsers().map(user => user.getName));
  });

  // Benutzer beim Trennen der Verbindung entfernen
  socket.on("disconnectUser", (userID) => {
    if (userID) {
      userManager.removeUserByID(userID);
      io.emit("updateUserList", userManager.getAllUsers().map(user => user.getName));
    }
  });

  socket.on("requestUserList", () => {
    socket.emit("updateUserList", userManager.getAllUsers().map(user => user.getName));
  });

  //Für das Quiz
  socket.on("submitTask", ({ userId, correct, time }) => {
    taskManager.markTaskCompleted(userId, correct, time);
  
    const allUsers = userManager.getAllUsers().map(user => user.userID);
    if (taskManager.isTaskComplete(allUsers)) {
      taskManager.assignPoints(); // Punkte zuweisen
      const nextTask = taskManager.nextTask();
  
      if (nextTask) {
        io.emit("taskStarted", nextTask); // Nächste Aufgabe senden
      } else {
        io.emit("quizCompleted", userManager.getAllUsers().map(user => ({
          name: user.getName,
          points: user.points
        }))); // Quiz-Endergebnisse senden
        userManager.resetAllPoints(); // Punkte zurücksetzen
      }
    }
  });
  
});

server.listen(3000, () => {
  console.log("Server läuft auf Port 3000");
});

