import React from 'react';
import ProfileSelector from './ProfileSelector';
import LngLat from '../services/LngLat';
import BehaviorStats from './BehaviorStats';
import {connect} from 'react-redux';
import BehaviorProfiles from '../services/behavior/BehaviorProfiles';
import searchMap from '../store/searchMap';

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

class Sidebar extends React.Component {
  constructor() {
    super();
    this.state = {
      ippInput: '',
      ippInputIsDirty: false
    }
    this.searchMap = searchMap;
  }
  componentDidMount() {
    this.setState({
      ippInput: this.props.ipp ? coordinatesToString(this.props.ipp.lngLat) : ''
    })
  }
  componentDidUpdate(prevProps) {
    if(prevProps.ipp !== this.props.ipp && this.props.ipp) {
      this.setState({
        ippInput: coordinatesToString(this.props.ipp.lngLat),
        ippInputIsDirty: false
      })
    }
  }
  setDirtyIPPCoordinateString(str) {
    this.setState({
      ippInput: str,
      ippInputIsDirty: true
    })
  }
  setIPPFromInput = () => {
    const lngLat = parseLatLngString(this.state.ippInput);
    this.searchMap.setIPP(lngLat);
  }
  addDirectionMarker(lngLat) {
    if(!lngLat) {
      lngLat = new LngLat(this.props.ipp).moveTo(0, 2000);
    } else {
      lngLat = new LngLat(lngLat);
    }
    this.props.setDirectionMarker(lngLat);
  }
  render() {
    const {
      downloadGPX
    } = this.props;
    const profiles = new BehaviorProfiles().getProfiles();
      const clearIPPButton = this.props.ipp
        ?
          <button onClick={() => this.searchMap.clearIPPMarker()}>Clear</button>
        : null;
      const ippCoordinateInput = this.props.ipp
        ? <input value={this.state.ippInput} onChange={evt => this.setDirtyIPPCoordinateString(evt.target.value)}/>
        : null;
      const setNewIPPButton = this.state.ippInputIsDirty
        ? <button onClick={this.setIPPFromInput}>Update</button>
        : null;
      const centerIPPButton = !this.props.ipp
        ? <button onClick={() => this.searchMap.setIPPMarker(this.props.mapCenter)}>Add</button>
        : <button onClick={() => this.searchMap.setIPPMarker(this.props.mapCenter)}>Set Here</button>;
      const goToButton = this.props.ipp
        ? <button onClick={() => this.searchMap.flyTo(this.props.ipp.lngLat)}>Go To IPP</button>
        : null;
      return (
        <div className="sidebar__wrapper">
          <div className="sidebar__content">
            <h1 className="title">Missing Person Behavior Mapper</h1>
            <div>
              <h2>Initial Planning Point</h2>
              {ippCoordinateInput} {setNewIPPButton}
              <br />
              {centerIPPButton}
              {goToButton}
              {clearIPPButton}
            </div>
            <br />
            <div>
              <h2>Direction of Travel</h2>
              {
                this.props.direction
                ? <button onClick={() => this.props.clearDirectionMarker()}>Clear</button>
                : <button onClick={() => this.addDirectionMarker()}>Add</button>
              }
            </div>
            <br />
            <div>
              <h2>Behavior Range Rings</h2>
              {this.props.behavior ? <ProfileSelector
                profiles={profiles}
                behavior={this.props.behavior}
                setBehavior={this.props.setBehavior}
               /> : null}
            </div>
            <br />
            <div>
              <h2>Behavior Stats</h2>
              {this.props.behavior ? <BehaviorStats behavior={this.props.behavior}/> : null}
            </div>
            <br />
            <div>
              <h2>Export</h2>
              <button onClick={downloadGPX}>Download GPX</button>
            </div>
            <br />
            <br />
            <div className="bylines">
              <span id="byline">Data from <a href="http://www.dbs-sar.com/">Lost Person Behavior</a> by Robert Koester. </span>
              Interface and visualization designed by <a href="mailto:ryanvill@gmail.com">Ryan Villanueva</a>.
              <div className="disclaimer">
                The Lost Person Behavior Mapper does not guarantee that the information provided is 100% accurate. It is intended to be used as a supplemental tool for Search and Rescue efforts and cannot replace other search techniques. If you have a missing person to report, please contact your local law enforcement immediately.
              </div>
            </div>
          </div>
        </div>
      );
  }
}

function mapStateToProps(state) {
  return {
    mapCenter: state.map.center,
    ipp: state.markers.byId.ipp,
    direction: state.markers.byId.direction,
    behavior: state.behavior
  };
}

function mapDispatchToProps(dispatch) {
  return {
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Sidebar);
