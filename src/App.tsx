import { useState, useEffect, useCallback } from "react";
import "./App.css";
import Sidebar from "./components/Sidebar/Sidebar";
import "mapbox-gl/dist/mapbox-gl.css";
import { useAppStore } from "./store/appStore";
import searchMap from "./store/searchMap";
import BehaviorProfiles from "./services/statistics/StatisticalBehaviorProfiles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretRight, faCaretLeft } from "@fortawesome/free-solid-svg-icons";

const profiles = new BehaviorProfiles();

export default function App() {
  const [sidebarIsOpen, setSidebarIsOpen] = useState(true);
  const setMapCenter = useAppStore((s) => s.setMapCenter);

  useEffect(() => {
    const behavior = profiles.getClosestBehaviorByHierarchy([
      "hiker",
      "temperate",
      "mtn",
    ]);
    const startPoint = { lat: 37.775754, lng: -119.348739 };
    setMapCenter(startPoint);
    searchMap.setBehavior(behavior);
    searchMap.on("load", () => searchMap.setIPPMarker(startPoint));
    searchMap.on("move", () => setMapCenter(searchMap.getLngLat()));
    searchMap.load("map", startPoint);
  }, [setMapCenter]);

  const toggleSidebarOpen = useCallback(() => {
    setSidebarIsOpen((prev) => {
      // resize map after toggling (needs a tick for DOM to update)
      setTimeout(() => searchMap.resize(), 0);
      return !prev;
    });
  }, []);

  const setBehaviorByKeys = useCallback((keys: string[]) => {
    const behavior = profiles.getClosestBehaviorByHierarchy(keys);
    searchMap.setBehavior(behavior);
  }, []);

  return (
    <div className="app">
      <div className="app-content">
        <Sidebar
          setBehaviorByKeys={setBehaviorByKeys}
          isOpen={sidebarIsOpen}
        />
        <div className="map-container">
          <div id="map" />;
          <div className="sidebar-toggle-container">
            <div
              className="sidebar-toggle-button"
              onClick={toggleSidebarOpen}
            >
              <FontAwesomeIcon
                icon={sidebarIsOpen ? faCaretLeft : faCaretRight}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
