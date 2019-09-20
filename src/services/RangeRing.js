import UUIDV4 from 'uuid/v4';
import {computeDestinationPoint} from 'geolib';

export default class RangeRing {
  constructor(lngLat, distance, name = '', shortLabel) {
    this.center = lngLat;
    this.distance = distance;
    this.name = name;
    this.shortLabel = shortLabel;
    this.points = this.calculatePoints();

  }
  calculatePoints() {
    const bearings = Array.from(Array(37)).map((item, i) => 360 / 36 * i);
    const points = bearings.map(bearing => computeDestinationPoint(
      { latitude: this.center.lat, longitude: this.center.lng },
      this.distance,
      bearing
    ));
    return points.map(point => [point.longitude, point.latitude]);
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
          'coordinates': this.points
        }
      },
    };
  }
  getLayer() {
    return {
      id: UUIDV4(),
      'type': 'line',
      'source': this.getGeoJSON(),
      'layout': {},
      'paint': {
        'line-color': 'rgb(209, 79, 79)',
        'line-width': 2,
        'line-opacity': 0.8
      }
    }
  }
}
