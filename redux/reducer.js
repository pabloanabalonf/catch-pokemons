import _ from 'lodash';
import * as types from './types';

export const initialState = {
  name: '',
  players: {},
  pokemon: {},
  images: {
    masterImageLoaded: false,
    pokemonsImagesLoaded: false,
    mapImageLoaded: false
  },
  keysDown: {}
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case types.NEW_GAME:
      return {
        ...state,
        players: action.players,
        pokemon: action.pokemon
      }
    case types.UPDATE_PLAYER_NAME:
      return {
        ...state,
        name: action.name
      };
    case types.POKEMON_NO_CATCH:
      return {
        ...state,
        pokemon: action.pokemon
      };
    case types.REMOVE_OLD_SESSIONS:
      return {
        ...state,
        players: _.omit(state.players, action.playersDeleted)
      };
    case types.NEW_PLAYER:
    case types.UPDATE_PLAYER_INFO:
      return {
        ...state,
        players: {
          ...state.players,
          [action.name]: action.info
        }
      };
    case types.ADD_POKEMON_CAPTURED:
      return {
        ...state,
        players: {
          ...state.players,
          [action.name]: {
            ...state.players[action.name],
            pokemonsCaptured: action.pokemonsCaptured
          }
        }
      };
    case types.PLAYER_DISCONNECT:
      return {
        ...state,
        players: _.omit(state.players, action.name)
      };
    case types.IMAGE_LOADED:
      return {
        ...state,
        images: {
          ...state.images,
          [action.imageName]: true
        }
      }
    case types.KEY_DOWN_EVENT:
      return {
        ...state,
        keysDown: {
          ...state.keysDown,
          [action.keyCode]: true
        }
      };
    case types.KEY_UP_EVENT:
      return {
        ...state,
        keysDown: {
          ...state.keysDown,
          [action.keyCode]: false
        }
      };
    case types.CLEAR_KEYS_DOWN:
      return {
        ...state,
        keysDown: {}
      };
    default:
      return state;
  }
};
