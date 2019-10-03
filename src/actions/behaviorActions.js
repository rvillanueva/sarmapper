import * as types from '../constants/actionTypes';

export function setBehavior(behavior) {
  return function(dispatch) {
    dispatch({
      type: types.SET_BEHAVIOR,
      behavior: behavior.toJSON()
    });
  };
}
