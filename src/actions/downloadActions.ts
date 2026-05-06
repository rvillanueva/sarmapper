import fileDownload from "js-file-download";
import GeoJsonToGpx from "@dwayneparton/geojson-to-gpx";
import toKML from "@maphubs/tokml";
import {
  createRingsLayer,
  createDispersionLinesLayer,
  createDirectionLineLayer,
} from "../services/statistics/geometry";
import { useAppStore } from "../store/appStore";

export function toGeoJSON(markers: any, behavior: any) {
  const ippLngLat = markers.byId.ipp ? markers.byId.ipp.lngLat : null;
  const destinationLngLat = markers.byId.direction
    ? markers.byId.direction.lngLat
    : null;
  const ringsSource = createRingsLayer(ippLngLat, behavior).toJSON().source as {
    data: { features: any[] };
  };
  let features: any[] = ringsSource.data.features;
  if (destinationLngLat) {
    const dispersionSource = createDispersionLinesLayer(
      ippLngLat,
      destinationLngLat,
      behavior,
    ).toJSON().source as { data: { features: any[] } };
    features = features.concat(dispersionSource.data.features);
    const directionSource = createDirectionLineLayer(
      ippLngLat,
      destinationLngLat,
    ).toJSON().source as { data: any };
    features = features.concat(directionSource.data);
  }
  return {
    type: "FeatureCollection" as const,
    features: features,
  };
}

export function downloadGPX() {
  const { markers, behavior } = useAppStore.getState();
  const geoJSON = toGeoJSON(markers, behavior);
  const gpxDoc = GeoJsonToGpx(geoJSON);
  const gpx = new XMLSerializer().serializeToString(gpxDoc);
  fileDownload(gpx, `${new Date().valueOf()}.gpx`);
}

export function downloadKML() {
  const { markers, behavior } = useAppStore.getState();
  const geoJSON = toGeoJSON(markers, behavior);
  const kml = toKML(geoJSON);
  fileDownload(kml, `${new Date().valueOf()}.kml`);
}
