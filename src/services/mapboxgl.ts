import mapboxgl from "mapbox-gl";
import config from "../config/env";

mapboxgl.accessToken = config.mapboxPublicKey;

export default mapboxgl;
