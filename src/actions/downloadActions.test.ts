import { describe, it, expect, beforeEach, vi } from "vitest";

vi.mock("js-file-download", () => ({
  default: vi.fn(),
}));

import fileDownload from "js-file-download";
import { toGeoJSON, downloadGPX, downloadKML } from "./downloadActions";
import { useAppStore } from "../store/appStore";

const ippLngLat = { lng: -122.4194, lat: 37.7749 };
const directionLngLat = { lng: -122.42, lat: 37.78 };

const behavior = {
  _id: "hiker__temperate__mtn",
  n: 100,
  hierarchy: ["hiker", "temperate", "mtn"],
  distances: [0.3, 1.5, 5.5, 9.9],
};

function makeMarkers(includeDirection = false) {
  const markers: { allIds: string[]; byId: Record<string, any> } = {
    allIds: ["ipp"],
    byId: {
      ipp: { _id: "ipp", lngLat: ippLngLat },
    },
  };
  if (includeDirection) {
    markers.allIds.push("direction");
    markers.byId.direction = { _id: "direction", lngLat: directionLngLat };
  }
  return markers;
}

describe("toGeoJSON", () => {
  it("returns a FeatureCollection with one ring per distance probability", () => {
    const result = toGeoJSON(makeMarkers(false), behavior);
    expect(result.type).toBe("FeatureCollection");
    // 4 distances (25/50/75/95) -> 4 ring LineStrings
    expect(result.features).toHaveLength(4);
    result.features.forEach((feature: any) => {
      expect(feature.type).toBe("Feature");
      expect(feature.geometry.type).toBe("LineString");
      // The ring has 37 points (36 segments + closing point)
      expect(feature.geometry.coordinates).toHaveLength(37);
      // Each coordinate should be [lng, lat]
      feature.geometry.coordinates.forEach((coord: [number, number]) => {
        expect(coord).toHaveLength(2);
        expect(typeof coord[0]).toBe("number");
        expect(typeof coord[1]).toBe("number");
      });
      expect(feature.properties.name).toMatch(/\d+%\s-\s[\d.]+km/);
    });
  });

  it("adds dispersion lines and a direction line when a direction marker is set", () => {
    const withDir = toGeoJSON(makeMarkers(true), behavior);
    const withoutDir = toGeoJSON(makeMarkers(false), behavior);
    // Should have more features when a direction is set.
    expect(withDir.features.length).toBeGreaterThan(withoutDir.features.length);
    const dispersionFeatures = withDir.features.filter(
      (f: any) => f.properties && f.properties.name === "Dispersion",
    );
    // 4 angles on each side -> 8 dispersion lines
    expect(dispersionFeatures).toHaveLength(8);
    const directionFeature = withDir.features.find(
      (f: any) =>
        f.properties && f.properties.name === "Direction of Travel Line",
    );
    expect(directionFeature).toBeDefined();
    expect(directionFeature?.geometry.type).toBe("LineString");
    expect(directionFeature?.geometry.coordinates).toEqual([
      [ippLngLat.lng, ippLngLat.lat],
      [directionLngLat.lng, directionLngLat.lat],
    ]);
  });

  it("omits dispersion and direction features when ipp has no direction marker", () => {
    const result = toGeoJSON(makeMarkers(false), behavior);
    const dispersion = result.features.filter(
      (f: any) => f.properties && f.properties.name === "Dispersion",
    );
    const direction = result.features.filter(
      (f: any) =>
        f.properties && f.properties.name === "Direction of Travel Line",
    );
    expect(dispersion).toHaveLength(0);
    expect(direction).toHaveLength(0);
  });
});

function setStore(includeDirection: boolean) {
  useAppStore.setState({
    markers: makeMarkers(includeDirection),
    behavior,
  });
}

function lastDownload() {
  const mock = vi.mocked(fileDownload);
  expect(mock).toHaveBeenCalledTimes(1);
  const [data, filename] = mock.mock.calls[0];
  return { data: data as string, filename: filename as string };
}

