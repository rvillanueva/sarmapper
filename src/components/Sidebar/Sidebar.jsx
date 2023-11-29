import React from "react";
import PropTypes from "prop-types";
import LngLat from "../../services/LngLat";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import BehaviorProfiles from "../../services/statistics/StatisticalBehaviorProfiles";
import { downloadGPX, downloadKML } from "../../actions/downloadActions";
import searchMap from "../../store/searchMap";
import MarkerManager from "./components/MarkerManager";
import SidebarSection from "./components/SidebarSection";
import Subscribe from "./components/Subscribe";
import ProfileSelector from "./components/ProfileSelector";
import BehaviorStats from "./components/BehaviorStats";
import "./sidebar.css";

class Sidebar extends React.Component {
  constructor() {
    super();
    this.searchMap = searchMap;
  }
  addDestinationMarker() {
    if (this.props.ipp) {
      const lngLat = new LngLat(this.props.ipp.lngLat).moveTo(0, 2000);
      searchMap.setDestinationMarker(lngLat);
    } else {
      const lngLat = new LngLat(this.props.mapCenter);
      searchMap.setDestinationMarker(lngLat);
    }
  }
  setMarkerLngLat = (markerId, lngLat) => {
    switch (markerId) {
      case "ipp":
        return this.searchMap.setIPPMarker(lngLat);
      case "direction":
        return this.searchMap.setDestinationMarker(lngLat);
      default:
        throw new Error(`Marker id ${markerId} is not recognized.`);
    }
  };
  removeMarker = (markerId) => {
    switch (markerId) {
      case "ipp":
        return this.searchMap.clearIPPMarker();
      case "direction":
        return this.searchMap.clearDestinationMarker();
      default:
        throw new Error(`Marker id ${markerId} is not recognized.`);
    }
  };
  render() {
    const { downloadGPX, downloadKML } = this.props;
    if (this.props.isOpen === false) return null;
    const profiles = new BehaviorProfiles().getProfiles();
    return (
      <div className="sidebar__wrapper">
        <div className="sidebar__content">
          <div className="sidebar__heading">
            <h1 className="title">Lost Person Behavior Mapper</h1>
            <div className="author">
              by <a href="mailto: ryan@sarmapper.org">Ryan Villanueva</a>
            </div>
          </div>
          <div>
            <SidebarSection name="Markers">
              <div className="sidebar-section__padding">
                <MarkerManager
                  name="Initial Planning Point"
                  lngLat={this.props.ipp ? this.props.ipp.lngLat : null}
                  setLngLat={(lngLat) => this.setMarkerLngLat("ipp", lngLat)}
                  remove={() => this.removeMarker("ipp")}
                  flyTo={(lngLat) => this.searchMap.flyTo(lngLat)}
                  mapLngLat={this.props.mapCenter}
                />
                <MarkerManager
                  name="Direction of Travel"
                  lngLat={
                    this.props.direction ? this.props.direction.lngLat : null
                  }
                  setLngLat={(lngLat) =>
                    this.setMarkerLngLat("direction", lngLat)
                  }
                  remove={() => this.removeMarker("direction")}
                  flyTo={this.searchMap.flyTo}
                  mapLngLat={this.props.mapCenter}
                />
              </div>
            </SidebarSection>
            <SidebarSection name="Statistical Behavior">
              <div className="sidebar-section__padding">
                {this.props.behavior ? (
                  <ProfileSelector
                    profiles={profiles}
                    behavior={this.props.behavior}
                    setBehaviorByKeys={this.props.setBehaviorByKeys}
                  />
                ) : null}
                {this.props.behavior ? (
                  <BehaviorStats behavior={this.props.behavior} />
                ) : null}
                <div className="source-reference">
                  Source:{" "}
                  <a href="https://www.dbs-sar.com/SAR_Research/ISRID.htm">
                    International Search &amp; Rescue Database
                  </a>{" "}
                  (2011)
                </div>
              </div>
            </SidebarSection>
            <SidebarSection name="Export">
              <div className="sidebar-section__padding">
                <button onClick={downloadGPX}>Download GPX</button>
                <button onClick={downloadKML}>Download KML</button>
              </div>
            </SidebarSection>
            <SidebarSection name="About">
              <div className="sidebar-section__padding bylines">
                <p>
                  Interface and visualization designed by{" "}
                  <a href="mailto:ryan@sarmapper.org">Ryan Villanueva</a>.
                </p>
                <p>
                  Statistical behavior data from{" "}
                  <a href="http://www.dbs-sar.com/">Lost Person Behavior</a> by
                  Robert Koester.
                  <br />
                </p>
                <p>
                  Open source code available on{" "}
                  <a href="https://github.com/rvillanueva/sarmapper">Github</a>.
                </p>
                <p>
                  The Lost Person Behavior Mapper does not guarantee that the
                  information provided is 100% accurate. It is intended to be
                  used as a supplemental tool for Search and Rescue efforts and
                  cannot replace other search techniques. If you have a missing
                  person to report, please contact your local law enforcement
                  immediately.
                </p>
              </div>
            </SidebarSection>
            <Subscribe />
          </div>
        </div>
      </div>
    );
  }
}

Sidebar.propTypes = {
  isOpen: PropTypes.bool,
  ipp: PropTypes.object,
  direction: PropTypes.object,
  behavior: PropTypes.object,
};

function mapStateToProps(state) {
  return {
    mapCenter: state.map.center,
    ipp: state.markers.byId.ipp,
    direction: state.markers.byId.direction,
    behavior: state.behavior,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    downloadGPX: bindActionCreators(downloadGPX, dispatch),
    downloadKML: bindActionCreators(downloadKML, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
