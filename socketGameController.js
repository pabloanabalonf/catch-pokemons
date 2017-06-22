const _ = require('lodash');
const canvas = require('./canvas');
const pokemons = require('./pokemons');
let players = {};
const pokemon = {};

const getRandomPosition = (dimension) => {
  return 32 + (Math.random() * (dimension - 64));
};

const getRandomPokemon = () => {
  return pokemons[
    Math.floor(Math.random() * pokemons.length)
  ];
};

function handlePokemonNoCatch(io) {
  // If no one catches the pokemon in 10 seconds
  // its position is restarted
  setInterval(() => {
    const timePokemonNoCaught = Date.now() - pokemon.updated;
    if(timePokemonNoCaught > 10000){
      pokemon.x = getRandomPosition(canvas.width);
      pokemon.y = getRandomPosition(canvas.height);
      pokemon.updated = Date.now();
      pokemon.name = getRandomPokemon();
      io.emit('pokemonNoCatch', pokemon);
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
    //if the pokemon is not created yet...
    if (!pokemon.x && !pokemon.y) {
      pokemon.x = getRandomPosition(canvas.width);
      pokemon.y = getRandomPosition(canvas.height);
      pokemon.updated = Date.now();
      pokemon.name = getRandomPokemon();
    }
    socket.emit(
      'play',
      {
        players,
        pokemon
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
        pokemonsCaptured: 0,
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
    const { name, info, changePokemonPosition } = data;
    players[name].updated = Date.now();
    players[name].x = info.x;
    players[name].y = info.y;
    if (changePokemonPosition) {
      players[name].pokemonsCaptured += 1;
      pokemon.x = getRandomPosition(canvas.width);
      pokemon.y = getRandomPosition(canvas.height);
      pokemon.updated = Date.now();
      pokemon.name = getRandomPokemon();
      io.emit('resetPokemonPosition', {
        pokemon,
        playerName: name,
        pokemonsCaptured: players[name].pokemonsCaptured
      });
    }
    //emit event for all users less for to the user who fire this event
    socket.broadcast.emit(
      'updatePlayerInfo',
      {
        name: name,
        info: players[name]
      }
    );
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
  handlePokemonNoCatch,
  handleOldSessions,
  connection: (io, socket) => {
    handleNewGame(io, socket);
    handleNewPlayer(io, socket);
    handleUpdatePlayerInfo(io, socket);
    handleDisconnect(io, socket);
  }
};
