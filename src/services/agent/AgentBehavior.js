import AgentStep from './AgentStep';

export default class AgentBehavior {
  generate(agentTraits, environmentTraits) {
    return new AgentStep();
  }
}
