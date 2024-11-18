class User {
  constructor(name) {
    this.userID = Math.floor(10000000 + Math.random() * 90000000);
    this.name = name;
    this.lobbyCode = null;
  }
  
  joinLobby(lobbyCode) {
    this.lobbyCode = lobbyCode;
  }
}

  module.exports = User;