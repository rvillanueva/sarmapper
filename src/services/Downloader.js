import fileDownload from 'js-file-download';
import toGPX from 'togpx';

export default class Downloader {
  constructor() {
    this.url = '';
  }
  downloadGPXFromRangeRings(rings) {
    const geoJSON = {
      "type": "FeatureCollection",
      "features": rings.map(ring => ring.getGeoJSON().data)
    }
    const gpx = toGPX(geoJSON);
    fileDownload(gpx, `${new Date().valueOf()}.gpx`);
  }
}
