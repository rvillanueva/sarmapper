import { useEffect, useCallback, useState } from "react";
import "./App.css";
import Navbar, { type ModalType } from "./Navbar";
import MapSwitcher from "./MapSwitcher";
import Legend from "./Legend";
import BehaviorBadge from "./BehaviorBadge";
import MapContextMenu from "./MapContextMenu";
import "mapbox-gl/dist/mapbox-gl.css";
import { useAppStore } from "../store/appStore";
import searchMap from "../store/searchMap";
import BehaviorProfiles from "../services/statistics/StatisticalBehaviorProfiles";
import {
  readUrlState,
  sameLngLat,
  sameStringArray,
  writeUrlState,
} from "../utils/urlState";

const profiles = new BehaviorProfiles();
const DEFAULT_BEHAVIOR_KEYS = ["hiker", "temperate", "mtn"];
const DEFAULT_START_POINT = { lat: 37.775754, lng: -119.348739 };

interface ContextMenuState {
  x: number;
  y: number;
  lngLat: { lng: number; lat: number };
}

export default function App() {
  const setMapCenter = useAppStore((s) => s.setMapCenter);
  const ipp = useAppStore((s) => s.markers.byId.ipp);
  const direction = useAppStore((s) => s.markers.byId.direction);
  const behavior = useAppStore((s) => s.behavior);
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  useEffect(() => {
    const urlState = readUrlState();
    const behaviorKeys = urlState.behaviorHierarchy ?? DEFAULT_BEHAVIOR_KEYS;
    const behavior = profiles.getClosestBehaviorByHierarchy(behaviorKeys);
    const startPoint = urlState.ipp ?? DEFAULT_START_POINT;

    let isDragging = false;

    const persistCurrentState = () => {
      const state = useAppStore.getState();
      const ippLngLat = state.markers.byId.ipp?.lngLat;
      const directionLngLat = state.markers.byId.direction?.lngLat;
      writeUrlState({
        ipp: ippLngLat
          ? { lng: ippLngLat.lng, lat: ippLngLat.lat }
          : undefined,
        direction: directionLngLat
          ? { lng: directionLngLat.lng, lat: directionLngLat.lat }
          : undefined,
        behaviorHierarchy: state.behavior?.hierarchy,
      });
    };

    const handleDragStart = () => {
      isDragging = true;
    };
    const handleDragEnd = () => {
      isDragging = false;
      persistCurrentState();
    };
    searchMap.on("marker:dragstart", handleDragStart);
    searchMap.on("marker:dragend", handleDragEnd);

    const unsubscribe = useAppStore.subscribe((state, prevState) => {
      if (isDragging) return;
      const ippLngLat = state.markers.byId.ipp?.lngLat;
      const directionLngLat = state.markers.byId.direction?.lngLat;
      const hierarchy = state.behavior?.hierarchy;
      const prevIppLngLat = prevState.markers.byId.ipp?.lngLat;
      const prevDirectionLngLat = prevState.markers.byId.direction?.lngLat;
      const prevHierarchy = prevState.behavior?.hierarchy;
      if (
        sameLngLat(ippLngLat, prevIppLngLat) &&
        sameLngLat(directionLngLat, prevDirectionLngLat) &&
        sameStringArray(hierarchy, prevHierarchy)
      ) {
        return;
      }
      writeUrlState({
        ipp: ippLngLat
          ? { lng: ippLngLat.lng, lat: ippLngLat.lat }
          : undefined,
        direction: directionLngLat
          ? { lng: directionLngLat.lng, lat: directionLngLat.lat }
          : undefined,
        behaviorHierarchy: hierarchy,
      });
    });

    setMapCenter(startPoint);
    searchMap.setBehavior(behavior);
    searchMap.on("load", () => {
      searchMap.setIPPMarker(startPoint);
      if (urlState.direction) {
        searchMap.setDestinationMarker(urlState.direction);
      }
    });
    searchMap.on("move", () => setMapCenter(searchMap.getLngLat()));
    searchMap.load("map", startPoint);

    return () => {
      searchMap.off("marker:dragstart", handleDragStart);
      searchMap.off("marker:dragend", handleDragEnd);
      unsubscribe();
    };
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
      <Navbar
        setBehaviorByKeys={setBehaviorByKeys}
        activeModal={activeModal}
        setActiveModal={setActiveModal}
      />
      <div className="app-content">
        <div
          className="map-container"
          onContextMenu={(e) => e.preventDefault()}
        >
          <div id="map" />
          <MapSwitcher />
          <div className="absolute bottom-7 right-2 z-10 flex flex-col items-end gap-2">
            <BehaviorBadge
              behavior={behavior}
              onOpenDetails={() => setActiveModal("behavior")}
            />
            <Legend />
          </div>
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
