const User = require('./user');

class UserManager {
  constructor() {
    this.users = [];
    this.nextUserID = 1000; // Start-ID
  }

  // Einen neuen Benutzer hinzufügen
  addUser(name) {
    const user = new User(name, this.nextUserID); // Benutzer mit ID erstellen
    this.users.push(user);
    this.nextUserID++; // Nächste ID vorbereiten
    return (this.nextUserID - 1); //UserID zurückgeben
  }

  // Benutzer anhand der ID suchen
  getUserByID(id) {
    return this.users.find(user => user.userID === id); // Benutzer anhand der ID suchen
  }

  // Benutzer anhand der ID entfernen
  removeUserByID(id) {
    const index = this.users.findIndex(user => user.userID === id);
    if (index !== -1) {
      this.users.splice(index, 1); // Benutzer aus der Liste entfernen
    }
  }

  // Alle Benutzer abrufen
  getAllUsers() {
    return this.users;
  }
}

module.exports = UserManager;
