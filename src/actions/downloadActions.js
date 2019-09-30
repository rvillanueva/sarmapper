import fileDownload from 'js-file-download';
import toGPX from 'togpx';
import InitialPlanningPoint from '../services/InitialPlanningPoint';
import DirectionPoint from '../services/DirectionPoint';
import {Behavior} from '../services/Behaviors'

export function downloadGPX() {
  return function(dispatch, getState) {
    const markersById = getState().markers.byId;
    const behavior = getState().behavior;
    const ipp = new InitialPlanningPoint(markersById.ipp.lngLat, behavior);
    const directionPoint = markersById.direction ? new DirectionPoint(markersById.direction.lngLat, behavior) : null;
    let features = ipp.getRangeRingCollectionLayer().source.data.features;
    if(directionPoint) {
      features = features.concat(directionPoint.getDispersionCollectionLayer(ipp.getLngLat(), new Behavior(behavior)).source.data.features);
      features = features.concat(directionPoint.getDirectionLineLayer(ipp.getLngLat()).source.data);
    }
    const geoJSON = {
      "type": "FeatureCollection",
      "features": features
    }
    console.log(geoJSON)
    const gpx = toGPX(geoJSON);
    fileDownload(gpx, `${new Date().valueOf()}.gpx`);
  };
}
