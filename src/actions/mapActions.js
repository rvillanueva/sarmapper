import * as types from '../constants/actionTypes';

export function updateMapCenter(lngLat) {
  return function(dispatch, getState) {
    dispatch({
      type: types.SET_MAP_CENTER,
      lngLat: lngLat
    });
  };
}
