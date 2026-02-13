import { useState, useCallback } from "react";
import { Dialog } from "@base-ui/react/dialog";
import { MapPin, BarChart3, Download, Info, X } from "lucide-react";
import { useAppStore } from "../store/appStore";
import BehaviorProfiles from "../services/statistics/StatisticalBehaviorProfiles";
import { downloadGPX, downloadKML } from "../actions/downloadActions";
import searchMap from "../store/searchMap";
import MarkerManager from "./MarkerManager";
import Subscribe from "./Subscribe";
import ProfileSelector from "./ProfileSelector";
import BehaviorStats from "./BehaviorStats";

interface NavbarProps {
  setBehaviorByKeys: (keys: string[]) => void;
}

type ModalType = "markers" | "behavior" | "export" | "about" | null;

const navItems = [
  { id: "markers" as const, label: "Markers", icon: MapPin },
  { id: "behavior" as const, label: "Behavior", icon: BarChart3 },
  { id: "export" as const, label: "Export", icon: Download },
  { id: "about" as const, label: "About", icon: Info },
];

export default function Navbar({ setBehaviorByKeys }: NavbarProps) {
  const [activeModal, setActiveModal] = useState<ModalType>(null);

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

  const profiles = new BehaviorProfiles().getProfiles();

  const openModal = (id: ModalType) => setActiveModal(id);
  const closeModal = () => setActiveModal(null);

  function handleOpenChange(open: boolean) {
    if (!open) closeModal();
  }

  return (
    <>
      <nav className="flex items-center justify-between bg-white border-b border-gray-200 px-3 py-2 shadow-sm z-50">
        <div className="flex flex-col min-w-0 mr-2">
          <h1 className="text-base font-bold text-gray-800 leading-tight truncate">
            Lost Person Behavior Mapper
          </h1>
          <span className="text-xs text-gray-500">
            by{" "}
            <a
              href="mailto:ryan@sarmapper.org"
              className="hover:underline text-gray-500"
            >
              Ryan Villanueva
            </a>
          </span>
        </div>
        <div className="flex items-center gap-1">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => openModal(id)}
              className={`flex items-center gap-1.5 px-3 py-2 min-h-[44px] min-w-[44px] rounded-lg text-sm font-medium transition-colors cursor-pointer
                ${
                  activeModal === id
                    ? "bg-gray-800 text-white"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              aria-label={label}
            >
              <Icon size={18} />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Markers Modal */}
      <Dialog.Root open={activeModal === "markers"} onOpenChange={handleOpenChange}>
        <Dialog.Portal>
          <Dialog.Backdrop className="fixed inset-0 bg-black/40 backdrop-blur-sm z-100" />
          <Dialog.Popup className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-101 bg-white rounded-xl shadow-2xl w-[calc(100vw-2rem)] max-w-md max-h-[80vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <Dialog.Title className="text-lg font-semibold text-gray-900 m-0">
                Markers
              </Dialog.Title>
              <Dialog.Close className="p-1 rounded-md hover:bg-gray-100 text-gray-500 hover:text-gray-700 cursor-pointer">
                <X size={20} />
              </Dialog.Close>
            </div>
            <div className="space-y-4">
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
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Statistical Behavior Modal */}
      <Dialog.Root open={activeModal === "behavior"} onOpenChange={handleOpenChange}>
        <Dialog.Portal>
          <Dialog.Backdrop className="fixed inset-0 bg-black/40 backdrop-blur-sm z-100" />
          <Dialog.Popup className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-101 bg-white rounded-xl shadow-2xl w-[calc(100vw-2rem)] max-w-md max-h-[80vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <Dialog.Title className="text-lg font-semibold text-gray-900 m-0">
                Statistical Behavior
              </Dialog.Title>
              <Dialog.Close className="p-1 rounded-md hover:bg-gray-100 text-gray-500 hover:text-gray-700 cursor-pointer">
                <X size={20} />
              </Dialog.Close>
            </div>
            <div>
              {behavior ? (
                <ProfileSelector
                  profiles={profiles}
                  behavior={behavior}
                  setBehaviorByKeys={setBehaviorByKeys}
                />
              ) : null}
              {behavior ? <BehaviorStats behavior={behavior} /> : null}
              <div className="mt-2 text-xs text-gray-500 leading-snug">
                Source:{" "}
                <a
                  href="https://www.dbs-sar.com/SAR_Research/ISRID.htm"
                  className="underline"
                >
                  International Search &amp; Rescue Database
                </a>{" "}
                (2011)
              </div>
            </div>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Export Modal */}
      <Dialog.Root open={activeModal === "export"} onOpenChange={handleOpenChange}>
        <Dialog.Portal>
          <Dialog.Backdrop className="fixed inset-0 bg-black/40 backdrop-blur-sm z-100" />
          <Dialog.Popup className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-101 bg-white rounded-xl shadow-2xl w-[calc(100vw-2rem)] max-w-sm max-h-[80vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <Dialog.Title className="text-lg font-semibold text-gray-900 m-0">
                Export
              </Dialog.Title>
              <Dialog.Close className="p-1 rounded-md hover:bg-gray-100 text-gray-500 hover:text-gray-700 cursor-pointer">
                <X size={20} />
              </Dialog.Close>
            </div>
            <div className="flex flex-col gap-3">
              <button
                onClick={downloadGPX}
                className="w-full px-4 py-2.5 rounded-lg bg-gray-800 text-white font-medium text-sm hover:bg-gray-700 transition-colors cursor-pointer"
              >
                Download GPX
              </button>
              <button
                onClick={downloadKML}
                className="w-full px-4 py-2.5 rounded-lg bg-gray-800 text-white font-medium text-sm hover:bg-gray-700 transition-colors cursor-pointer"
              >
                Download KML
              </button>
            </div>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>

      {/* About Modal */}
      <Dialog.Root open={activeModal === "about"} onOpenChange={handleOpenChange}>
        <Dialog.Portal>
          <Dialog.Backdrop className="fixed inset-0 bg-black/40 backdrop-blur-sm z-100" />
          <Dialog.Popup className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-101 bg-white rounded-xl shadow-2xl w-[calc(100vw-2rem)] max-w-md max-h-[80vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <Dialog.Title className="text-lg font-semibold text-gray-900 m-0">
                About
              </Dialog.Title>
              <Dialog.Close className="p-1 rounded-md hover:bg-gray-100 text-gray-500 hover:text-gray-700 cursor-pointer">
                <X size={20} />
              </Dialog.Close>
            </div>
            <div className="text-sm text-gray-600 space-y-3 leading-relaxed">
              <p>
                Interface and visualization designed by{" "}
                <a href="mailto:ryan@sarmapper.org" className="underline">
                  Ryan Villanueva
                </a>
                .
              </p>
              <p>
                Statistical behavior data from{" "}
                <a href="http://www.dbs-sar.com/" className="underline">
                  Lost Person Behavior
                </a>{" "}
                by Robert Koester.
              </p>
              <p>
                Open source code available on{" "}
                <a
                  href="https://github.com/rvillanueva/sarmapper"
                  className="underline"
                >
                  Github
                </a>
                .
              </p>
              <p className="text-xs text-gray-400">
                The Lost Person Behavior Mapper does not guarantee that the
                information provided is 100% accurate. It is intended to be used
                as a supplemental tool for Search and Rescue efforts and cannot
                replace other search techniques. If you have a missing person to
                report, please contact your local law enforcement immediately.
              </p>
              <hr className="border-gray-200" />
              <Subscribe />
            </div>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
