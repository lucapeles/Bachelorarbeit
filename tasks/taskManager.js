class TaskManager {
    constructor(userManager) {
      this.tasks = []; // Liste aller Aufgaben
      this.currentTaskIndex = -1; // Index der aktuellen Aufgabe
      this.taskProgress = {}; // Fortschritt der Benutzer: { userId: { completed: boolean, correct: boolean, time: number } }
      this.userManager = userManager; // Referenz auf den UserManager
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
    markTaskCompleted(userId, correct, time) {
      if (!this.taskProgress[userId]) {
        this.taskProgress[userId] = { completed: false, correct: false, time: Infinity };
      }
      this.taskProgress[userId] = { completed: true, correct, time };
    }
  
    // Punktevergabe durch UserManager
    assignPoints() {
      const correctUsers = Object.entries(this.taskProgress)
        .filter(([_, progress]) => progress.correct) // Nur korrekte Antworten
        .sort(([, a], [, b]) => a.time - b.time); // Nach Zeit sortieren (schnellste zuerst)
  
      let points = 20; // Startpunkte
      correctUsers.forEach(([userId]) => {
        this.userManager.updatePoints(userId, Math.max(points, 2)); // Punkte zuweisen
        points = Math.max(points - 2, 2); // Punkte reduzieren, nicht unter 2
      });
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
  }
  
  module.exports = TaskManager;
  