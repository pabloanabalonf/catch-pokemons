import * as types from './types';

export function newGame(players, monster) {
  return {
    type: types.NEW_GAME,
    players,
    monster
  };
}

export function monsterNoCatch(monster) {
  return {
    type: types.MONSTER_NO_CATCH,
    monster
  };
}

export function removeOldSessions(playersDeleted) {
  return {
    type: types.REMOVE_OLD_SESSIONS,
    playersDeleted
  }
}

export function newPlayer(name, info) {
  return {
    type: types.NEW_PLAYER,
    name,
    info
  };
}

export function updatePlayerPosition(name, info) {
  return {
    type: types.UPDATE_PLAYER_POSITION,
    name,
    info
  }
}

export function playerDisconnect(name) {
  return {
    type: types.PLAYER_DISCONNECT,
    name
  };
}
