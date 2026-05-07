import MapMarker from './map/MapMarker';

const ARROW_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28" aria-hidden="true" focusable="false"><path d="M12 2 L20.5 21.5 L12 17 L3.5 21.5 Z" fill="#1a1816" stroke="#ffffff" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round" /></svg>`;

export default class DestinationMarker extends MapMarker {
  getOptions() {
    return {
      id: 'destination',
      className: 'destination-marker',
      draggable: true,
      innerHTML: ARROW_SVG,
      rotationAlignment: 'map' as const,
    };
  }
}
