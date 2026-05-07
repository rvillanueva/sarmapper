export interface UrlLngLat {
  lng: number;
  lat: number;
}

export interface UrlState {
  ipp?: UrlLngLat;
  direction?: UrlLngLat;
  behaviorHierarchy?: string[];
}

const COORD_PRECISION = 6;

function formatLngLat(lngLat: UrlLngLat): string {
  return `${lngLat.lng.toFixed(COORD_PRECISION)},${lngLat.lat.toFixed(COORD_PRECISION)}`;
}

function parseLngLat(value: string): UrlLngLat | null {
  const parts = value.split(',');
  if (parts.length !== 2) return null;
  const lng = Number.parseFloat(parts[0]);
  const lat = Number.parseFloat(parts[1]);
  if (!Number.isFinite(lng) || !Number.isFinite(lat)) return null;
  if (lng < -180 || lng > 180 || lat < -90 || lat > 90) return null;
  return { lng, lat };
}

export function readUrlState(): UrlState {
  if (typeof window === 'undefined') return {};
  const params = new URLSearchParams(window.location.search);
  const state: UrlState = {};
  const ippParam = params.get('ipp');
  if (ippParam) {
    const parsed = parseLngLat(ippParam);
    if (parsed) state.ipp = parsed;
  }
  const dirParam = params.get('dir');
  if (dirParam) {
    const parsed = parseLngLat(dirParam);
    if (parsed) state.direction = parsed;
  }
  const bParam = params.get('b');
  if (bParam) {
    const hierarchy = bParam.split(',').map((s) => s.trim()).filter(Boolean);
    if (hierarchy.length > 0) state.behaviorHierarchy = hierarchy;
  }
  return state;
}

export function writeUrlState(state: UrlState): void {
  if (typeof window === 'undefined') return;
  const params = new URLSearchParams(window.location.search);
  if (state.ipp) params.set('ipp', formatLngLat(state.ipp));
  else params.delete('ipp');
  if (state.direction) params.set('dir', formatLngLat(state.direction));
  else params.delete('dir');
  if (state.behaviorHierarchy && state.behaviorHierarchy.length > 0) {
    params.set('b', state.behaviorHierarchy.join(','));
  } else {
    params.delete('b');
  }
  const search = params.toString();
  const next = `${window.location.pathname}${search ? `?${search}` : ''}${window.location.hash}`;
  window.history.replaceState(window.history.state, '', next);
}
