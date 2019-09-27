import RangeRing from './RangeRing';
import LngLat from './LngLat';
import {Behavior} from './Behaviors';

export default class InitialPlanningPoint {
  constructor(lngLat, behavior) {
    this.lngLat = new LngLat(lngLat);
    this.behavior = new Behavior(behavior);
  }
  getLngLat() {
    return new LngLat(this.lngLat);
  }
  setLngLat(lngLat) {
    this.lngLat = new LngLat(lngLat);
  }
  getRangeRings() {
    const distanceLabels = ['25%', '50%', '75%', '95%'];
    return this.behavior.getDistanceProbabilities()
      .map((distance, d) => new RangeRing(this.lngLat, distance.value * 1000, distanceLabels[d]));
  }
  setBehavior(behavior) {
    this.behavior = new Behavior(behavior);
  }
  getRangeRingCollectionLayer() {
    const rings = this.getRangeRings();
    const ringFeatures = rings.map(ring => ring.getGeoJSON().data);
    return {
      'id': 'rings',
      'type': 'line',
      'source': {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: ringFeatures
        }
      },
      'layout': {},
      'paint': {
        'line-color': 'rgb(209, 79, 79)',
        'line-width': 2,
        'line-opacity': 0.8
      }
    }
  }
  getLabelCollectionLayer() {
    const rings = this.getRangeRings();
    const labelFeatures = rings.map(ring => ({
      type: 'Feature',
      properties: {
        description: ring.getLabelText(),
        icon: 'circle'
      },
      geometry: {
        type: 'Point',
        coordinates: [ring.getLabelPosition().toJSON().lng, ring.getLabelPosition().toJSON().lat]
      }
    }));
    return {
      "id": "poi-labels",
      "type": "symbol",
      'source': {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: labelFeatures
        }
      },
      "layout": {
        "text-field": ["get", "description"],
        'text-font': ["Open Sans Regular","Arial Unicode MS Regular"],
        'text-size': 14
      },
      "paint": {
        'text-color': '#343434',
        'text-halo-color': '#ffffff',
        'text-halo-width': 2
      }
    }
  }
}