describe("downloadGPX", () => {
  beforeEach(() => {
    vi.mocked(fileDownload).mockClear();
  });

  it("produces a valid GPX 1.1 document with track segments for each ring", () => {
    setStore(false);
    downloadGPX();
    const { data, filename } = lastDownload();

    expect(filename).toMatch(/^\d+\.gpx$/);

    // Parse with the DOMParser available in jsdom
    const parsed = new DOMParser().parseFromString(data, "application/xml");
    expect(parsed.getElementsByTagName("parsererror")).toHaveLength(0);

    const gpx = parsed.documentElement;
    expect(gpx.tagName).toBe("gpx");
    expect(gpx.getAttribute("version")).toBe("1.1");
    expect(gpx.namespaceURI).toBe("http://www.topografix.com/GPX/1/1");

    const trks = parsed.getElementsByTagName("trk");
    // 4 ring LineStrings -> 4 tracks
    expect(trks).toHaveLength(4);

    // Each track should have a trkseg with 37 trkpt elements
    Array.from(trks).forEach((trk) => {
      const segs = trk.getElementsByTagName("trkseg");
      expect(segs).toHaveLength(1);
      const pts = segs[0].getElementsByTagName("trkpt");
      expect(pts).toHaveLength(37);
      Array.from(pts).forEach((pt) => {
        expect(pt.getAttribute("lat")).not.toBeNull();
        expect(pt.getAttribute("lon")).not.toBeNull();
        expect(Number.isFinite(Number(pt.getAttribute("lat")))).toBe(true);
        expect(Number.isFinite(Number(pt.getAttribute("lon")))).toBe(true);
      });
    });
  });

  it("includes dispersion and direction tracks when a direction marker is set", () => {
    setStore(true);
    downloadGPX();
    const { data } = lastDownload();

    const parsed = new DOMParser().parseFromString(data, "application/xml");
    const trks = parsed.getElementsByTagName("trk");
    // 4 rings + 8 dispersion lines + 1 direction line = 13 tracks
    expect(trks).toHaveLength(13);

    const names = Array.from(trks).map(
      (trk) => trk.getElementsByTagName("name")[0]?.textContent,
    );
    expect(names.filter((n) => n === "Dispersion")).toHaveLength(8);
    expect(names.filter((n) => n === "Direction of Travel Line")).toHaveLength(
      1,
    );
  });
});

describe("downloadKML", () => {
  beforeEach(() => {
    vi.mocked(fileDownload).mockClear();
  });

  it("produces a valid KML document with placemarks for each ring", () => {
    setStore(false);
    downloadKML();
    const { data, filename } = lastDownload();

    expect(filename).toMatch(/^\d+\.kml$/);
    expect(data).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(data).toContain('<kml xmlns="http://www.opengis.net/kml/2.2">');
    expect(data).toContain("</kml>");

    const parsed = new DOMParser().parseFromString(data, "application/xml");
    expect(parsed.getElementsByTagName("parsererror")).toHaveLength(0);

    const placemarks = parsed.getElementsByTagName("Placemark");
    // 4 rings -> 4 placemarks
    expect(placemarks).toHaveLength(4);

    Array.from(placemarks).forEach((pm) => {
      const lineStrings = pm.getElementsByTagName("LineString");
      expect(lineStrings).toHaveLength(1);
      const coords = lineStrings[0].getElementsByTagName("coordinates")[0];
      expect(coords).toBeDefined();
      const text = (coords.textContent || "").trim();
      expect(text.length).toBeGreaterThan(0);
      // Each coordinate triple is "lng,lat" (or "lng,lat,alt") joined by spaces
      const tuples = text.split(/\s+/);
      expect(tuples).toHaveLength(37);
      tuples.forEach((tuple) => {
        const parts = tuple.split(",");
        expect(parts.length).toBeGreaterThanOrEqual(2);
        expect(Number.isFinite(Number(parts[0]))).toBe(true);
        expect(Number.isFinite(Number(parts[1]))).toBe(true);
      });
    });
  });

  it("includes dispersion and direction placemarks when a direction marker is set", () => {
    setStore(true);
    downloadKML();
    const { data } = lastDownload();

    const parsed = new DOMParser().parseFromString(data, "application/xml");
    const placemarks = parsed.getElementsByTagName("Placemark");
    // 4 rings + 8 dispersion + 1 direction = 13 placemarks
    expect(placemarks).toHaveLength(13);

    const names = Array.from(placemarks).map(
      (pm) => pm.getElementsByTagName("name")[0]?.textContent,
    );
    expect(names.filter((n) => n === "Dispersion")).toHaveLength(8);
    expect(
      names.filter((n) => n === "Direction of Travel Line"),
    ).toHaveLength(1);
  });
});
