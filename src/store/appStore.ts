import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { initializeNormalState, mergeItems, removeItem } from '../utils/normalize'

interface MarkerState {
  allIds: string[]
  byId: Record<string, any>
}

interface AppState {
  markers: MarkerState
  behavior: any | null
  mapCenter: any | null
  mapStyle: string
  legendOpen: boolean
  hasHydrated: boolean

  // Marker actions
  setIppMarker: (items: any[]) => void
  clearIppMarker: () => void
  setDirectionMarker: (items: any[]) => void
  clearDirectionMarker: () => void

  // Behavior actions
  setBehavior: (behavior: any) => void

  // Map actions
  setMapCenter: (lngLat: any) => void
  setMapStyle: (style: string) => void

  // UI actions
  setLegendOpen: (open: boolean) => void
  setHasHydrated: (v: boolean) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      markers: initializeNormalState(),
      behavior: null,
      mapCenter: null,
      mapStyle: 'outdoors',
      legendOpen: true,
      hasHydrated: false,

      setIppMarker: (items) =>
        set((state) => ({ markers: mergeItems(state.markers, items) })),

      clearIppMarker: () =>
        set((state) => ({ markers: removeItem(state.markers, 'ipp') })),

      setDirectionMarker: (items) =>
        set((state) => ({ markers: mergeItems(state.markers, items) })),

      clearDirectionMarker: () =>
        set((state) => ({ markers: removeItem(state.markers, 'direction') })),

      setBehavior: (behavior) => set({ behavior }),

      setMapCenter: (lngLat) => set({ mapCenter: lngLat }),
      setMapStyle: (mapStyle) => set({ mapStyle }),

      setLegendOpen: (legendOpen) => set({ legendOpen }),
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
    }),
    {
      name: 'sarmapper-state',
      storage: createJSONStorage(() =>
        typeof window !== 'undefined'
          ? window.localStorage
          : ({
              getItem: () => null,
              setItem: () => {},
              removeItem: () => {},
            } as Storage)
      ),
      partialize: (state) => ({
        markers: state.markers,
        behavior: state.behavior,
        mapStyle: state.mapStyle,
        legendOpen: state.legendOpen,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      },
    }
  )
)
