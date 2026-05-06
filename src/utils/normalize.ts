import { fromJS, Map, List } from 'immutable';

export interface NormalizedState<T = any> {
  allIds: string[];
  byId: Record<string, T>;
  counter?: number;
  [key: string]: any;
}

export interface MergeOptions {
  insertAt?: 'start' | 'end';
  overwrite?: boolean;
  indexes?: Array<{ name: string; field: string }>;
}

export interface RemoveOptions {
  indexes?: Array<{ name: string; field: string }>;
}

export function toArray(obj: NormalizedState): any[] {
  return obj.allIds.map((id: string) => obj.byId[id]);
}

export function initializeNormalState(): NormalizedState {
  return {
    allIds: [],
    byId: {},
  };
}

export function initializeNormalStateWithCounter(): NormalizedState {
  return {
    allIds: [],
    byId: {},
    counter: 0,
  };
}

export function mergeItems(
  state: NormalizedState,
  items: any[],
  options: MergeOptions,
): NormalizedState {
  options = options || {};
  let newState: any = fromJS(state);
  items.forEach((item: any) => {
    const counter = newState.get('counter');
    if (typeof item._id === 'undefined' && typeof counter === 'number') {
      item._id = String(counter);
      newState = newState.set('counter', counter + 1);
    }
    if (!state.byId[item._id]) {
      if (options.insertAt === 'start') {
        newState = newState.update('allIds', (list: any) => list.insert(0, item._id));
      } else {
        newState = newState.update('allIds', (list: any) => list.push(item._id));
      }
    }
    let mergedItem;
    if (options.overwrite === false) {
      mergedItem = item;
    } else {
      const original = newState.getIn(['byId', item._id]) || (new (Map as any)());
      mergedItem = original.merge(item);
    }
    newState = newState.setIn(['byId', item._id], mergedItem);
  });
  if (options.indexes) {
    options.indexes.forEach((index: { name: string; field: string }) => {
      items.forEach((item: any) => {
        newState = addToIndex(newState, index, item);
      });
    });
  }
  return newState.toJS();
}

export function removeItem(
  state: NormalizedState,
  id: string,
  options: RemoveOptions,
): NormalizedState {
  options = options || {};
  let newState: any = fromJS(state);
  const itemLocation = state.allIds.indexOf(id);
  if (itemLocation === -1) {
    return state;
  }
  const item = state.byId[id];
  if (item && options.indexes) {
    options.indexes.forEach((index: { name: string; field: string }) => {
      newState = removeFromIndex(newState, index, item);
    });
  }
  newState = newState.deleteIn(['byId', id]);
  newState = newState.deleteIn(['allIds', itemLocation]);

  return newState.toJS();
}

export function removeItemData(state: NormalizedState, id: string): NormalizedState {
  let newState: any = fromJS(state);
  newState = newState.setIn(['byId', id], { _id: id });
  return newState.toJS();
}

export function denormalize(items: any[], key: string): any[] {
  return items
    .map((item: any) => (item[key] ? item[key] : null))
    .filter((a: any) => a);
}

export function removeDenormalized(
  items: any[],
  keys: Array<string | { objectKey: string; idKey: string }>,
): any[] {
  let newItems = items.map((a: any) => a);
  keys.forEach((key) => {
    let objectKey: string;
    let idKey: string;
    if (typeof key === 'string') {
      objectKey = key;
      idKey = `${key}Id`;
    } else {
      objectKey = key.objectKey;
      idKey = key.idKey;
    }
    newItems = newItems
      .map((item: any) => {
        const patch = item[objectKey] && item[objectKey]
          ? { [idKey]: item[objectKey]._id }
          : {};
        return Object.assign({}, item, patch);
      })
      .filter((a: any) => a)
      .map((item: any) => {
        Reflect.deleteProperty(item, objectKey);
        return item;
      });
  });
  return newItems;
}

function addToIndex(newState: any, index: { name: string; field: string }, item: any): any {
  const indexLocation = [index.name, item[index.field]];
  if (!newState.getIn(indexLocation)) {
    newState = newState.setIn(indexLocation, new (List as any)());
  }
  if (newState.getIn(indexLocation).indexOf(item._id) === -1) {
    const newList = newState.getIn(indexLocation).push(item._id);
    newState = newState.setIn(indexLocation, newList);
  }
  return newState;
}

function removeFromIndex(newState: any, index: { name: string; field: string }, item: any): any {
  const indexLocation = [index.name, item[index.field]];
  const list = newState.getIn(indexLocation);
  if (list) {
    const newList = list.filter((itemId: string) => itemId !== item._id);
    newState = newState.setIn(indexLocation, newList);
  }
  return newState;
}

export function removeMatchingValuesByKey(
  state: NormalizedState,
  key: string,
  value: any,
): NormalizedState {
  let newState: any = fromJS(state);
  state.allIds.forEach((id: string) => {
    if (state.byId[id][key] === value) {
      newState = newState.setIn(['byId', id, key], null);
    }
  });
  return newState.toJS();
}
