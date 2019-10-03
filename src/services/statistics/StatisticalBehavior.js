import {dispersions as dispersionData} from '../../data/behaviors';
const distanceNames = ['25%', '50%', '75%', '95%']

export default class Behavior {
  constructor(data) {
    this._id = data._id;
    this.n = data.n;
    this.hierarchy = data.hierarchy;
    this.distances = data.distances;
    this.dispersion = this.getDispersion();
  }
  getDispersion() {
    function filterUsingHierarchy(dispersions, remainingHierarchy) {
      if(dispersions.length === 1) return dispersions[0];
      const filtered = dispersions.filter(dispersion => dispersion.hierarchy[0] === remainingHierarchy[0]);
      if(filtered.length === 1) return filtered[0];
      if(filtered.length === 0 || remainingHierarchy.length === 1) return dispersions[0];
      return filterUsingHierarchy(filtered, remainingHierarchy.slice(1));
    }
    const dispersion = filterUsingHierarchy(dispersionData, this.hierarchy);
    return {
      ...dispersion,
      angles: [dispersion.angles.p25, dispersion.angles.p50, dispersion.angles.p75, dispersion.angles.p95]
    }
  }
  getName() {
    return `${this._id}`;
  }
  getDistanceProbabilities() {
    return this.distances.map((distance, d) => ({ label: distanceNames[d], value: distance}))
  }
  toJSON() {
    return Object.assign({}, this);
  }
}
