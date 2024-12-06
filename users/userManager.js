const User = require('./user');

class UserManager {
  constructor() {
    this.users = [];
    this.nextUserID = 1000; // Start-ID
  }

  // Einen neuen Benutzer hinzufügen & dessen ID zurückgeben
  addUser(name) {
    const user = new User(name, this.nextUserID); // Benutzer mit ID erstellen
    this.users.push(user);
    this.nextUserID++; // Nächste ID vorbereiten
    return (this.nextUserID - 1); //UserID zurückgeben
  }

  // Benutzer anhand der ID suchen
  getUserByID(id) {
    return this.users = this.users.filter(user => String(user.getUserID) !== String(id));
  }

  // Benutzer anhand der ID entfernen
  removeUserByID(id) {
    this.users = this.users.filter(user => String(user.getUserID) !== String(id));
  }

  // Alle Benutzer abrufen
  getAllUsers() {
    return this.users;
  }
}

module.exports = UserManager;
