import React from 'react';
import LngLat from '../../../services/LngLat';

function parseLatLngString(str) {
  const split = str.split(',');
  const lng = Number(split[1]);
  const lat = Number(split[0]);
  if(!isNaN(lat) && !isNaN(lng)) {
    return {lng, lat};
  }
  return null;
}

function roundToPrecision(value, precision = 0) {
  const multiplier = Math.pow(10, precision);
  return Math.round(value * multiplier) / multiplier;
}

function coordinatesToString(coords) {
  coords = new LngLat(coords).toJSON();
  return `${roundToPrecision(coords.lat, 6)}, ${roundToPrecision(coords.lng, 6)}`;
}

export default class MarkerManager extends React.Component {
  constructor() {
    super();
    this.state = {
      lngLatInput: '',
      lngLatInputIsDirty: false
    }
  }
  componentDidMount() {
    this.resetLngLatInput();
  }
  resetLngLatInput() {
    this.setState({
      lngLatInput: this.props.lngLat ? coordinatesToString(this.props.lngLat) : ''
    })
  }
  componentDidUpdate(prevProps) {
    if(prevProps.lngLat !== this.props.lngLat && this.props.lngLat) {
      this.setState({
        lngLatInput: coordinatesToString(this.props.lngLat),
        lngLatInputIsDirty: false
      })
    }
  }
  setDirtyLngLatString = str => {
    this.setState({
      lngLatInput: str,
      lngLatInputIsDirty: true
    })
  }
  setLngLatFromInput() {
    const lngLat = parseLatLngString(this.state.lngLatInput);
    if(lngLat) {
      this.props.setLngLat(lngLat);
    } else {
      this.resetLngLatInput();
    }
  }
  renderIfMarkerExists() {
    return <div>
      <input className="lng-lat-input" value={this.state.lngLatInput} onChange={evt => this.setDirtyLngLatString(evt.target.value)}/>
      {this.state.lngLatInputIsDirty
        ? <button onClick={() => this.setLngLatFromInput()}>Update</button>
        : null}
        <div>
          <button onClick={() => this.props.setLngLat(this.props.mapLngLat)}>Set Here</button>
          <button onClick={() => this.props.flyTo(this.props.lngLat)}>Go To</button>
          <button onClick={() => this.props.remove()}>Clear</button>
        </div>
      </div>
  }
  renderIfNoMarker() {
    return <button onClick={() => this.props.setLngLat(this.props.mapLngLat)}>Add</button>
  }
  render() {
    return (
      <div className="marker-manager">
        <span className="marker__name">{this.props.name}</span>
        {
          this.props.lngLat
          ? this.renderIfMarkerExists()
          : this.renderIfNoMarker()
        }
      </div>
    );
  }
}
