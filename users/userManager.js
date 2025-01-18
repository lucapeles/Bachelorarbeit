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
    return this.users.filter(user => String(user.getUserID) !== String(id));
  }

  // Benutzer anhand der ID entfernen
  removeUserByID(id) {
    this.users = this.users.filter(user => String(user.getUserID) !== String(id));
  }

  // Punkte eines Benutzers aktualisieren
  updatePoints(userId, points) {
    const user = this.getUserByID(userId);
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

  // Alle Benutzer abrufen
  getAllUsers() {
    return this.users;
  }
}

module.exports = UserManager;
