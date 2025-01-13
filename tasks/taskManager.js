class TaskManager {
    constructor(userManager) {
      this.tasks = []; // Liste aller Aufgaben
      this.currentTaskIndex = -1; // Index der aktuellen Aufgabe
      this.taskProgress = {}; // Fortschritt der Benutzer: { userId: { completed: boolean, correct: boolean, time: number } }
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
  
    // Benutzer bearbeitet Aufgabe und gibt ab
    markTaskCompleted(userId, answer) {
      this.usersWhoHaveFinished.push(userId);
      const currentTask = this.getCurrentTask();
      if (!currentTask) return; // Keine gültige Aufgabe
      const isCorrect = this.checkAnswer(currentTask, answer); // Antwort überprüfen

      //TODO: Reihenfolge der Abgabe (zB: Liste mit allen users und dann länge ist Platz des aktuelen Users)

      this.taskProgress[userId] = { completed: true, correct: isCorrect, time }; //als completed markieren
      // Punkte zuweisen, wenn die Antwort korrekt ist
      if (isCorrect) {
        assignPoints(userId);
      }
      if (this.usersWhoHaveFinished.length == this.userManager.getAllUsers().length) {
        this.usersWhoHaveFinished = []; // Zurücksetzen der Liste, wenn ale fertig sind
        socket.emit("taskCompleted");
      }
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
    assignPoints(userId) {
      this.userManager.updatePoints(userId, this.userManager.getAllUsers().length - this.usersWhoHaveFinished.length);
    }
  
    // Prüfen, ob alle Benutzer die Aufgabe abgeschlossen haben
    isTaskComplete(userIds) {
      return userIds.every(userId => this.taskProgress[userId]?.completed);
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
      return Object.entries(this.taskProgress).map(([userId, progress]) => ({
        user: this.userManager.getUserByID(userId),
        completed: progress.completed
      }));
    }
  }
  
  module.exports = TaskManager;
  