import _ from 'lodash';
import * as types from './types';

export const initialState = {
  players: {},
  monster: {}
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case types.NEW_GAME:
      return {
        players: action.players,
        monster: action.monster
      }
    case types.MONSTER_NO_CATCH:
      return {
        ...state,
        monster: action.monster
      };
    case types.REMOVE_OLD_SESSIONS: {
      let newState = {
        ...state
      };
      action.playersDeleted.forEach((playerName) => {
        newState = _.omit(newState, playerName);
      });
      return newState;
    }
    case types.NEW_PLAYER:
    case types.UPDATE_PLAYER_POSITION:
      return {
        ...state,
        players: {
          ...state.players,
          [action.name]: action.info
        }
      };
    case types.PLAYER_DISCONNECT:
      return {
        ...state,
        players: _.omit(state.players, action.name)
      };
    default:
      return state;
  }
};
