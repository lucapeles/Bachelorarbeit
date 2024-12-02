const User = require('./user');

class UserManager {

  constructor() {
    this.users = [];
  }
  
  addUser(name) {
    const user = new User(name);
    this.users.push(user);
    return user;
  }
  
  getUserByName(name) {
    return this.users.find(user => user.name === name); // Benutzer anhand des Namens suchen
  }

  getAllUser() {
    return this.users;
  }

  removeUser(name) {
    const index = this.users.findIndex(user => user.name === name);
    if (index !== -1) {
      this.users.splice(index, 1); // Benutzer aus der Liste entfernen
    }
  }
}
 
module.exports = UserManager;
  