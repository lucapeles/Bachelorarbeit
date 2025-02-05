const User = require('./user');

class UserManager {
  constructor() {
    this.users = [];
    this.nextUserID = 28472384593108; // Start-ID
  }

  // Einen neuen Benutzer hinzufügen & dessen ID zurückgeben
  addUser(name) {
    const user = new User(name, this.nextUserID); // Benutzer mit ID erstellen
    this.users.push(user);
    this.nextUserID += 2354341238; // Nächste ID vorbereiten
    return user.userID; // Benutzer-ID zurückgeben
  }

  // Benutzer anhand der ID suchen
  getUserByID(id) {
    return this.users.find(user => String(user.getUserID) === String(id));
  }

  // Benutzer anhand der ID entfernen
  removeUserByID(id) {
    this.users = this.users.filter(user => String(user.getUserID) !== String(id));
  }

  // Punkte eines Benutzers aktualisieren
  updatePoints(userID, points) {
    const user = this.getUserByID(userID);
    if (user) {
      user.points += points; // Punkte hinzufügen
    }
  }

  // Punktestand zurücksetzen
  resetAllPoints() {
    this.users.forEach(user => {
      user.points = 0; // Punkte für alle Benutzer zurücksetzen
    });
  }

  // Rangliste der Spieler
  getRanking() {
    return this.users
      .sort((a, b) => b.getPoints - a.getPoints) // Nach Punkten absteigend sortieren
      .map((user, index) => ({ rank: index + 1, name: user.getName, userID: user.getUserID, points: user.getPoints }));
  }


  // Alle Benutzer abrufen
  getAllUsers() {
    return this.users;
  }

  getNumberOfUsers() {
    return this.users.length;
  }

  changeName(userID, newName) {
    const user = this.getUserByID(userID);
    if (user) {
      user.setName = newName;
    }
  }
}

module.exports = UserManager;
