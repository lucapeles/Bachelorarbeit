class User {
  constructor(name, userID) {
    this.userID = userID; // ID wird von außen übergeben
    this.name = name;
  }

  // Getter für userID
  get getUserID() {
    return this.userID;
  }

  // Getter für name
  get getName() {
    return this.name;
  }
}

module.exports = User;
