import UUIDV4 from 'uuid/v4';

export default class MapStyleLayer {
  constructor(id, layer) {
    this.id = id || UUIDV4();
    this.layer = layer;
    this.map = null;
  }
  addTo(map) {
    this.map = map;
    this.map.addLayer(Object.assign({}, this.layer, {id: this.id}));
  }
  remove = () => {
    this.map.removeLayer(this.id);
    this.map.removeSource(this.id);
  }
  toJSON() {
    return Object.assign({}, this.layer);
  }
}
