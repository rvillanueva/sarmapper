export default class Agent {
  constructor(lngLat, seedTraits) {
    this.steps = [];
  }
  addStep(step) {
    this.steps.push(step);
  }
  getLastStep() {
    return this.steps[this.steps.length - 1];
  }
  getStepByIndex(i) {
    return this.steps(i);
  }
}
