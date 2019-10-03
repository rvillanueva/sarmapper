import UUIDV4 from 'uuid/v4';

export default class MapStyleLayer {
  constructor(layer) {
    const id = layer.id || UUIDV4();
    this.id = id;
    this.layer = Object.assign(layer, {id});
    this.map = null;
  }
  addTo(map) {
    this.map = map;
    this.map.addLayer(Object.assign({}, this.layer));
  }
  remove = () => {
    this.map.removeLayer(this.id);
    this.map.removeSource(this.id);
  }
  toJSON() {
    return Object.assign({}, this.layer);
  }
}
