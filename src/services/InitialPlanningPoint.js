import RangeRing from './RangeRing';
import LngLat from './LngLat';
import {Behavior} from './Behaviors';

export default class InitialPlanningPoint {
  constructor(lngLat, behavior) {
    this.lngLat = new LngLat(lngLat);
    this.behavior = new Behavior(behavior);
  }
  getLngLat() {
    return this.lngLat;
  }
  setLngLat(lngLat) {
    this.lngLat = new LngLat(lngLat);
  }
  getRangeRings() {
    return this.behavior.getDistanceProbabilities()
      .map(distance => new RangeRing(this.lngLat, distance.value * 1000, this.behavior.getName()));
  }
  setBehavior(behavior) {
    this.behavior = new Behavior(behavior);
  }
}
