const lodash = require('lodash');
const canvas = require('./canvas');
let players = {};
const monster = {};

function handleMonsterNoCatch(io) {
  // If no one catches the monster in 10 seconds
  // its position is restarted
  setInterval(() => {
    const timeMonsterNoCaught = Date.now() - monster.updated;
    if(timeMonsterNoCaught > 10000){
      monster.x = 32 + (Math.random() * (canvas.width - 64));
      monster.y = 32 + (Math.random() * (canvas.height - 64));
      monster.updated = Date.now();
      io.emit('monsterNoCatch', { monster });
    }
  }, 10000);
}

function handleOldSessions(io) {
  // If player doesn't move in 20 secons
  // its remove from `players` object
  setInterval(() => {
    const playersDeleted = [];
    Object.keys(players).forEach((key) => {
      const playerUpdate = Date.now() - players[key].updated;
      if (playerUpdate > 20000) {
        players = _.omit(players, key);
        playersDeleted.push(key);
      }
    });
    //Emit event to all user
    io.emit('removeOldSessions', playersDeleted);
  }, 20000);
}

function handleNewGame (io, socket) {
  socket.on('newGame', () => {
    //if the monster is not created yet...
    if (!monster.x && !monster.y) {
      monster.x = 32 + (Math.random() * (canvas.width - 64));
      monster.y = 32 + (Math.random() * (canvas.height - 64));
      monster.updated = Date.now();
    }
    socket.emit(
      'play',
      {
        players,
        monster
      }
    );
  });
}

function handleNewPlayer(io, socket) {
  socket.on('newPlayer', (data) => {
    // Check if player already exist
    if (players[data.name]) {
      socket.emit(
        'nameExists',
        {
          message: `Name ${data.name_player} already exist`
        }
      );
    } else {
      players[data.name] = {
        x: data.x,
        y: data.y,
        speed: 256,
        capturedMonsters: 0,
        updated: Date.now()
      };
      socket.namePlayer = data.name;
      io.emit(
        'newPlayerReady',
        {
          name: data.name,
          info: players[data.name]
        }
      );
    }
  });
}

function handleUpdatePlayerPosition(io, socket) {
  socket.on('updatePosition', (data) => {
    players[data.name].updated = Date.now();
    players[data.name].x = data.player.x;
    players[data.name].y = data.player.y;
    //emit event for all users less for to the user who fire this event
    socket.broadcast.emit(
      'updatePlayerPosition',
      {
        name: data.name,
        info: players[data.name]
      }
    );
  });
}

function handleDisconnect(io, socket) {
  socket.on('disconnect', () => {
    players = _.omit(players, data.namePlayer);
    io.emit(
      'playerDisconnect',
      { name: socket.namePlayer }
    );
  });
}

module.exports = {
  handleMonsterNoCatch,
  handleOldSessions,
  connection: (io, socket) => {
    handleNewGame(io, socket);
    handleNewPlayer(io, socket);
    handleUpdatePlayerPosition(io, socket);
    handleMonsterCatch(io, socket);
    handleDisconnect(io, socket);
  }
};
