import Agent from './agent/Agent';
import LngLat from './LngLat';

export default class LostPersonAgent extends Agent {
  getEnvironmentFromState(state) {
    const lngLat = new LngLat(state.props.lngLat);
    return {};
  }
  getPath() {
    this.getAllStates().map(state => new LngLat(state.toJSON().lngLat));
  }
  getPathStyleLayer() {
    return {
      
    }
  }
}
