class User {
  constructor(name) {
    this.userID = Math.floor(10000000 + Math.random() * 90000000);
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