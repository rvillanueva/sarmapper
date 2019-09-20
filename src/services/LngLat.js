export default class LngLat {
  constructor(lngLat) {
    if(Array.isArray(lngLat)) {
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
      lng: this.lng
    }
  }
}
