import { computeDestinationPoint, getRhumbLineBearing } from "geolib";

export type LngLatInput =
  | LngLat
  | { lng: number; lat: number }
  | [number, number];

export default class LngLat {
  lng: number;
  lat: number;

  constructor(lngLat: LngLatInput) {
    if (Array.isArray(lngLat)) {
      this.lng = lngLat[0];
      this.lat = lngLat[1];
    } else {
      this.lng = lngLat.lng;
      this.lat = lngLat.lat;
    }
  }
  toJSON() {
    return {
      lat: this.lat,
      lng: this.lng,
    };
  }
  moveTo(bearing: number, distance: number) {
    const newCoords = computeDestinationPoint(
      { latitude: this.lat, longitude: this.lng },
      distance,
      bearing,
    );
    return new LngLat({
      lat: newCoords.latitude,
      lng: newCoords.longitude,
    });
  }
  getBearingTo(lngLat: LngLatInput) {
    const target = new LngLat(lngLat);
    return getRhumbLineBearing(
      {
        longitude: this.lng,
        latitude: this.lat,
      },
      {
        longitude: target.lng,
        latitude: target.lat,
      },
    );
  }
}
