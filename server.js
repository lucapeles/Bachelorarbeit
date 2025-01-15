const express = require("express");
const http = require("http");
const socketIO = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static("public"));
app.use("/tasks", express.static("tasks"));


const UserManager = require("./users/userManager");
const TaskManager = require("./tasks/taskManager");
const userManager = new UserManager();
const taskManager = new TaskManager(userManager);
const taskPool = require("./tasks/taskData");


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

  //Alle User anzeigen
  socket.on("requestUserList", () => {
    socket.emit("updateUserList", userManager.getAllUsers().map(user => user.getName));
  });

  //Aufgaben an Masteransicht senden
  socket.on("requestTaskPool", () => {
    socket.emit("sendTaskPool", taskPool); // Aufgaben an den Client senden
  });

  //Quiz starten:
  socket.on("startQuiz", (tasks) => {
    taskManager.loadTasks(tasks); // Aufgaben in den TaskManager laden
    const firstTask = taskManager.getCurrentTask();
    if (firstTask) {
      io.emit("newTask", firstTask); // Erste Aufgabe an alle Clients senden
    }
  });
  
  //Korrigieren , speichern & prüfen ob alle fertig sind
  socket.on("submitTask", (data) => { // data = { userId, selectedAnwser }
    console.log(data[0]);
    console.log(data[1]);
    if (taskManager.markTaskCompleted(data[0], data[1])) {
      //nächste aufgabe
    }
  
    const allUsers = userManager.getAllUsers().map(user => user.userID);
    /*if (taskManager.isTaskComplete(allUsers)) {
      const nextTask = taskManager.nextTask();
      if (nextTask) {
        io.emit("taskStarted", nextTask); // Nächste Aufgabe an alle Clients senden
      } else {
        io.emit("quizCompleted", userManager.getAllUsers().map(user => ({
          name: user.getName,
          points: user.points
        })));
      }
    }*/
  
    // Fortschritt an Master senden
    const progress = taskManager.getProgress();
    io.to("master").emit("progressUpdate", progress);
  });

  socket.on("test", (test) => {
    console.log(test);
  });
  
});

server.listen(3000, () => {
  console.log("Server läuft auf Port 3000");
});

