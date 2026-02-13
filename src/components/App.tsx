import { useEffect, useCallback } from "react";
import "./App.css";
import Navbar from "./Navbar";
import "mapbox-gl/dist/mapbox-gl.css";
import { useAppStore } from "../store/appStore";
import searchMap from "../store/searchMap";
import BehaviorProfiles from "../services/statistics/StatisticalBehaviorProfiles";

const profiles = new BehaviorProfiles();

export default function App() {
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

  const setBehaviorByKeys = useCallback((keys: string[]) => {
    const behavior = profiles.getClosestBehaviorByHierarchy(keys);
    searchMap.setBehavior(behavior);
  }, []);

  return (
    <div className="app">
      <Navbar setBehaviorByKeys={setBehaviorByKeys} />
      <div className="app-content">
        <div className="map-container">
          <div id="map" />
        </div>
      </div>
    </div>
  );
}
