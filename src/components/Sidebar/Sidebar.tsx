import { useCallback } from "react";
import { useAppStore } from "../../store/appStore";
import BehaviorProfiles from "../../services/statistics/StatisticalBehaviorProfiles";
import { downloadGPX, downloadKML } from "../../actions/downloadActions";
import searchMap from "../../store/searchMap";
import MarkerManager from "./components/MarkerManager";
import SidebarSection from "./components/SidebarSection";
import Subscribe from "./components/Subscribe";
import ProfileSelector from "./components/ProfileSelector";
import BehaviorStats from "./components/BehaviorStats";
import "./sidebar.css";

interface SidebarProps {
  setBehaviorByKeys: (keys: string[]) => void;
  isOpen: boolean;
}

export default function Sidebar({ setBehaviorByKeys, isOpen }: SidebarProps) {
  const mapCenter = useAppStore((s) => s.mapCenter);
  const ipp = useAppStore((s) => s.markers.byId.ipp);
  const direction = useAppStore((s) => s.markers.byId.direction);
  const behavior = useAppStore((s) => s.behavior);

  const setMarkerLngLat = useCallback((markerId: string, lngLat: any) => {
    switch (markerId) {
      case "ipp":
        return searchMap.setIPPMarker(lngLat);
      case "direction":
        return searchMap.setDestinationMarker(lngLat);
      default:
        throw new Error(`Marker id ${markerId} is not recognized.`);
    }
  }, []);

  const removeMarker = useCallback((markerId: string) => {
    switch (markerId) {
      case "ipp":
        return searchMap.clearIPPMarker();
      case "direction":
        return searchMap.clearDestinationMarker();
      default:
        throw new Error(`Marker id ${markerId} is not recognized.`);
    }
  }, []);

  if (!isOpen) return null;

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
                lngLat={ipp ? ipp.lngLat : null}
                setLngLat={(lngLat) => setMarkerLngLat("ipp", lngLat)}
                remove={() => removeMarker("ipp")}
                flyTo={(lngLat) => searchMap.flyTo(lngLat)}
                mapLngLat={mapCenter}
              />
              <MarkerManager
                name="Direction of Travel"
                lngLat={direction ? direction.lngLat : null}
                setLngLat={(lngLat) => setMarkerLngLat("direction", lngLat)}
                remove={() => removeMarker("direction")}
                flyTo={searchMap.flyTo}
                mapLngLat={mapCenter}
              />
            </div>
          </SidebarSection>
          <SidebarSection name="Statistical Behavior">
            <div className="sidebar-section__padding">
              {behavior ? (
                <ProfileSelector
                  profiles={profiles}
                  behavior={behavior}
                  setBehaviorByKeys={setBehaviorByKeys}
                />
              ) : null}
              {behavior ? <BehaviorStats behavior={behavior} /> : null}
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
