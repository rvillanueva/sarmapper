import * as types from '../constants/actionTypes';
import searchMap from '../store/searchMap';

export function updateMapCenter(lngLat) {
  return function(dispatch, getState) {
    dispatch({
      type: types.SET_MAP_CENTER,
      lngLat: lngLat
    });
  };
}

export function flyTo(lngLat) {
  return function(dispatch, getState) {
    searchMap.flyTo(lngLat);
  };
}
