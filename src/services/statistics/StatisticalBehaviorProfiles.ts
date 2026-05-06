import { profiles as profileData } from '../../data/behaviors';
import StatisticalBehavior, { type BehaviorData } from './StatisticalBehavior';

export interface BehaviorProfileNode {
  children?: Record<string, BehaviorProfileNode> | null;
  behavior?: BehaviorData | null;
}

type BehaviorProfilesMap = Record<string, BehaviorProfileNode>;

interface SearchTreeResult {
  path: string[];
  child: BehaviorProfileNode;
}

interface SelectBestChildResult {
  key: string;
  child: BehaviorProfileNode;
}

export default class BehaviorProfiles {
  profiles: BehaviorProfilesMap;
  types: string[][];

  constructor() {
    this.profiles = profileData as unknown as BehaviorProfilesMap;
    this.types = [Object.keys(this.profiles), ['temperate', 'dry', 'urban'], ['flat', 'mtn']];
  }
  searchTree(
    parent: BehaviorProfileNode,
    searchKeys: string[],
    path: string[] = [],
    level = 0,
  ): SearchTreeResult {
    const found = this.selectBestChild(parent, level, searchKeys[level]);
    if (!found) {
      return { path, child: parent };
    }
    path.push(found.key);
    if (searchKeys.length === level - 1 || !found.child.children) {
      return { path, child: found.child };
    }
    return this.searchTree(found.child, searchKeys, path, level + 1);
  }
  selectBestChild(
    parent: BehaviorProfileNode,
    level: number,
    searchKey: string,
  ): SelectBestChildResult | undefined {
    if (parent.children && parent.children[searchKey]) {
      return {
        key: searchKey,
        child: parent.children[searchKey],
      };
    }
    if (!parent.children) return undefined;
    for (let i = 0; i < this.types[level].length; i++) {
      const type = this.types[level][i];
      if (parent.children[type]) {
        return {
          key: type,
          child: parent.children[type],
        };
      }
    }
    return undefined;
  }
  getClosestBehaviorByHierarchy(requestedHierarchy: string[]) {
    const node = this.searchTree(
      { children: this.profiles },
      requestedHierarchy,
    ).child;
    return new StatisticalBehavior(node.behavior as BehaviorData);
  }
  getProfiles() {
    return {
      allIds: Object.keys(this.profiles),
      byId: this.profiles,
    };
  }
  getBehavior = (keys: string[]) => {
    return this.getChildByKeys(this.profiles[keys[0]], keys.slice(1)).behavior;
  };
  getChildByKeys(parent: BehaviorProfileNode, keys: string[]): BehaviorProfileNode {
    if (!keys || keys.length === 0) return parent;
    const child = parent.children![keys[0]];
    return this.getChildByKeys(child, keys.slice(1));
  }
}
