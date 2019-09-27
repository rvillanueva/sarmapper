import {SET_IPP_MARKER, CLEAR_IPP_MARKER, SET_DIRECTION_MARKER, CLEAR_DIRECTION_MARKER} from '../constants/actionTypes';
import initialState from './initialState';
import {mergeItems, removeItem} from '../utils/normalize';
// IMPORTANT: Note that with Redux, state should NEVER be changed.
// State is considered immutable. Instead,
// create a copy of the state passed and set new values on the copy.
// Note that I'm using Object.assign to create a copy of current state
// and update values on the copy.
export default function markerReducer(state = initialState.markers, action) {
  switch (action.type) {
  case SET_IPP_MARKER:
    return mergeItems(state, action.items);
  case CLEAR_IPP_MARKER:
    return removeItem(state, 'ipp');
  case SET_DIRECTION_MARKER:
    return mergeItems(state, action.items);
  case CLEAR_DIRECTION_MARKER:
    return removeItem(state, 'direction');
  default:
    return state;
  }
}
