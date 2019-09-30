import * as types from '../constants/actionTypes';

export function setBehavior(behavior) {
  return function(dispatch) {
    console.log('behavior set', behavior)
    dispatch({
      type: types.SET_BEHAVIOR,
      behavior: behavior.toJSON()
    });
  };
}
