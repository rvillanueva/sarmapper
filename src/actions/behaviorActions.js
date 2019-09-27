import * as types from '../constants/actionTypes';
import BehaviorProfiles from '../services/Behaviors';
import searchMap from '../store/searchMap';

export function setBehavior(keys) {
  return function(dispatch) {
    const profiles = new BehaviorProfiles();
    const behavior = profiles.getClosestBehaviorByHierarchy(keys)
    searchMap.setBehavior(behavior);
    dispatch({
      type: types.SET_BEHAVIOR,
      behavior: behavior.toJSON()
    });
  };
}
