import LngLat from './LngLat';
import {Behavior} from './Behaviors';
export default class DirectionPoint {
  constructor(lngLat) {
    this.lngLat = new LngLat(lngLat);
  }
  setLngLat(lngLat) {
    this.lngLat = new LngLat(lngLat);
  }
  getDispersionCollectionLayer = (ippLngLat, behavior) => {
    behavior = new Behavior(behavior);
    const {angles} =  behavior.getDispersion();
    const dist = behavior.getDistanceProbabilities()[3].value;
    const baseAngle = this.lngLat.getBearingTo(ippLngLat);
    const leftLines = angles.map(angle => ({
      start: new LngLat(ippLngLat),
      end: new LngLat(ippLngLat).moveTo(baseAngle + angle, dist * 1000)
    }));
    const rightLines = angles.map(angle => ({
      start: new LngLat(ippLngLat),
      end: new LngLat(ippLngLat).moveTo(baseAngle - angle, dist * 1000)
    }));
    const features = leftLines.concat(rightLines).map(line => ({
      'type': 'Feature',
      'properties': {
        'name': 'Dispersion'
      },
      'geometry': {
        'type': 'LineString',
        'coordinates': [
          [line.start.lng, line.start.lat],
          [line.end.lng, line.end.lat]]
      }
    }))
    return {
      'type': 'line',
      'source': {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features
        }
      },
      'layout': {},
      'paint': {
        'line-color': 'rgb(215, 134, 59)',
        'line-width': 2,
        'line-opacity': 0.4
      }
    }
  }
  getDirectionLineLayer = (ippLngLat) => {
    ippLngLat = new LngLat(ippLngLat).toJSON();
    return {
      'type': 'line',
      'source': {
        type: 'geojson',
        data: {
          'type': 'Feature',
          'properties': {
            'name': 'Direction of Travel Line'
          },
          'geometry': {
            'type': 'LineString',
            'coordinates': [
              [ippLngLat.lng, ippLngLat.lat],
              [this.lngLat.toJSON().lng, this.lngLat.toJSON().lat]]
          }
        }
      },
      'layout': {},
      'paint': {
        'line-color': 'rgb(215, 134, 59)',
        'line-width': 3,
        'line-opacity': 0.8
      }
    }
  }
}
