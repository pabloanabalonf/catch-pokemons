const _ = require('lodash');
const canvas = require('./canvas');
let players = {};
const monster = {};

function handleMonsterNoCatch(io) {
  console.log('canvas' + JSON.stringify(canvas));
  console.log('listening handleMonsterNoCatch event');
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
  console.log('listening handleOldSessions event');
  // If player doesn't move in 20 secons
  // its remove from `players` object
  setInterval(() => {
    const playersDeleted = [];
    Object.keys(players).forEach((key) => {
      const playerUpdate = Date.now() - players[key].updated;
      if (playerUpdate > 20000) {
        playersDeleted.push(key);
      }
    });
    players = _.omit(players, playersDeleted);
    //Emit event to all user
    io.emit('removeOldSessions', playersDeleted);
  }, 20000);
}

function handleNewGame (io, socket) {
  console.log('listening newGame event');
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
  console.log('listening handleNewPlayer event');
  socket.on('newPlayer', (name) => {
    // Check if player already exist
    if (players[name]) {
      socket.emit(
        'nameExists',
        `Name ${name} already exist`
      );
    } else {
      players[name] = {
        x: canvas.width / 2,
        y: canvas.height / 2,
        speed: 256,
        capturedMonsters: 0,
        updated: Date.now()
      };
      socket.namePlayer = name;
      io.emit(
        'newPlayerReady',
        {
          name: name,
          info: players[name]
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

function handleMonsterCatch(io, socket) {
	socket.on('monsterCatch', (name) => {
		players[name].capturedMonsters += 1;
		monster.x = 32 + (Math.random() * (canvas.width - 64));
		monster.y = 32 + (Math.random() * (canvas.height - 64));
		monster.updated = Date.now();
		io.emit(
      'reset',
      {
        name,
        capturedMonsters: players[name].capturedMonsters,
        monster
      }
    );
	});
}

function handleDisconnect(io, socket) {
  console.log('listening handleDisconnect event');
  socket.on('disconnect', () => {
    console.log('disconnect');
    if (socket.namePlayer) {
      players = _.omit(players, socket.namePlayer);
      io.emit(
        'playerDisconnect',
        { name: socket.namePlayer }
      );
    }
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
