import * as types from './types';

export const updatePlayerName = (name) => dispatch => {
  return dispatch({
    type: types.UPDATE_PLAYER_NAME,
    name
  });
}

export const newGame = (players, monster) => dispatch => {
  return dispatch({
    type: types.NEW_GAME,
    players,
    monster
  });
}

export const monsterNoCatch = (monster) => dispatch => {
  return dispatch({
    type: types.MONSTER_NO_CATCH,
    monster
  });
}

export const newPlayer = (name, info) => dispatch => {
  return dispatch({
    type: types.NEW_PLAYER,
    name,
    info
  });
}

export const removeOldSessions = (playersDeleted) => dispatch => {
  return dispatch({
    type: types.REMOVE_OLD_SESSIONS,
    playersDeleted
  });
}

export const updatePlayerInfo = (name, info) => dispatch => {
  return dispatch({
    type: types.UPDATE_PLAYER_INFO,
    name,
    info
  });
}

export const playerDisconnect = (name) => dispatch => {
  return dispatch({
    type: types.PLAYER_DISCONNECT,
    name
  });
}

export const imageLoaded = (imageName) => dispatch => {
  return dispatch({
    type: types.IMAGE_LOADED,
    imageName
  });
}

export const keyDownEvent = (keyCode) => dispatch => {
  return dispatch({
    type: types.KEY_DOWN_EVENT,
    keyCode
  });
}

export const keyUpEvent = (keyCode) => dispatch => {
  return dispatch({
    type: types.KEY_UP_EVENT,
    keyCode
  });
}

export const clearKeysDown = () => dispatch => {
  return dispatch({
    type: types.CLEAR_KEYS_DOWN
  });
}
