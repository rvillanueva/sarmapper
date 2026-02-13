import { create } from 'zustand'
import { initializeNormalState, mergeItems, removeItem } from '../utils/normalize'

interface MarkerState {
  allIds: string[]
  byId: Record<string, any>
}

interface AppState {
  markers: MarkerState
  behavior: any | null
  mapCenter: any | null

  // Marker actions
  setIppMarker: (items: any[]) => void
  clearIppMarker: () => void
  setDirectionMarker: (items: any[]) => void
  clearDirectionMarker: () => void

  // Behavior actions
  setBehavior: (behavior: any) => void

  // Map actions
  setMapCenter: (lngLat: any) => void
}

export const useAppStore = create<AppState>((set) => ({
  markers: initializeNormalState(),
  behavior: null,
  mapCenter: null,

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
}))
