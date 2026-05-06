export const MAP_STYLES = [
  { id: "topo", label: "Topo", url: "mapbox://styles/mapbox/outdoors-v12" },
  {
    id: "satellite",
    label: "Satellite",
    url: "mapbox://styles/mapbox/satellite-streets-v12",
  },
  { id: "streets", label: "Streets", url: "mapbox://styles/mapbox/streets-v12" },
  { id: "dark", label: "Dark", url: "mapbox://styles/mapbox/dark-v11" },
] as const;

export const DEFAULT_MAP_STYLE = MAP_STYLES[0];

export type MapStyleId = (typeof MAP_STYLES)[number]["id"];
