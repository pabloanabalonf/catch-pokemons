import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { reducer, initialState } from './reducer';

export const initStore = (initialStateStore = initialState) => {
  return createStore(
    reducer,
    initialStateStore,
    applyMiddleware(thunkMiddleware)
  );
}
