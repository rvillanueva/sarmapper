import fileDownload from 'js-file-download';
import toGPX from 'togpx';

export function downloadGPX(geoJSON) {
  return function(dispatch) {
    const gpx = toGPX(geoJSON);
    fileDownload(gpx, `${new Date().valueOf()}.gpx`);
  };
}
