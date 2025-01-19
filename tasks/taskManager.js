class TaskManager {
  constructor(userManager) {
    this.tasks = []; // Liste aller Aufgaben
    this.currentTaskIndex = -1; // Index der aktuellen Aufgabe
    this.taskProgress = {}; // Fortschritt der Benutzer: { userID: { completed: boolean, correct: boolean } }
    this.userManager = userManager; // Referenz auf den UserManager
    this.usersWhoHaveFinished = []
  }

  // Aufgaben laden
  loadTasks(tasks) {
    this.tasks = tasks; // Aufgaben setzen
    this.currentTaskIndex = 0; // Start mit der ersten Aufgabe
    this.resetProgress(); // Fortschritt zurücksetzen
  }

  // Aktuelle Aufgabe holen
  getCurrentTask() {
    return this.tasks[this.currentTaskIndex] || null;
  }

  // Aktuelle Lösung holen
  getCurrentSolution() {
    return this.tasks[this.currentTaskIndex].correctAnswer || null;
  }

  // Benutzer bearbeitet Aufgabe und gibt ab
  markTaskCompleted(userID, answer) {
    this.usersWhoHaveFinished.push(userID);
    const currentTask = this.getCurrentTask();
    if (!currentTask) return; // Keine gültige Aufgabe
    const isCorrect = this.checkAnswer(currentTask, answer); // Antwort überprüfen

    this.taskProgress[userID] = { completed: true, correct: isCorrect }; //als completed markieren
    // Punkte zuweisen, wenn die Antwort korrekt ist
    if (isCorrect) {
      this.assignPoints(userID);
    }
    if (this.usersWhoHaveFinished.length == this.userManager.getAllUsers().length) {
      this.usersWhoHaveFinished = []; // Zurücksetzen der Liste, wenn ale fertig sind
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
    }
    return false; // Unbekannter Typ
  }

  // Punktevergabe durch UserManager abhängig der Reihenfolge
  assignPoints(userID) {
    let points = this.userManager.getAllUsers().length - this.usersWhoHaveFinished.length + 1;
    this.userManager.updatePoints(userID, points);
  }

  // Fortschritt zurücksetzen
  resetProgress() {
    this.taskProgress = {}; // Fortschritt für nächste Aufgabe leeren
  }

  // Nächste Aufgabe starten
  nextTask() {
    if (this.currentTaskIndex < this.tasks.length - 1) {
      this.currentTaskIndex++;
      this.resetProgress(); // Fortschritt für neue Aufgabe zurücksetzen
      return this.getCurrentTask();
    }
    return null; // Keine weiteren Aufgaben verfügbar
  }

  // Anzeigen des Fortschritts
  getProgress() {
    return Object.entries(this.taskProgress).map(([userID, progress]) => ({
      user: this.userManager.getUserByID(userID),
      completed: progress.completed
    }));
  }
}

module.exports = TaskManager;
