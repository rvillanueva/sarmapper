import {profiles as profileData, dispersions as dispersionData} from '../data/behaviors';
const distanceNames = ['25%', '50%', '75%', '95%']

export class Behavior {
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
    return filterUsingHierarchy(dispersionData, this.hierarchy);
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

export default class BehaviorProfiles {
  constructor() {
    this.profiles = profileData;
    this.types = [Object.keys(this.profiles), ['temperate', 'dry', 'urban'], ['flat', 'mtn']];
  }
  searchTree(parent, searchKeys, path = [], level = 0) {
    const found = this.selectBestChild(parent, level, searchKeys[level]);
    path.push(found.key);
    if(searchKeys.length === level - 1 || !found.child.children) return {
      path,
      child: found.child
    };
    level ++;
    return this.searchTree(found.child, searchKeys, path, level);
  }
  selectBestChild(parent, level, searchKey) {
    if(parent.children[searchKey]) return {
      key: searchKey,
      child: parent.children[searchKey]
    };
    for(let i = 0; i < this.types[level].length; i++) {
      const type = this.types[level][i];
      if(parent.children[type]) return {
        key: type,
        child: parent.children[type]
      }
    }
  }
  getClosestBehaviorByHierarchy(requestedHierarchy) {
    const behavior = this.searchTree({
      children: this.profiles
    }, requestedHierarchy).child.behavior;
    return new Behavior(behavior);
  }
  getProfiles() {
    return {
      allIds: Object.keys(this.profiles),
      byId: this.profiles
    }
  }
  getBehavior = (keys) => {
    return this.getChildByKeys(this.profiles[keys[0]], keys.slice(1)).behavior;
  }
  getChildByKeys(parent, keys) {
    if(!keys || keys.length === 0) return parent;
    const child = parent.children[keys[0]];
    return this.getChildByKeys(child, keys.slice(1));
  }
}
