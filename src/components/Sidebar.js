import React from 'react';
import ProfileSelector from './ProfileSelector';
import LngLat from '../services/LngLat';
import BehaviorStats from './BehaviorStats';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import BehaviorProfiles from '../services/behavior/BehaviorProfiles';
import {downloadGPX} from '../actions/downloadActions';
import searchMap from '../store/searchMap';
import MarkerManager from './MarkerManager';

class Sidebar extends React.Component {
  constructor() {
    super();
    this.searchMap = searchMap;
  }
  addDestinationMarker() {
    if(this.props.ipp) {
      const lngLat = new LngLat(this.props.ipp.lngLat).moveTo(0, 2000);
      searchMap.setDestinationMarker(lngLat);
    } else {
      const lngLat = new LngLat(this.props.mapCenter);
      searchMap.setDestinationMarker(lngLat);
    }
  }
  setMarkerLngLat = (markerId, lngLat) => {
    switch(markerId) {
    case 'ipp':
      return this.searchMap.setIPPMarker(lngLat);
    case 'direction':
      return this.searchMap.setDestinationMarker(lngLat);
    default:
      throw new Error(`Marker id ${markerId} is not recognized.`);
    }
  }
  removeMarker = markerId => {
    switch(markerId) {
    case 'ipp':
      return this.searchMap.clearIPPMarker();
    case 'direction':
      return this.searchMap.clearDestinationMarker();
    default:
      throw new Error(`Marker id ${markerId} is not recognized.`);
    }
  }
  render() {
    const {
      downloadGPX
    } = this.props;
    const profiles = new BehaviorProfiles().getProfiles();
      return (
        <div className="sidebar__wrapper">
          <div className="sidebar__content">
            <h1 className="title">Missing Person Behavior Mapper</h1>
            <div>
              <MarkerManager
                name="Initial Planning Point"
                lngLat={this.props.ipp ? this.props.ipp.lngLat : null}
                setLngLat={lngLat => this.setMarkerLngLat('ipp', lngLat)}
                remove={() => this.removeMarker('ipp')}
                flyTo={lngLat => this.searchMap.flyTo(lngLat)}
                mapLngLat={this.props.mapCenter}
              />
              <MarkerManager
                name="Direction of Travel"
                lngLat={this.props.direction ? this.props.direction.lngLat : null}
                setLngLat={lngLat => this.setMarkerLngLat('direction', lngLat)}
                remove={() => this.removeMarker('direction')}
                flyTo={this.searchMap.flyTo}
                mapLngLat={this.props.mapCenter}
              />
            </div>
            <div>
              <h2>Behavior Range Rings</h2>
              {this.props.behavior ? <ProfileSelector
                profiles={profiles}
                behavior={this.props.behavior}
                setBehaviorByKeys={this.props.setBehaviorByKeys}
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
    downloadGPX: bindActionCreators(downloadGPX, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Sidebar);
