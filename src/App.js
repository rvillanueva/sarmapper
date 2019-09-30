import React from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import 'mapbox-gl/dist/mapbox-gl.css';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {setBehavior} from './actions/behaviorActions';
import {downloadGPX} from './actions/downloadActions';
import searchMap from './store/searchMap';
import BehaviorProfiles from './services/behavior/BehaviorProfiles';

class App extends React.Component {
  constructor() {
    super();
    this.profiles = new BehaviorProfiles();
  }
  componentDidMount() {
    const behavior = this.profiles.getClosestBehaviorByHierarchy(['hiker', 'temperate', 'mtn']);
    const startPoint = {lat:  37.775754, lng: -119.348739};
    searchMap.setBehavior(behavior);
    searchMap.on('load', () => searchMap.setIPPMarker(startPoint));
    searchMap.load('map', startPoint);
  }
  downloadGPX = () => {
    this.props.downloadGPX();
  }
  render() {
    return (
      <div className="app">
        <Sidebar
        />
        <div className="map-container">
          <div id="map" />;
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setBehavior: bindActionCreators(setBehavior, dispatch),
    downloadGPX: bindActionCreators(downloadGPX, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
