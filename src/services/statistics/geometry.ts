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
      'line-color': '#e25b2a',
      'line-width': 1.5,
      'line-opacity': 0.6
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
      'text-color': '#3a3632',
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
      'line-color': '#3a3632',
      'line-width': 2,
      'line-opacity': 0.7
    }
  })
}
function buildSectorPolygon(centerLngLat, innerRadius, outerRadius, startBearing, endBearing) {
  const c = new LngLat(centerLngLat);
  const angleSpan = endBearing - startBearing;
  const isFullCircle = Math.abs(angleSpan) >= 360 - 1e-6;
  const numSamples = Math.max(8, Math.ceil(Math.abs(angleSpan) / 5));
  const step = angleSpan / numSamples;
  const outerPts = [];
  for (let i = 0; i <= numSamples; i++) {
    const p = c.moveTo(startBearing + step * i, outerRadius);
    outerPts.push([p.lng, p.lat]);
  }
  if (isFullCircle) {
    if (innerRadius === 0) {
      return { type: 'Polygon', coordinates: [outerPts] };
    }
    const innerPts = [];
    for (let i = numSamples; i >= 0; i--) {
      const p = c.moveTo(startBearing + step * i, innerRadius);
      innerPts.push([p.lng, p.lat]);
    }
    return { type: 'Polygon', coordinates: [outerPts, innerPts] };
  }
  if (innerRadius === 0) {
    const ring = [[c.lng, c.lat], ...outerPts, [c.lng, c.lat]];
    return { type: 'Polygon', coordinates: [ring] };
  }
  const innerPts = [];
  for (let i = numSamples; i >= 0; i--) {
    const p = c.moveTo(startBearing + step * i, innerRadius);
    innerPts.push([p.lng, p.lat]);
  }
  const ring = [...outerPts, ...innerPts, outerPts[0]];
  return { type: 'Polygon', coordinates: [ring] };
}

function computeProbabilityCells(ippLngLat, destinationLngLat, behavior) {
  const distances = behavior.getDistanceProbabilities().map(d => d.value * 1000);
  const cumDistProbs = [0.25, 0.50, 0.75, 0.95];
  const distBands = [
    { inner: 0, outer: distances[0], prob: cumDistProbs[0] },
    { inner: distances[0], outer: distances[1], prob: cumDistProbs[1] - cumDistProbs[0] },
    { inner: distances[1], outer: distances[2], prob: cumDistProbs[2] - cumDistProbs[1] },
    { inner: distances[2], outer: distances[3], prob: cumDistProbs[3] - cumDistProbs[2] },
  ];

  let baseAngle = 0;
  let angBands;

  if (destinationLngLat) {
    const ipp = new LngLat(ippLngLat);
    const dest = new LngLat(destinationLngLat);
    baseAngle = dest.getBearingTo(ipp);
    const { angles } = behavior.getDispersion();
    const cumAng = [0.25, 0.50, 0.75, 0.95];
    const halfBand = i => (i === 0 ? cumAng[0] : cumAng[i] - cumAng[i - 1]) / 2;
    angBands = [
      { start: 0, end: angles[0], prob: halfBand(0) },
      { start: angles[0], end: angles[1], prob: halfBand(1) },
      { start: angles[1], end: angles[2], prob: halfBand(2) },
      { start: angles[2], end: angles[3], prob: halfBand(3) },
      { start: -angles[0], end: 0, prob: halfBand(0) },
      { start: -angles[1], end: -angles[0], prob: halfBand(1) },
      { start: -angles[2], end: -angles[1], prob: halfBand(2) },
      { start: -angles[3], end: -angles[2], prob: halfBand(3) },
    ];
    if (angles[3] < 180) {
      angBands.push({ start: angles[3], end: 360 - angles[3], prob: 0.05 });
    }
  } else {
    angBands = [{ start: 0, end: 360, prob: 1.0 }];
  }

  const cells = [];
  for (const dist of distBands) {
    const ringArea = Math.PI * (dist.outer * dist.outer - dist.inner * dist.inner);
    for (const ang of angBands) {
      const angularFraction = (ang.end - ang.start) / 360;
      const cellArea = ringArea * angularFraction;
      const probability = dist.prob * ang.prob;
      const density = cellArea > 0 ? probability / cellArea : 0;
      const polygon = buildSectorPolygon(
        ippLngLat,
        dist.inner,
        dist.outer,
        baseAngle + ang.start,
        baseAngle + ang.end,
      );
      cells.push({ polygon, density, probability });
    }
  }

  const maxDensity = Math.max(...cells.map(c => c.density));
  cells.forEach(c => {
    c.intensity = maxDensity > 0 ? Math.pow(c.density / maxDensity, 0.25) : 0;
  });

  return cells;
}

export function createHeatmapLayer(ippLngLat, destinationLngLat, behavior) {
  behavior = new StatisticalBehavior(behavior);
  const cells = computeProbabilityCells(ippLngLat, destinationLngLat, behavior);
  const features = cells.map(cell => ({
    type: 'Feature',
    properties: {
      name: 'Probability',
      density: cell.density,
      intensity: cell.intensity,
      probability: cell.probability,
    },
    geometry: cell.polygon,
  }));
  return new MapStyleLayer({
    id: 'probability-heatmap',
    type: 'fill',
    source: {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features,
      },
    },
    layout: {},
    paint: {
      'fill-color': [
        'interpolate',
        ['linear'],
        ['get', 'intensity'],
        0,    '#2c7bb6',
        0.25, '#abd9e9',
        0.5,  '#ffffbf',
        0.75, '#fdae61',
        1,    '#d7191c',
      ],
      'fill-opacity': [
        'interpolate',
        ['linear'],
        ['get', 'intensity'],
        0,   0.15,
        1,   0.6,
      ],
      'fill-outline-color': 'rgba(0,0,0,0.05)',
    },
  });
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
      'line-color': '#6e6960',
      'line-width': 1,
      'line-opacity': 0.45
    }
  })
}
