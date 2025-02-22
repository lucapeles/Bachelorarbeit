const User = require('./user');

class UserManager {
  constructor() {
    this.users = [];
    this.nextUserID = 28472384593108; // Start-ID
    this.variablePoints = 0;
  }

  // Einen neuen Benutzer hinzufügen & dessen ID zurückgeben
  addUser(name) {
    const user = new User(name, this.nextUserID); // Benutzer mit ID erstellen
    this.users.push(user);
    this.nextUserID += 2354341238; // Nächste ID vorbereiten
    return user.userID; // Benutzer-ID zurückgeben
  }

  //user war bereits registriert
  addUserDouble(name, userID) {
    console.log(this.variablePoints);
    const user = new User(name, userID);
    user.setPoints(this.variablePoints);
    this.users.push(user);
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

  setVariablePoints(number) {
    this.variablePoints = number;
  }

  changeName(userID, newName) {
    const user = this.getUserByID(userID);
    if (user) {
      user.setName = newName;
    }
  }

  lookUpUser(userID) {
    const user = this.getUserByID(userID);
    return user ? true : false; // Gibt true zurück, wenn der Benutzer existiert, sonst false
  }

}

module.exports = UserManager;
