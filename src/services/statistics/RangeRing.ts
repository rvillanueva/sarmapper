import LngLat, { type LngLatInput } from '../LngLat';

export default class RangeRing {
  center: LngLatInput;
  distance: number;
  name: string;
  points: LngLat[];

  constructor(lngLat: LngLatInput, distance: number, name = '') {
    this.center = lngLat;
    this.distance = distance;
    this.name = `${name} - ${distance / 1000}km`;
    this.points = this.calculatePoints();
  }
  calculatePoints() {
    const bearings = Array.from(Array(37)).map((_item, i) => 360 / 36 * i);
    return bearings.map(bearing => new LngLat(this.center).moveTo(bearing, this.distance));
  }
  getLabelPosition() {
    return this.points[0];
  }
  getLabelText() {
    return this.name;
  }
  getGeoJSON() {
    return {
      'type': 'geojson',
      'data': {
        'type': 'Feature',
        'properties': {
          'name': this.name
        },
        'geometry': {
          'type': 'LineString',
          'coordinates': this.points.map(point => [point.lng, point.lat])
        }
      },
    };
  }
  getLayer() {
    return {
      'type': 'line',
      'source': this.getGeoJSON(),
      'layout': {},
      'paint': {
        'line-color': '#e25b2a',
        'line-width': 1.5,
        'line-opacity': 0.8
      }
    }
  }
}
