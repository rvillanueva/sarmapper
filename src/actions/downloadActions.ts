import fileDownload from "js-file-download";
import toGPX from "togpx";
import toKML from "@maphubs/tokml";
import {
  createRingsLayer,
  createDispersionLinesLayer,
  createDirectionLineLayer,
} from "../services/statistics/geometry";

export function toGeoJSON(markers, behavior) {
  const ippLngLat = markers.byId.ipp ? markers.byId.ipp.lngLat : null;
  const destinationLngLat = markers.byId.direction
    ? markers.byId.direction.lngLat
    : null;
  let features = createRingsLayer(ippLngLat, behavior).toJSON().source.data
    .features;
  if (destinationLngLat) {
    features = features.concat(
      createDispersionLinesLayer(
        ippLngLat,
        destinationLngLat,
        behavior,
      ).toJSON().source.data.features,
    );
    features = features.concat(
      createDirectionLineLayer(ippLngLat, destinationLngLat).toJSON().source
        .data,
    );
  }
  return {
    type: "FeatureCollection",
    features: features,
  };
}

export function downloadGPX() {
  return function (dispatch, getState) {
    const { markers, behavior } = getState();
    const geoJSON = toGeoJSON(markers, behavior);
    const gpx = toGPX(geoJSON);
    fileDownload(gpx, `${new Date().valueOf()}.gpx`);
  };
}

export function downloadKML() {
  return function (dispatch, getState) {
    const { markers, behavior } = getState();
    const geoJSON = toGeoJSON(markers, behavior);
    const kml = toKML(geoJSON);
    fileDownload(kml, `${new Date().valueOf()}.kml`);
  };
}
