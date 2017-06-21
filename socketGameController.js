const _ = require('lodash');
const canvas = require('./canvas');
let players = {};
const monster = {};

const getRandomPosition = (dimension) => {
  return 32 + (Math.random() * (dimension - 64));
};

function handleMonsterNoCatch(io) {
  // If no one catches the monster in 10 seconds
  // its position is restarted
  setInterval(() => {
    const timeMonsterNoCaught = Date.now() - monster.updated;
    if(timeMonsterNoCaught > 10000){
      monster.x = getRandomPosition(canvas.width);
      monster.y = getRandomPosition(canvas.height);
      monster.updated = Date.now();
      io.emit('monsterNoCatch', monster);
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
        playersDeleted.push(key);
      }
    });
    players = _.omit(players, playersDeleted);
    //Emit event to all user
    io.emit('removeOldSessions', playersDeleted);
  }, 20000);
}

function handleNewGame (io, socket) {
  socket.on('newGame', () => {
    //if the monster is not created yet...
    if (!monster.x && !monster.y) {
      monster.x = getRandomPosition(canvas.width);
      monster.y = getRandomPosition(canvas.height);
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
  socket.on('newPlayer', (name) => {
    // Check if player already exist
    const playerNames = Object.keys(players);
    const playerExist = _.some(playerNames, (n) => {
      return RegExp(`^${name}`, 'i').test(n)
    });
    if (playerExist) {
      socket.emit(
        'nameExists',
        `Name ${name} already exist`
      );
    } else {
      players[name] = {
        x: getRandomPosition(canvas.width),
        y: getRandomPosition(canvas.height),
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

function handleUpdatePlayerInfo(io, socket) {
  socket.on('updatePosition', (data) => {
    const { name, info, changeMonsterPosition } = data;
    players[name].updated = Date.now();
    players[name].x = info.x;
    players[name].y = info.y;
    players[name].capturedMonsters = info.capturedMonsters;
    //emit event for all users less for to the user who fire this event
    socket.broadcast.emit(
      'updatePlayerInfo',
      {
        name: name,
        info: players[name]
      }
    );

    if (changeMonsterPosition) {
      monster.x = getRandomPosition(canvas.width);
      monster.y = getRandomPosition(canvas.height);
      monster.updated = Date.now();
      io.emit('resetMonsterPosition', monster);
    }
  });
}


function handleDisconnect(io, socket) {
  socket.on('disconnect', () => {
    const name = socket.namePlayer;
    if (name) {
      players = _.omit(players, name);
      io.emit(
        'playerDisconnect',
        name
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
    handleUpdatePlayerInfo(io, socket);
    handleDisconnect(io, socket);
  }
};
