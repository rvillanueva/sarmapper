import RangeRing from './RangeRing';
import LngLat, { type LngLatInput } from '../LngLat';
import StatisticalBehavior, { type BehaviorData } from './StatisticalBehavior';
import MapStyleLayer from '../map/MapStyleLayer';

export function getRangeRings(ippLngLat: LngLatInput, behavior: BehaviorData | StatisticalBehavior) {
  const distanceLabels = ['25%', '50%', '75%', '95%'];
  const stats = behavior instanceof StatisticalBehavior
    ? behavior
    : new StatisticalBehavior(behavior);
  return stats.getDistanceProbabilities()
    .map((distance, d) => new RangeRing(ippLngLat, distance.value * 1000, distanceLabels[d]));
}

export function createRingsLayer(ippLngLat: LngLatInput, behavior: BehaviorData | StatisticalBehavior) {
  const stats = behavior instanceof StatisticalBehavior
    ? behavior
    : new StatisticalBehavior(behavior);
  const rings = getRangeRings(ippLngLat, stats);
  const ringFeatures = rings.map(ring => ring.getGeoJSON().data);
  return new MapStyleLayer({
    'id': 'rings',
    'type': 'line',
    'source': {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: ringFeatures,
      },
    },
    'layout': {},
    'paint': {
      'line-color': '#e25b2a',
      'line-width': 1.5,
      'line-opacity': 0.6,
    },
  });
}

export function createRingLabelsLayer(ippLngLat: LngLatInput, behavior: BehaviorData | StatisticalBehavior) {
  const rings = getRangeRings(ippLngLat, behavior);
  const labelFeatures = rings.map(ring => ({
    type: 'Feature',
    properties: {
      description: ring.getLabelText(),
      icon: 'circle',
    },
    geometry: {
      type: 'Point',
      coordinates: [ring.getLabelPosition().toJSON().lng, ring.getLabelPosition().toJSON().lat],
    },
  }));
  return new MapStyleLayer({
    'id': 'poi-labels',
    'type': 'symbol',
    'source': {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: labelFeatures,
      },
    },
    'layout': {
      'text-field': ['get', 'description'],
      'text-font': ['Open Sans Regular', 'Arial Unicode MS Regular'],
      'text-size': 14,
    },
    'paint': {
      'text-color': '#3a3632',
      'text-halo-color': '#ffffff',
      'text-halo-width': 2,
    },
  });
}

export function createDirectionLineLayer(ippLngLat: LngLatInput, directionLngLat: LngLatInput) {
  const ipp = new LngLat(ippLngLat).toJSON();
  const direction = new LngLat(directionLngLat).toJSON();

  return new MapStyleLayer({
    'type': 'line',
    'source': {
      type: 'geojson',
      data: {
        'type': 'Feature',
        'properties': {
          'name': 'Direction of Travel Line',
        },
        'geometry': {
          'type': 'LineString',
          'coordinates': [
            [ipp.lng, ipp.lat],
            [direction.lng, direction.lat],
          ],
        },
      },
    },
    'layout': {},
    'paint': {
      'line-color': '#3a3632',
      'line-width': 2,
      'line-opacity': 0.7,
    },
  });
}

export function createDispersionLinesLayer(
  ippLngLat: LngLatInput,
  destinationLngLat: LngLatInput,
  behavior: BehaviorData | StatisticalBehavior,
) {
  const ipp = new LngLat(ippLngLat);
  const destination = new LngLat(destinationLngLat);
  const stats = behavior instanceof StatisticalBehavior
    ? behavior
    : new StatisticalBehavior(behavior);
  const { angles } = stats.getDispersion();
  const dist = stats.getDistanceProbabilities()[3].value;
  const baseAngle = destination.getBearingTo(ipp);
  const leftLines = angles.map((angle: number) => ({
    start: ipp,
    end: ipp.moveTo(baseAngle + angle, dist * 1000),
  }));
  const rightLines = angles.map((angle: number) => ({
    start: ipp,
    end: ipp.moveTo(baseAngle - angle, dist * 1000),
  }));
  const features = leftLines.concat(rightLines).map(line => ({
    'type': 'Feature',
    'properties': {
      'name': 'Dispersion',
    },
    'geometry': {
      'type': 'LineString',
      'coordinates': [
        [line.start.lng, line.start.lat],
        [line.end.lng, line.end.lat],
      ],
    },
  }));
  return new MapStyleLayer({
    'type': 'line',
    'source': {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features,
      },
    },
    'layout': {},
    'paint': {
      'line-color': '#6e6960',
      'line-width': 1,
      'line-opacity': 0.45,
    },
  });
}
