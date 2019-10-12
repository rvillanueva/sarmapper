export default class AgentState {
  constructor(state) {
    if(state instanceof AgentState) {
      this.props = state.toJSON();
    }
    this.props = state;
  }
  toJSON() {
    return Object.assign({}, this.props);
  }
}
