import {profiles as profileData} from '../../data/behaviors';
import StatisticalBehavior from './StatisticalBehavior';

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
    return new StatisticalBehavior(behavior);
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
