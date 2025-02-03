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
const { log } = require("console");


io.on("connection", (socket) => {

  // Event zum Beitreten einer bestehenden Lobby
  socket.on("joinLobby", (name) => {
    currentUserID = userManager.addUser(name);  // Benutzer erstellen
    socket.emit("lobbyCreated", currentUserID, name);   // Lobby-Code an den Client zurücksenden
    updateUserList();
  });

  //Namensliste zurückschicken
  socket.on("getNameList", (userName) => {
    console.log(userManager.getAllUsers().map(user => ({ name: user.getName })));
    socket.emit("NameList", [userName, userManager.getAllUsers().map(user => ({ name: user.getName }))]);
  });

  // Benutzer beim Trennen der Verbindung entfernen
  socket.on("disconnectUser", (userID) => {
    if (userID) {
      userManager.removeUserByID(userID);
      updateUserList();
    }
  });

  // Benutzerliste mit Punktestand senden
  socket.on("requestUserList", () => {
    updateUserList();
  });

  //Benutzername ändern, im Link des Clients egal
  socket.on("changeUserName", (data) => { // data = { userID, newName }
    userManager.changeName(data[0], data[1]);
    updateUserList();
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
  socket.on("submitTask", (data) => { // data = { userID, selectedAnwser, time }
    if (taskManager.markTaskCompleted(data[0], data[1], data[2])) {
      io.emit("taskCompleted", [taskManager.getCurrentSolution(), true]); //an show senden
      io.emit("showTrueOrFalse", taskManager.getCurrentCorrectUsers()); //for the Users
      io.emit("nextTaskButton");
    }
    //Master aktualisieren mit neuer Punktzahl & Show aktualisieren
    updateUserList();
    if (taskManager.getTime()) {
      io.emit("timeLeft", taskManager.getTime());
      taskManager.resetTime();
    }
  });

  //Nächste Aufgabe oder letzte Aufgabe
  socket.on("startNextTask", () => {
    const nextTask = taskManager.nextTask();
    if (nextTask) {
      io.emit("newTask", nextTask); // Nächste Aufgabe an alle Clients senden
    } else {
      //TODO: Quiz fertig
    }
  });

  //Zeit abgelaufen
  socket.on("timeLost", () => {
    taskManager.resetFinished(); //weil markTaskCompleted übergangen wird
    io.emit("taskCompleted", [taskManager.getCurrentSolution(), false]); //an show senden
    io.emit("showTrueOrFalse", taskManager.getCurrentCorrectUsers()); //for the Users
    io.emit("nextTaskButton");
  });

  //Punkte zurücksetzen
  socket.on("resetQuestions", (data) => { //data = points OR questions
    if (data === "points") {
      userManager.resetAllPoints();
    }
    taskManager.resetAll();
    updateUserList();
    io.emit("reset");
  });

  //Zeit hinzufügen
  socket.on("addTime", (time) => {
    io.emit("addTimeForShow", time);
  });

  function updateUserList() {
    io.emit("updateUserList", userManager.getAllUsers().map(user => ({
      name: user.getName,
      userID: user.getUserID,
      points: user.points
    })));
    io.emit("loadDiagram", userManager.getAllUsers().map(user => ({
      name: user.getName,
      userID: user.getUserID,
      points: user.points
    })));
  }

  socket.on("test", (data) => {
    console.log(data);
  });

});

server.listen(3000, () => {
  console.log("Server läuft auf Port 3000");
});

