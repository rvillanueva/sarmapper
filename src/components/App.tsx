import { useEffect, useCallback, useState, useRef } from "react";
import "./App.css";
import Navbar from "./Navbar";
import "mapbox-gl/dist/mapbox-gl.css";
import { useAppStore } from "../store/appStore";
import searchMap from "../store/searchMap";
import BehaviorProfiles from "../services/statistics/StatisticalBehaviorProfiles";
import { type MapStyleId } from "../services/SearchMap";
import MapStyleSwitcher from "./map/MapStyleSwitcher";
import MapToolbar from "./map/MapToolbar";
import MapContextMenu from "./map/MapContextMenu";
import MapHUD from "./map/MapHUD";
import MapLegend from "./map/MapLegend";
import MapCrosshair from "./map/MapCrosshair";

const profiles = new BehaviorProfiles();
const DEFAULT_START = { lat: 37.775754, lng: -119.348739 };

export default function App() {
  const setMapCenter = useAppStore((s) => s.setMapCenter);
  const hasHydrated = useAppStore((s) => s.hasHydrated);
  const persistedBehavior = useAppStore((s) => s.behavior);
  const persistedMapStyle = useAppStore((s) => s.mapStyle);
  const setPersistedMapStyle = useAppStore((s) => s.setMapStyle);
  const ipp = useAppStore((s) => s.markers.byId.ipp);
  const direction = useAppStore((s) => s.markers.byId.direction);
  const legendOpen = useAppStore((s) => s.legendOpen);
  const setLegendOpen = useAppStore((s) => s.setLegendOpen);

  const [placingMode, setPlacingMode] = useState<null | "ipp" | "direction">(null);
  const [activeStyle, setActiveStyle] = useState<MapStyleId>("outdoors");
  const [cursor, setCursor] = useState<{ lng: number; lat: number } | null>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (!hasHydrated || initialized.current) return;
    initialized.current = true;

    const initialHierarchy =
      persistedBehavior?.hierarchy ?? ["hiker", "temperate", "mtn"];
    const behavior = profiles.getClosestBehaviorByHierarchy(initialHierarchy);
    const persistedIpp = ipp?.lngLat ?? null;
    const persistedDirection = direction?.lngLat ?? null;
    const startPoint = persistedIpp ?? DEFAULT_START;
    const styleToUse = (persistedMapStyle as MapStyleId) ?? "outdoors";

    setMapCenter(startPoint);
    searchMap.style = styleToUse;
    setActiveStyle(styleToUse);
    searchMap.setBehavior(behavior);

    searchMap.on("load", () => {
      if (persistedIpp) {
        searchMap.setIPPMarker(persistedIpp);
      } else {
        searchMap.setIPPMarker(startPoint);
      }
      if (persistedDirection) {
        searchMap.setDestinationMarker(persistedDirection);
      }
    });
    searchMap.on("move", () => setMapCenter(searchMap.getLngLat()));
    searchMap.on("placing.change", (mode: any) => setPlacingMode(mode));
    searchMap.on("style.change", (s: MapStyleId) => {
      setActiveStyle(s);
      setPersistedMapStyle(s);
    });
    searchMap.on("mousemove", (evt: any) =>
      setCursor({ lng: evt.lngLat.lng, lat: evt.lngLat.lat })
    );

    searchMap.load("map", startPoint);
  }, [hasHydrated]);

  const setBehaviorByKeys = useCallback((keys: string[]) => {
    const behavior = profiles.getClosestBehaviorByHierarchy(keys);
    searchMap.setBehavior(behavior);
  }, []);

  const handlePlaceIpp = useCallback(() => {
    searchMap.setPlacingMode(placingMode === "ipp" ? null : "ipp");
  }, [placingMode]);

  const handlePlaceDirection = useCallback(() => {
    searchMap.setPlacingMode(placingMode === "direction" ? null : "direction");
  }, [placingMode]);

  const handleClearAll = useCallback(() => {
    searchMap.clearAll();
  }, []);

  const handleStyleChange = useCallback((id: MapStyleId) => {
    searchMap.setMapStyle(id);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.tagName === "SELECT" ||
        target?.isContentEditable
      ) {
        return;
      }
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      const k = e.key.toLowerCase();
      if (k === "i") {
        e.preventDefault();
        const center = searchMap.getLngLat();
        if (center) searchMap.setIPPMarker(center);
      } else if (k === "d") {
        e.preventDefault();
        const center = searchMap.getLngLat();
        if (center) searchMap.setDestinationMarker(center);
      } else if (k === "c") {
        e.preventDefault();
        searchMap.clearAll();
      } else if (k === "escape") {
        searchMap.setPlacingMode(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="app">
      <Navbar setBehaviorByKeys={setBehaviorByKeys} />
      <div className="app-content">
        <div className="map-container">
          <div id="map" />
          <MapCrosshair visible={!placingMode} />
          <MapStyleSwitcher active={activeStyle} onChange={handleStyleChange} />
          <MapLegend
            open={legendOpen}
            onToggle={() => setLegendOpen(!legendOpen)}
            hasIpp={!!ipp}
            hasDirection={!!direction}
          />
          <MapToolbar
            hasIpp={!!ipp}
            hasDirection={!!direction}
            placingMode={placingMode}
            onPlaceIpp={handlePlaceIpp}
            onPlaceDirection={handlePlaceDirection}
            onClearAll={handleClearAll}
          />
          <MapHUD
            ipp={ipp?.lngLat ?? null}
            direction={direction?.lngLat ?? null}
            cursor={cursor}
          />
          <MapContextMenu />
        </div>
      </div>
    </div>
  );
}
