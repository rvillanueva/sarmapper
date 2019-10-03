import fileDownload from 'js-file-download';
import toGPX from 'togpx';
import {
  createRingsLayer,
  createDispersionLinesLayer,
  createDirectionLineLayer
} from '../services/statistics/geometry';

export function downloadGPX() {
  return function(dispatch, getState) {
    const {markers, behavior} = getState();

    const ippLngLat = markers.byId.ipp ? markers.byId.ipp.lngLat : null;
    const destinationLngLat = markers.byId.direction ? markers.byId.direction.lngLat : null;
    let features = createRingsLayer(ippLngLat, behavior).toJSON().source.data.features;
    if(destinationLngLat) {
      features = features.concat(createDispersionLinesLayer(ippLngLat, destinationLngLat, behavior).toJSON().source.data.features);
      features = features.concat(createDirectionLineLayer(ippLngLat, destinationLngLat).toJSON().source.data);
    }
    const geoJSON = {
      "type": "FeatureCollection",
      "features": features
    }
    const gpx = toGPX(geoJSON);
    fileDownload(gpx, `${new Date().valueOf()}.gpx`);
  };
}
