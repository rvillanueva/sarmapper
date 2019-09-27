import * as types from '../constants/actionTypes';
import searchMap from '../store/searchMap';
import {flyTo} from './mapActions';

export function setIPPMarker(lngLat) {
  return function(dispatch, getState) {
    searchMap.setIPPMarker(lngLat);
    dispatch(flyTo(lngLat));
    dispatch({
      type: types.SET_IPP_MARKER,
      items: [{
        _id: 'ipp',
        lngLat
      }]
    });
  };
}

export function clearIPPMarker(lngLat) {
  return function(dispatch) {
    searchMap.clearIPPMarker();
    dispatch({
      type: types.CLEAR_IPP_MARKER
    });
  };
}

export function setDirectionMarker(lngLat) {
  return function(dispatch) {
    searchMap.setDirectionMarker(lngLat);
    dispatch({
      type: types.SET_DIRECTION_MARKER,
      items: [{
        _id: 'direction',
        lngLat
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
