import {behaviors} from '../data/behaviors';
const distanceNames = ['25%', '50%', '75%', '95%']

export class Behavior {
  constructor(data) {
    this._id = data._id;
    this.n = data.n;
    this.hierarchy = data.hierarchy;
    this.distances = data.distances;
    this.dispersion = data.dispersion || null;
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
    this.behaviors = behaviors.map(behavior => new Behavior(behavior));
    this.taxonomy = this.buildTaxonomy();
    this.types = [Object.keys(this.taxonomy), ['temperate', 'dry', 'urban'], ['flat', 'mtn']];
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
    return this.searchTree({
      children: this.taxonomy
    }, requestedHierarchy).child.behavior;
  }
  getProfiles() {
    return {
      allIds: Object.keys(this.taxonomy),
      byId: this.taxonomy
    }
  }
  getBehavior = (keys) => {
    return this.getChildByKeys(this.taxonomy[keys[0]], keys.slice(1)).behavior;
  }
  getChildByKeys(parent, keys) {
    if(!keys || keys.length === 0) return parent;
    const child = parent.children[keys[0]];
    return this.getChildByKeys(child, keys.slice(1));
  }
  buildTaxonomy() {
    return this.behaviors.reduce((a, behavior) => {
      function setChildren(parent, children, behavior) {
        parent.children = parent.children || null;
        if(children.length > 0) {
          parent.children = parent.children || {};
          parent.children[children[0]] = parent.children[children[0]] || {}
          parent.behavior = parent.behavior || null;
          setChildren(parent.children[children[0]], children.slice(1), behavior);
        } else {
          parent.behavior = behavior;
        }
        return parent;
      }
      return setChildren(a, behavior.hierarchy, behavior)
    }, {}).children;
  }
}
