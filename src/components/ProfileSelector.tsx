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
        <label className="w-28 shrink-0 font-mono text-[10px] uppercase tracking-[0.14em] text-warm-gray">
          {levelNames[levels[l]]}
        </label>
        <select
          className="flex-1 rounded-sm border border-rule-strong bg-white px-3 py-2 text-[13px] text-charcoal outline-none focus:border-charcoal transition-colors cursor-pointer font-light"
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
