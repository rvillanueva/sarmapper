import MapMarker from './map/MapMarker';

export default class InitialPlanningMarker extends MapMarker {
  getOptions() {
    return {
      id: 'ipp',
      className: 'ipp-marker',
      draggable: true
    }
  }
}
