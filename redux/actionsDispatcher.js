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
