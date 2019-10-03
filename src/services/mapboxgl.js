import mapboxgl from 'mapbox-gl';
import config from '../config/env';

mapboxgl.access_token = config.mapboPublicKey;

export default mapboxgl;
