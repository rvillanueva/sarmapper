export default class Point {
  constructor(lng, lat) {
    this.lng = lng;
    this.lat = lat;
  }
  setLngLat(lng, lat) {
    this.lng = lng;
    this.lat = lat;
    return this;
  }
  getLngLat() {
    return [this.lng, this.lat];
  }
}
