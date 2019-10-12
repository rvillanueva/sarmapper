import AgentState from './AgentState';

export default class AgentBehavior {
  calculateNewState({state, traits, influences, options}) {
    return new AgentState(state);
  }
}
