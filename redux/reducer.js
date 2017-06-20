import _ from 'lodash';
import * as types from './types';

export const initialState = {
  name: '',
  players: {},
  monster: {}
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case types.NEW_GAME:
      return {
        ...state,
        players: action.players,
        monster: action.monster
      }
    case types.UPDATE_PLAYER_NAME:
      return {
        ...state,
        name: action.name
      };
    case types.MONSTER_NO_CATCH:
      return {
        ...state,
        monster: action.monster
      };
    case types.REMOVE_OLD_SESSIONS:
      return {
        ...state,
        players: _.omit(state.players, action.playersDeleted)
      };
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
