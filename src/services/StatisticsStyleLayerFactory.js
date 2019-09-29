import RangeRing from './RangeRing';
import LngLat from './LngLat';
import MapStyleLayer from './map/MapStyleLayer';

export default class StatisticsStyleLayerFactory {
  createRangeRings(ipp, behavior) {
    const rings = this.getRangeRings(ipp, behavior);
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
        'line-opacity': 0.8
      }
    })
  }
  createRangeRingLabels(ipp, behavior) {
    const rings = this.getRangeRings(ipp, behavior);
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
  createDirectionLine(ipp, direction) {
    const ippLngLat = new LngLat(ipp.getLngLat()).toJSON();
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
    })
  }
  createDispersionLines(ipp, behavior) {
    const ippLngLat = new LngLat(ipp.getLngLat()).toJSON();
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
    });
  }
  getRangeRingsRings(ipp, behavior) {
    const distanceLabels = ['25%', '50%', '75%', '95%'];
    return behavior.getDistanceProbabilities()
      .map((distance, d) => new RangeRing(ipp.getLngLat(), distance.value * 1000, distanceLabels[d]));
  }
}
