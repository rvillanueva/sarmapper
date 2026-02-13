import React from 'react';
import {names} from '../../../data/behaviors';

function BehaviorSelector({profiles, behavior, setBehaviorByKeys}) {
  function handleChange(l, value) {
    const newKeys = behavior.hierarchy.concat();
    newKeys[l] = value;
    setBehaviorByKeys(newKeys);
  }
  const levels = ['profiles', 'environments', 'terrain'];
  const levelNames = {
    profiles: 'Profile',
    environments: 'Environment',
    terrain: 'Terrain'
  }
  const types = [
    names.profiles,
    names.environments,
    names.terrain
  ];
  const selectors = [];

  function addSelectorRecursively(parent, l = 0) {
    if(!parent.children) return;
    const options = Object.keys(types[l])
      .filter(type => parent.children && parent.children[type])
      .map(type => <option
        key={type}
        value={type}>
        {names[levels[l]][type]}
      </option>);
    const selector = <div
      className="behavior-selector__container"
      key={levels[l]}>
      <label className="behavior-selector__label">
        {levelNames[levels[l]]}
      </label>
      <select
        className="behavior-selector__dropdown"
        value={behavior.hierarchy[l]}
        onChange={evt => handleChange(l, evt.target.value)}>
      {options}
      </select>
    </div>;
    selectors.push(selector);
    if(parent.children[behavior.hierarchy[l]]) {
      addSelectorRecursively(parent.children[behavior.hierarchy[l]], l + 1);
    }
  }
  addSelectorRecursively({
    children: profiles.allIds.reduce((a, id) => Object.assign({}, a, {[id]: profiles.byId[id]}), {})
  });
  return (
    <div className="profile-selector">
      {selectors}
    </div>
  );
}

export default BehaviorSelector;
