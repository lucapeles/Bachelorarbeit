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

  let taskCompleted = false;
  //Korrigieren , speichern & prüfen ob alle fertig sind
  socket.on("submitTask", (data) => { // data = { userID, selectedAnwser, time }
    taskCompleted = false;
    if (taskManager.markTaskCompleted(data[0], data[1], data[2])) {
      taskFinished();
    }
    updateUserList(); //Master aktualisieren mit neuer Punktzahl & Show aktualisieren

    if (!taskCompleted) { // data = { finishedUsers, numberOfUsers }
      io.emit("updateProgress", [taskManager.getUsersWhoHaveFinished().length, userManager.getNumberOfUsers()]);
    }

    const rank = taskManager.getRankForUser(data[0]); // Holt den Rang des Spielers
    if (rank <= 3) { // Ranganzeige für top 3
      io.emit("showPersonalRank", [data[0], rank]); // An den Spieler senden
    }

    if (taskManager.getTime()) {
      io.emit("timeLeft", taskManager.getTime());
      taskManager.resetTime();
    }
  });

  //Zeit abgelaufen
  socket.on("timeLost", () => {
    taskManager.resetFinished(); //weil markTaskCompleted übergangen wird
    taskFinished();
  });

  function taskFinished() {
    io.emit("taskCompleted", [taskManager.getCurrentSolution(), true]); //an show senden
    io.emit("showTrueOrFalse", taskManager.getCurrentCorrectUsers()); //for the Users
    io.emit("nextTaskButton");
    taskCompleted = true;
    if (taskManager.isThereATaskLeft()) {
      io.emit("nextTaskCountdown", 6); // Starte den Countdown (6 Sekunden)
    } else {
      startNextTask();
    }
  }

  //Nächste Aufgabe oder letzte Aufgabe
  socket.on("startNextTask", () => {
    startNextTask();
  });

  function startNextTask() {
    const nextTask = taskManager.nextTask();
    if (nextTask) {
      io.emit("newTask", nextTask); // Nächste Aufgabe an alle Clients senden
    } else {
      io.emit("quizCompleted", userManager.getRanking()); // Falls keine weiteren Aufgaben mehr da sind
    }
  }

  socket.on("requestRanking", () => {
    socket.emit("sendRanking", userManager.getRanking());
  });


  //Punkte zurücksetzen
  socket.on("resetQuestions", (data) => { //data = points OR questions
    if (data === "points") {
      userManager.resetAllPoints();
    }
    taskManager.resetAll();
    io.emit("reset");
    io.emit("backToShow"); //Damit Siegerehrung wieder zu show wechselt
    updateUserList();
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

