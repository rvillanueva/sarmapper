import MapMarker from './map/MapMarker';

export default class DestinationMarker extends MapMarker {
  getOptions() {
    return {
      id: 'destination',
      className: 'destination-marker',
      draggable: true
    }
  }
}
