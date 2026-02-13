import { combineReducers } from '@reduxjs/toolkit';
import markers from './markerReducer';
import behavior from './behaviorReducer';
import map from './mapReducer';

const rootReducer = () => combineReducers({
  markers,
  behavior,
  map
});

export default rootReducer;
