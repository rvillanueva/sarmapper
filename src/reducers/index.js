import { combineReducers } from 'redux';
import markers from './markerReducer';
import behavior from './behaviorReducer';
import map from './mapReducer';

const rootReducer = history => combineReducers({
  markers,
  behavior,
  map
});

export default rootReducer;
