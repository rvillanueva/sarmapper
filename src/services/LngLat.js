import {computeDestinationPoint, getRhumbLineBearing} from 'geolib';

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
  moveTo(bearing, distance) {
    const newCoords = computeDestinationPoint(
      { latitude: this.lat, longitude: this.lng },
      distance,
      bearing
    );
    this.lat = newCoords.latitude;
    this.lng = newCoords.longitude;
    return new LngLat(this);
  }
  getBearingTo(lngLat) {
    lngLat = new LngLat(lngLat);
    return getRhumbLineBearing({
      longitude: lngLat.toJSON().lng,
      latitude: lngLat.toJSON().lat
    }, {
      longitude: this.lng,
      latitude: this.lat
    })
  }
}
