import mapboxgl from "mapbox-gl";
import config from "../config/env";

mapboxgl.access_token = config.mapboxPublicKey;

export default mapboxgl;
