import AgentBehavior from './agent/AgentBehavior';
import AgentState from './AgentState';
import LngLat from './LngLat';

export default class LostPersonAgentBehavior extends AgentBehavior {
  calculateNewState({state, traits, influences, options}) {
    const newState = Object.assign({}, state);
    newState.lngLat = new LngLat(state.lngLat).moveTo(0, 500).toJSON();
    return new AgentState(newState);
  }
}
