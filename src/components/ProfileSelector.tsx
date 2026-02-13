import {names} from '../data/behaviors';

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
    const selector = (
      <div className="flex items-center gap-3 mb-2" key={levels[l]}>
        <label className="w-24 shrink-0 text-sm font-medium text-gray-600">
          {levelNames[levels[l]]}
        </label>
        <select
          className="flex-1 rounded-md border border-gray-300 bg-white px-2.5 py-1.5 text-sm text-gray-700 shadow-sm outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-300 cursor-pointer"
          value={behavior.hierarchy[l]}
          onChange={evt => handleChange(l, evt.target.value)}>
          {options}
        </select>
      </div>
    );
    selectors.push(selector);
    if(parent.children[behavior.hierarchy[l]]) {
      addSelectorRecursively(parent.children[behavior.hierarchy[l]], l + 1);
    }
  }
  addSelectorRecursively({
    children: profiles.allIds.reduce((a, id) => Object.assign({}, a, {[id]: profiles.byId[id]}), {})
  });
  return (
    <div>
      {selectors}
    </div>
  );
}

export default BehaviorSelector;
