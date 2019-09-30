import * as types from '../constants/actionTypes';
import searchMap from '../store/searchMap';

export function updateIPPMarker(ippMarker) {
  return function(dispatch, getState) {
    dispatch({
      type: types.SET_IPP_MARKER,
      items: [{
        _id: 'ipp',
        lngLat: ippMarker.getLngLat()
      }]
    });
  };
}

export function clearIPPMarker(lngLat) {
  return function(dispatch) {
    dispatch({
      type: types.CLEAR_IPP_MARKER
    });
  };
}

export function updateDestinationMarker(directionMarker) {
  return function(dispatch) {
    dispatch({
      type: types.SET_DIRECTION_MARKER,
      items: [{
        _id: 'direction',
        lngLat: directionMarker.getLngLat()
      }]
    });
  };
}

export function clearDirectionMarker(lngLat) {
  return function(dispatch) {
    searchMap.clearDirectionMarker();
    dispatch({
      type: types.CLEAR_DIRECTION_MARKER
    });
  };
}
