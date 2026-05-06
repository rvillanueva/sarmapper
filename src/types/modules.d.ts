declare module '@maphubs/tokml' {
  const toKML: (geojson: unknown, options?: Record<string, unknown>) => string;
  export default toKML;
}

declare module '@mapbox/mapbox-gl-geocoder' {
  export default class MapboxGeocoder {
    constructor(options: Record<string, unknown>);
  }
}
