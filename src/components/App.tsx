import { useEffect, useCallback, useState } from "react";
import "./App.css";
import Navbar from "./Navbar";
import MapSwitcher from "./MapSwitcher";
import Legend from "./Legend";
import MapContextMenu from "./MapContextMenu";
import "mapbox-gl/dist/mapbox-gl.css";
import { useAppStore } from "../store/appStore";
import searchMap from "../store/searchMap";
import BehaviorProfiles from "../services/statistics/StatisticalBehaviorProfiles";

const profiles = new BehaviorProfiles();

interface ContextMenuState {
  x: number;
  y: number;
  lngLat: { lng: number; lat: number };
}

export default function App() {
  const setMapCenter = useAppStore((s) => s.setMapCenter);
  const ipp = useAppStore((s) => s.markers.byId.ipp);
  const direction = useAppStore((s) => s.markers.byId.direction);
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);

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

  useEffect(() => {
    const handler = (evt: any) => {
      setContextMenu({
        x: evt.point.x,
        y: evt.point.y,
        lngLat: { lng: evt.lngLat.lng, lat: evt.lngLat.lat },
      });
    };
    searchMap.on("contextmenu", handler);
    return () => {
      searchMap.off("contextmenu", handler);
    };
  }, []);

  const setBehaviorByKeys = useCallback((keys: string[]) => {
    const behavior = profiles.getClosestBehaviorByHierarchy(keys);
    searchMap.setBehavior(behavior);
  }, []);

  return (
    <div className="app">
      <Navbar setBehaviorByKeys={setBehaviorByKeys} />
      <div className="app-content">
        <div
          className="map-container"
          onContextMenu={(e) => e.preventDefault()}
        >
          <div id="map" />
          <MapSwitcher />
          <Legend />
          {contextMenu && (
            <MapContextMenu
              x={contextMenu.x}
              y={contextMenu.y}
              hasIpp={Boolean(ipp)}
              hasDirection={Boolean(direction)}
              onPlaceIpp={() => searchMap.setIPPMarker(contextMenu.lngLat)}
              onPlaceDirection={() =>
                searchMap.setDestinationMarker(contextMenu.lngLat)
              }
              onClose={() => setContextMenu(null)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
