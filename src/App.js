import React from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import 'mapbox-gl/dist/mapbox-gl.css';
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
