import { describe, it, expect } from "vitest";
import RangeRing from "./RangeRing";

const center = { lng: -122.4194, lat: 37.7749 };

describe("RangeRing", () => {
  it("samples 37 points (36 segments + closing point)", () => {
    const ring = new RangeRing(center, 1000, "25%");
    expect(ring.points).toHaveLength(37);
  });

  it("first and last points are the same closed ring point", () => {
    const ring = new RangeRing(center, 1000, "25%");
    const first = ring.points[0];
    const last = ring.points[ring.points.length - 1];
    expect(first.lng).toBeCloseTo(last.lng, 6);
    expect(first.lat).toBeCloseTo(last.lat, 6);
  });

  it("appends `<distance>km` to the supplied label", () => {
    const ring = new RangeRing(center, 2500, "50%");
    expect(ring.name).toBe("50% - 2.5km");
    expect(ring.getLabelText()).toBe("50% - 2.5km");
  });

  it("getLabelPosition returns the first sampled point", () => {
    const ring = new RangeRing(center, 1000, "25%");
    expect(ring.getLabelPosition()).toBe(ring.points[0]);
  });

  it("getGeoJSON returns a LineString feature with [lng, lat] coordinates", () => {
    const ring = new RangeRing(center, 1000, "25%");
    const result = ring.getGeoJSON();
    expect(result.type).toBe("geojson");
    expect(result.data.type).toBe("Feature");
    expect(result.data.geometry.type).toBe("LineString");
    expect(result.data.geometry.coordinates).toHaveLength(37);
    result.data.geometry.coordinates.forEach((coord: number[]) => {
      expect(coord).toHaveLength(2);
      expect(typeof coord[0]).toBe("number");
      expect(typeof coord[1]).toBe("number");
    });
    expect(result.data.properties.name).toBe("25% - 1km");
  });

  it("the first sampled point is due north of the center", () => {
    const ring = new RangeRing(center, 1000, "25%");
    const first = ring.points[0];
    expect(first.lat).toBeGreaterThan(center.lat);
    expect(first.lng).toBeCloseTo(center.lng, 4);
  });

  it("getLayer wires the ring's geojson into a line layer spec", () => {
    const ring = new RangeRing(center, 1000, "25%");
    const layer = ring.getLayer();
    expect(layer.type).toBe("line");
    expect(layer.source).toEqual(ring.getGeoJSON());
    expect(layer.paint["line-color"]).toBe("#e25b2a");
  });
});
