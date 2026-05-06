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
type SectorPolygon = {
  type: 'Polygon';
  coordinates: number[][][];
};

interface ProbabilityCell {
  polygon: SectorPolygon;
  density: number;
  probability: number;
  intensity: number;
}

function buildSectorPolygon(
  centerLngLat: LngLatInput,
  innerRadius: number,
  outerRadius: number,
  startBearing: number,
  endBearing: number,
): SectorPolygon {
  const c = new LngLat(centerLngLat);
  const angleSpan = endBearing - startBearing;
  const isFullCircle = Math.abs(angleSpan) >= 360 - 1e-6;
  const numSamples = Math.max(8, Math.ceil(Math.abs(angleSpan) / 5));
  const step = angleSpan / numSamples;
  const outerPts: number[][] = [];
  for (let i = 0; i <= numSamples; i++) {
    const p = c.moveTo(startBearing + step * i, outerRadius);
    outerPts.push([p.lng, p.lat]);
  }
  if (isFullCircle) {
    if (innerRadius === 0) {
      return { type: 'Polygon', coordinates: [outerPts] };
    }
    const innerPts: number[][] = [];
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
  const innerPts: number[][] = [];
  for (let i = numSamples; i >= 0; i--) {
    const p = c.moveTo(startBearing + step * i, innerRadius);
    innerPts.push([p.lng, p.lat]);
  }
  const ring = [...outerPts, ...innerPts, outerPts[0]];
  return { type: 'Polygon', coordinates: [ring] };
}

function computeProbabilityCells(
  ippLngLat: LngLatInput,
  destinationLngLat: LngLatInput | null,
  behavior: StatisticalBehavior,
): ProbabilityCell[] {
  const distances = behavior.getDistanceProbabilities().map(d => d.value * 1000);
  const cumDistProbs = [0.25, 0.50, 0.75, 0.95];
  const distBands = [
    { inner: 0, outer: distances[0], prob: cumDistProbs[0] },
    { inner: distances[0], outer: distances[1], prob: cumDistProbs[1] - cumDistProbs[0] },
    { inner: distances[1], outer: distances[2], prob: cumDistProbs[2] - cumDistProbs[1] },
    { inner: distances[2], outer: distances[3], prob: cumDistProbs[3] - cumDistProbs[2] },
  ];

  let baseAngle = 0;
  let angBands: { start: number; end: number; prob: number }[];

  if (destinationLngLat) {
    const ipp = new LngLat(ippLngLat);
    const dest = new LngLat(destinationLngLat);
    baseAngle = dest.getBearingTo(ipp);
    const { angles } = behavior.getDispersion();
    const cumAng = [0.25, 0.50, 0.75, 0.95];
    const rearProb = 1 - cumAng[3];
    // Cap the outer angle so the forward bands never overlap behind the
    // marker. If p95 reaches the cap, there is no rear span left, so fold
    // the rear probability into the outermost forward bands instead.
    const p95 = Math.min(angles[3], 179.99);
    const noRearSpan = p95 >= 180 - 0.01;
    const outerBoost = noRearSpan ? rearProb / 2 : 0;
    const halfBand = (i: number) => {
      const base = (i === 0 ? cumAng[0] : cumAng[i] - cumAng[i - 1]) / 2;
      return i === 3 ? base + outerBoost : base;
    };
    angBands = [
      { start: 0, end: angles[0], prob: halfBand(0) },
      { start: angles[0], end: angles[1], prob: halfBand(1) },
      { start: angles[1], end: angles[2], prob: halfBand(2) },
      { start: angles[2], end: p95, prob: halfBand(3) },
      { start: -angles[0], end: 0, prob: halfBand(0) },
      { start: -angles[1], end: -angles[0], prob: halfBand(1) },
      { start: -angles[2], end: -angles[1], prob: halfBand(2) },
      { start: -p95, end: -angles[2], prob: halfBand(3) },
    ];
    if (!noRearSpan) {
      angBands.push({ start: p95, end: 360 - p95, prob: rearProb });
    }
  } else {
    angBands = [{ start: 0, end: 360, prob: 1.0 }];
  }

  const cells: ProbabilityCell[] = [];
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
      cells.push({ polygon, density, probability, intensity: 0 });
    }
  }

  // Anchor color scale to a density that is independent of whether a
  // direction marker is set, so the colormap stays comparable across modes.
  // Reference = mean density inside the innermost ring under a uniform
  // distribution (no direction). Cells denser than the reference clip to 1.
  const refDensity = distances[0] > 0
    ? cumDistProbs[0] / (Math.PI * distances[0] * distances[0])
    : 0;
  cells.forEach(c => {
    if (refDensity <= 0) {
      c.intensity = 0;
      return;
    }
    const ratio = c.density / refDensity;
    c.intensity = Math.min(1, Math.pow(ratio, 0.25));
  });

  return cells;
}

export function createHeatmapLayer(
  ippLngLat: LngLatInput,
  destinationLngLat: LngLatInput | null,
  behavior: BehaviorData | StatisticalBehavior,
) {
  const stats = behavior instanceof StatisticalBehavior
    ? behavior
    : new StatisticalBehavior(behavior);
  const cells = computeProbabilityCells(ippLngLat, destinationLngLat, stats);
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
