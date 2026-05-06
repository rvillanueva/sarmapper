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

const modalPanelBase =
  "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-101 bg-white border border-rule-strong rounded-md shadow-[0_8px_32px_rgba(0,0,0,0.10),0_1px_3px_rgba(0,0,0,0.04)] w-[calc(100vw-2rem)] max-h-[80vh] overflow-y-auto p-7";

const modalPanelClass = `${modalPanelBase} max-w-md`;

const eyebrowClass =
  "font-mono text-[10px] tracking-[0.18em] uppercase text-warm-gray font-normal";

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
      <nav className="flex items-center justify-between bg-white border-b border-rule px-6 py-1 z-50">
        <div className="flex items-baseline gap-3 min-w-0">
          <img
            src="/sarmapper-wordmark.svg"
            alt="SAR Mapper"
            className="h-8 w-auto"
          />
        </div>
        <div className="flex items-center gap-1">
          {navItems.map(({ id, label, icon: Icon }) => {
            const active = activeModal === id;
            return (
              <button
                key={id}
                onClick={() => openModal(id)}
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-sm font-mono text-[11px] uppercase tracking-[0.12em] transition-colors duration-150 cursor-pointer ${
                  active
                    ? "bg-ink text-white"
                    : "bg-white text-charcoal hover:bg-snow"
                }`}
                aria-label={label}
              >
                <Icon size={14} strokeWidth={1.75} />
                <span className="hidden sm:inline">{label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Markers Modal */}
      <Dialog.Root open={activeModal === "markers"} onOpenChange={handleOpenChange}>
        <Dialog.Portal>
          <Dialog.Backdrop className="fixed inset-0 bg-ink/30 backdrop-blur-[2px] z-100" />
          <Dialog.Popup className={modalPanelClass}>
            <div className="flex items-center justify-between mb-5 pb-4 border-b border-rule">
              <div>
                <div className={eyebrowClass + " mb-1"}>Section 01</div>
                <Dialog.Title className="font-serif text-2xl text-ink m-0 leading-none">
                  Markers
                </Dialog.Title>
              </div>
              <Dialog.Close className="p-1 rounded-sm hover:bg-silver-light text-warm-gray hover:text-charcoal cursor-pointer transition-colors">
                <X size={18} strokeWidth={1.5} />
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
          <Dialog.Backdrop className="fixed inset-0 bg-ink/30 backdrop-blur-[2px] z-100" />
          <Dialog.Popup className={modalPanelClass}>
            <div className="flex items-center justify-between mb-5 pb-4 border-b border-rule">
              <div>
                <div className={eyebrowClass + " mb-1"}>Section 02</div>
                <Dialog.Title className="font-serif text-2xl text-ink m-0 leading-none">
                  Statistical Behavior
                </Dialog.Title>
              </div>
              <Dialog.Close className="p-1 rounded-sm hover:bg-silver-light text-warm-gray hover:text-charcoal cursor-pointer transition-colors">
                <X size={18} strokeWidth={1.5} />
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
              <div className="mt-5 pt-4 border-t border-rule font-mono text-[10px] tracking-[0.06em] uppercase text-warm-gray leading-relaxed">
                Source —{" "}
                <a
                  href="https://www.dbs-sar.com/SAR_Research/ISRID.htm"
                  className="text-orange-brand hover:text-charcoal transition-colors"
                >
                  Intl. Search &amp; Rescue Database
                </a>{" "}
                / 2011
              </div>
            </div>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Export Modal */}
      <Dialog.Root open={activeModal === "export"} onOpenChange={handleOpenChange}>
        <Dialog.Portal>
          <Dialog.Backdrop className="fixed inset-0 bg-ink/30 backdrop-blur-[2px] z-100" />
          <Dialog.Popup className={`${modalPanelBase} max-w-sm`}>
            <div className="flex items-center justify-between mb-5 pb-4 border-b border-rule">
              <div>
                <div className={eyebrowClass + " mb-1"}>Section 03</div>
                <Dialog.Title className="font-serif text-2xl text-ink m-0 leading-none">
                  Export
                </Dialog.Title>
              </div>
              <Dialog.Close className="p-1 rounded-sm hover:bg-silver-light text-warm-gray hover:text-charcoal cursor-pointer transition-colors">
                <X size={18} strokeWidth={1.5} />
              </Dialog.Close>
            </div>
            <div className="flex flex-col gap-2">
              <button
                onClick={downloadGPX}
                className="w-full px-4 py-3 rounded-sm bg-ink text-white font-mono text-[11px] uppercase tracking-[0.14em] hover:bg-charcoal transition-colors cursor-pointer"
              >
                Download · GPX
              </button>
              <button
                onClick={downloadKML}
                className="w-full px-4 py-3 rounded-sm border border-rule-strong bg-white text-charcoal font-mono text-[11px] uppercase tracking-[0.14em] hover:bg-snow hover:border-charcoal transition-colors cursor-pointer"
              >
                Download · KML
              </button>
            </div>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>

      {/* About Modal */}
      <Dialog.Root open={activeModal === "about"} onOpenChange={handleOpenChange}>
        <Dialog.Portal>
          <Dialog.Backdrop className="fixed inset-0 bg-ink/30 backdrop-blur-[2px] z-100" />
          <Dialog.Popup className={modalPanelClass}>
            <div className="flex items-center justify-between mb-5 pb-4 border-b border-rule">
              <div>
                <div className={eyebrowClass + " mb-1"}>Colophon</div>
                <Dialog.Title className="font-serif text-2xl text-ink m-0 leading-none">
                  About
                </Dialog.Title>
              </div>
              <Dialog.Close className="p-1 rounded-sm hover:bg-silver-light text-warm-gray hover:text-charcoal cursor-pointer transition-colors">
                <X size={18} strokeWidth={1.5} />
              </Dialog.Close>
            </div>
            <div className="text-[14.5px] text-slate-warm space-y-4 leading-relaxed font-light">
              <p className="m-0">
                Interface and visualization designed by{" "}
                <a
                  href="mailto:ryan@sarmapper.org"
                  className="text-orange-brand hover:text-charcoal transition-colors underline-offset-2"
                >
                  Ryan Villanueva
                </a>
                .
              </p>
              <p className="m-0">
                Statistical behavior data from{" "}
                <a
                  href="http://www.dbs-sar.com/"
                  className="text-orange-brand hover:text-charcoal transition-colors underline-offset-2"
                >
                  Lost Person Behavior
                </a>{" "}
                by Robert Koester.
              </p>
              <p className="m-0">
                Open source code available on{" "}
                <a
                  href="https://github.com/rvillanueva/sarmapper"
                  className="text-orange-brand hover:text-charcoal transition-colors underline-offset-2"
                >
                  Github
                </a>
                .
              </p>
              <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-warm-gray leading-loose m-0 pt-3 border-t border-rule">
                The Lost Person Behavior Mapper does not guarantee the
                information provided is fully accurate. It is intended as a
                supplemental tool for Search and Rescue efforts and cannot
                replace other techniques. To report a missing person, contact
                local law enforcement immediately.
              </p>
              <div className="pt-4 border-t border-rule">
                <Subscribe />
              </div>
            </div>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
