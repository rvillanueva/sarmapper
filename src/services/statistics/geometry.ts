import RangeRing from './RangeRing';
import LngLat from '../LngLat';
import StatisticalBehavior from './StatisticalBehavior';
import MapStyleLayer from '../map/MapStyleLayer';

export function getRangeRings(ippLngLat, behavior) {
  const distanceLabels = ['25%', '50%', '75%', '95%'];
  behavior = new StatisticalBehavior(behavior);
  return behavior.getDistanceProbabilities()
    .map((distance, d) => new RangeRing(ippLngLat, distance.value * 1000, distanceLabels[d]));
}

export function createRingsLayer(ippLngLat, behavior) {
  behavior = new StatisticalBehavior(behavior);
  const rings = getRangeRings(ippLngLat, behavior);
  const ringFeatures = rings.map(ring => ring.getGeoJSON().data);
  return new MapStyleLayer({
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
      'line-opacity': 0.5
    }
  })
}

export function createRingLabelsLayer(ippLngLat, behavior) {
  const rings = getRangeRings(ippLngLat, behavior);
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
  return new MapStyleLayer({
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
  })
}

export function createDirectionLineLayer(ippLngLat, directionLngLat) {
  ippLngLat = new LngLat(ippLngLat).toJSON();
  directionLngLat = new LngLat(directionLngLat).toJSON();

  return new MapStyleLayer({
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
            [directionLngLat.lng, directionLngLat.lat]]
        }
      }
    },
    'layout': {},
    'paint': {
      'line-color': 'rgb(215, 134, 59)',
      'line-width': 3,
      'line-opacity': 0.8
    }
  })
}
export function createDispersionLinesLayer(ippLngLat, destinationLngLat, behavior) {
  ippLngLat = new LngLat(ippLngLat);
  destinationLngLat = new LngLat(destinationLngLat);
  behavior = new StatisticalBehavior(behavior);
  const {angles} =  behavior.getDispersion();
  const dist = behavior.getDistanceProbabilities()[3].value;
  const baseAngle = destinationLngLat.getBearingTo(ippLngLat);
  const leftLines = angles.map(angle => ({
    start: ippLngLat,
    end: ippLngLat.moveTo(baseAngle + angle, dist * 1000)
  }));
  const rightLines = angles.map(angle => ({
    start: ippLngLat,
    end: ippLngLat.moveTo(baseAngle - angle, dist * 1000)
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
  return new MapStyleLayer({
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
  })
}
