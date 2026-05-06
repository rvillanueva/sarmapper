import { v4 as UUIDV4 } from 'uuid';

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
    if(!this.map) return;
    if(this.map.getLayer(this.id)) this.map.removeLayer(this.id);
    if(this.map.getSource(this.id)) this.map.removeSource(this.id);
  }
  toJSON() {
    return Object.assign({}, this.layer);
  }
}
