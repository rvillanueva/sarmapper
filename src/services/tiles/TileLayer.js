import {lngLatToGoogle} from 'global-mercator';
import Jimp from 'jimp';

export default class TileLayer {
  constructor() {
    this.tiles = {};
    this.url = 'https://s3.amazonaws.com/elevation-tiles-prod/normal';
  }
  async loadElevationTile(x, y, z) {
    this.tiles[`${x}.${y}.${z}`] = new RasterTile(`${this.url}/${x}/${y}/${z}.png`, {x, y, z});
  }
  async getElevationTileByCoordinates(x, y, z, retryAttempt = 0) {
    if(retryAttempt > 3) {
      throw new Error(`Could not load tile at ${x}, ${y}, ${z}.`)
    }
    if(this.tiles[`${x}.${y}.${z}`]) {
      return this.tiles[`${x}.${y}.${z}`];
    } else {
      await this.loadElevationTile(x, y, z);
      retryAttempt++;
      return this.getElevationTile(x, y, z, retryAttempt);
    }
  }
  async getElevationAtLngLat(lngLat) {
    const {x, y, z} = lngLat.toTileCoordinates();
    const tile = await this.getElevationTileByCoordinates(x, y, z);
    const elevation = tile.getElevationAtTileSubCoordinates();
  }
}

class RasterTile {
  constructor(url, tileCoordinates) {
    this.url = url;
    this.image = null;
    this.tileCoordinates = tileCoordinates;
  }
  async load() {
    this.image = await Jimp.read({
      url: this.url
    });
  }
  getImageDataAtTileSubCoordinates(x, y) {
    console.log(this.image.bitmap.data);
    return {r: 0, g: 0, b: 0, a: 0};
  }
}
