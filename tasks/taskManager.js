class TaskManager {
  constructor(userManager) {
    this.tasks = []; // Liste aller Aufgaben
    this.currentTaskIndex = -1; // Index der aktuellen Aufgabe
    this.userManager = userManager; // Referenz auf den UserManager
    this.usersWhoHaveFinished = [];
    this.currentCorrectUsers = [];
    this.time = null;
  }

  // Aufgaben laden
  loadTasks(tasks) {
    this.tasks = tasks; // Aufgaben setzen
    this.currentTaskIndex = 0; // Start mit der ersten Aufgabe
  }

  // Aktuelle Aufgabe holen
  getCurrentTask() {
    return this.tasks[this.currentTaskIndex] || null;
  }

  // Aktuelle Lösung holen
  getCurrentSolution() {
    return this.tasks[this.currentTaskIndex].correctAnswer || null;
  }

  // Aktuelle korrekte Nutzer holen
  getCurrentCorrectUsers() {
    return this.currentCorrectUsers;
  }

  // Benutzer bearbeitet Aufgabe und gibt ab
  markTaskCompleted(userID, answer, time) {
    this.usersWhoHaveFinished.push(userID);
    const currentTask = this.getCurrentTask();
    if (!currentTask) return; // Keine gültige Aufgabe
    const isCorrect = this.checkAnswer(currentTask, answer); // Antwort überprüfen

    // Punkte zuweisen, wenn die Antwort korrekt ist
    if (isCorrect) {
      this.currentCorrectUsers.push(userID);
      this.assignPoints(userID);
      if (this.currentCorrectUsers.length == 1) { //der Erste mit richtiger Antwort
        this.time = time;
      }
    }
    if (this.usersWhoHaveFinished.length == this.userManager.getAllUsers().length) {
      this.usersWhoHaveFinished = []; // Zurücksetzen der Liste, wenn alle fertig sind
      return true; //Alle fertig, also jetzt Ergebnis anzeigen
    }
    return false;
  }

  // Antwort prüfen (je nach Aufgabentyp)
  checkAnswer(task, answer) {
    if (task.type === "multipleChoice") {
      return task.correctAnswer === answer; // Vergleich für Multiple-Choice
    } else if (task.type === "text") {
      return answer.trim().toLowerCase() === task.correctAnswer?.trim().toLowerCase(); // Vergleich für Text
    } else if (task.type === "coding") {

      //TODO

      return false; // Noch nicht implementiert
    } else if (task.type === "output") { //output angeben
      return answer === task.correctAnswer;
    }
    return false; // Unbekannter Typ
  }

  // Punktevergabe durch UserManager abhängig der Reihenfolge
  assignPoints(userID) {
    let points = this.userManager.getAllUsers().length - this.usersWhoHaveFinished.length + 1;
    this.userManager.updatePoints(userID, points);
  }

  resetAll() {
    this.tasks = []; // Liste aller Aufgaben
    this.currentTaskIndex = -1; // Index der aktuellen Aufgabe
    this.usersWhoHaveFinished = [];
    this.currentCorrectUsers = [];
  }

  //zurücksetzen der Fertigen
  resetFinished() {
    this.usersWhoHaveFinished = [];
  }

  // Nächste Aufgabe starten
  nextTask() {
    if (this.currentTaskIndex < this.tasks.length - 1) {
      this.currentTaskIndex++;
      this.currentCorrectUsers = [];
      return this.getCurrentTask();
    }
    return null; // Keine weiteren Aufgaben verfügbar
  }

  getTime() {
    return this.time;
  }

  resetTime() {
    this.time = null;
  }
}

module.exports = TaskManager;
