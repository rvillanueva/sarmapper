export default class Agent {
  constructor(traits, behavior) {
    this.traits = traits;
    this.behavior = behavior;
    this.states = [];
  }
  getEnvironmentFromState() {
    return {};
  }
  generateNextState(environment, options) {
    const newState = this.behavior.calculateNewState({
      state: this.getLastState(),
      traits: this.traits,
      environment,
      options
    });
    this.pushState(newState);
  }
  getStatesLength() {
    return this.states.length;
  }
  pushState(state) {
    this.states.push(state);
  }
  getLastState() {
    return this.states[this.states.length - 1];
  }
  getStatebyIndex(i) {
    return this.states[i];
  }
}
