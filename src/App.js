import React from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import 'mapbox-gl/dist/mapbox-gl.css';
import {Behavior} from './services/Behaviors';
import InitialPlanningPoint from './services/InitialPlanningPoint';
import DirectionPoint from './services/DirectionPoint';
import map from './store/searchMap';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {setBehavior} from './actions/behaviorActions';
import {downloadGPX} from './actions/downloadActions';


class App extends React.Component {
  componentDidMount() {
    this.props.setBehavior(['hiker', 'temperate', 'mtn'])
    map.load('map', {lat:  37.775754, lng: -119.348739});
  }
  downloadGPX = () => {
    const ipp = new InitialPlanningPoint(this.state.ipp, this.state.behavior);
    const directionPoint = this.state.directionPoint ? new DirectionPoint(this.state.directionPoint, this.state.behavior) : null;
    let features = ipp.getRangeRingCollectionLayer().source.data.features;
    if(directionPoint) {
      features = features.concat(directionPoint.getDispersionCollectionLayer(ipp.getLngLat(), new Behavior(this.state.behavior)).source.data.features);
      features = features.concat(directionPoint.getDirectionLineLayer(ipp.getLngLat()).source.data);
    }
    const geoJSON = {
      "type": "FeatureCollection",
      "features": features
    }
    this.props.downloadGPX(geoJSON);
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
