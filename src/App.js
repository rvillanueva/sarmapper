import React from 'react';
import './App.css';
import SearchMap from './components/SearchMap';
import Sidebar from './components/Sidebar';
import 'mapbox-gl/dist/mapbox-gl.css';
import BehaviorProfiles from './services/Behaviors';
import InitialPlanningPoint from './services/InitialPlanningPoint';
import Downloader from './services/Downloader';
import LngLat from './services/LngLat';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    const startingPoint = [-119.348739, 37.775754];
    this.profiler = new BehaviorProfiles();
    this.downloader = new Downloader();
    this.mapRef = null;
    const behavior = this.profiler.getClosestBehaviorByHierarchy(['hiker', 'temperate', 'mtn']);
    this.state = {
      behavior: behavior.toJSON(),
      mapCenter: startingPoint,
      ipp: startingPoint
    };
  }
  onBehaviorSelectionChange = keys => {
    const behavior = this.profiler.getClosestBehaviorByHierarchy(keys);
    if(behavior) {
      this.setState({
        behavior,
      });
    }
  }
  downloadGPX = () => {
    const behavior = this.profiler.getBehavior(this.state.behaviorKeys);
    const ipp = new InitialPlanningPoint(this.state.ipp, behavior)
    this.downloader.downloadGPXFromRangeRings(ipp.getRangeRings());
  }
  updateMapCenter = lngLat => {
    this.setState({
      mapCenter: new LngLat(lngLat).toJSON()
    })
  }
  setIPP = (lngLat, flyTo) => {
    if(!lngLat) {
      lngLat = new LngLat(this.state.mapCenter);
    } else {
      lngLat = new LngLat(lngLat);
    }
    if(flyTo) {
      this.mapRef.moveTo(lngLat);
    }
    this.setState({
      ipp: lngLat.toJSON(),
      mapCenter: lngLat.toJSON()
    });
  }
  centerOnIPP = () => {
    this.mapRef.moveTo(this.state.ipp);
  }
  clearIPP = () => {
    this.setState({
      ipp: null
    })
  }
  render() {
    return (
      <div className="app">
        <Sidebar
          behavior={this.state.behavior}
          onBehaviorChange={this.onBehaviorSelectionChange}
          profiles={this.profiler.getProfiles()}
          setIPP={this.setIPP}
          clearIPP={this.clearIPP}
          ippCoordinates={this.state.ipp}
          centerOnIPP={this.centerOnIPP}
          downloadGPX={this.downloadGPX}
        />
        <div className="map-container">
          <SearchMap
            setMapRef={ref => {this.mapRef = ref}}
            ipp={this.state.ipp}
            setIPP={this.setIPP}
            behavior={this.state.behavior}
            updateMapCenter={this.updateMapCenter}
            mapCenter={this.state.mapCenter}
          />
        </div>
      </div>
    );
  }
}
