import { names } from '../data/behaviors';

type LevelKey = 'profiles' | 'environments' | 'terrain';

interface ProfileNode {
  children?: Record<string, ProfileNode> | null;
  behavior?: unknown;
}

interface BehaviorLike {
  hierarchy: string[];
}

interface BehaviorSelectorProps {
  profiles: { allIds: string[]; byId: Record<string, ProfileNode> };
  behavior: BehaviorLike;
  setBehaviorByKeys: (keys: string[]) => void;
}

function BehaviorSelector({ profiles, behavior, setBehaviorByKeys }: BehaviorSelectorProps) {
  function handleChange(l: number, value: string) {
    const newKeys = behavior.hierarchy.concat();
    newKeys[l] = value;
    setBehaviorByKeys(newKeys);
  }
  const levels: LevelKey[] = ['profiles', 'environments', 'terrain'];
  const levelNames: Record<LevelKey, string> = {
    profiles: 'Profile',
    environments: 'Environment',
    terrain: 'Terrain',
  };
  const types = [
    names.profiles,
    names.environments,
    names.terrain,
  ];
  const selectors: React.ReactElement[] = [];

  function addSelectorRecursively(parent: ProfileNode, l = 0) {
    if (!parent.children) return;
    const children = parent.children;
    const options = Object.keys(types[l])
      .filter((type) => children[type])
      .map((type) => (
        <option key={type} value={type}>
          {(names[levels[l]] as Record<string, string>)[type]}
        </option>
      ));
    const selector = (
      <div className="flex items-center gap-3 mb-2" key={levels[l]}>
        <label className="w-28 shrink-0 font-mono text-[10px] uppercase tracking-[0.14em] text-warm-gray">
          {levelNames[levels[l]]}
        </label>
        <select
          className="flex-1 rounded-sm border border-rule-strong bg-white px-3 py-2 text-[13px] text-charcoal outline-none focus:border-charcoal transition-colors cursor-pointer font-light"
          value={behavior.hierarchy[l]}
          onChange={(evt) => handleChange(l, evt.target.value)}
        >
          {options}
        </select>
      </div>
    );
    selectors.push(selector);
    if (children[behavior.hierarchy[l]]) {
      addSelectorRecursively(children[behavior.hierarchy[l]], l + 1);
    }
  }
  addSelectorRecursively({
    children: profiles.allIds.reduce<Record<string, ProfileNode>>(
      (a, id) => Object.assign({}, a, { [id]: profiles.byId[id] }),
      {},
    ),
  });
  return <div>{selectors}</div>;
}

export default BehaviorSelector;
