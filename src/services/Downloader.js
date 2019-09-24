import fileDownload from 'js-file-download';
import toGPX from 'togpx';

export default class Downloader {
  constructor() {
    this.url = '';
  }
  downloadGPX(geoJSON) {
    const gpx = toGPX(geoJSON);
    fileDownload(gpx, `${new Date().valueOf()}.gpx`);
  }
}
