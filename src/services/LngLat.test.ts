import { describe, it, expect } from "vitest";
import LngLat from "./LngLat";

describe("LngLat", () => {
  it("constructs from a {lng, lat} object", () => {
    const p = new LngLat({ lng: -122.4194, lat: 37.7749 });
    expect(p.lng).toBe(-122.4194);
    expect(p.lat).toBe(37.7749);
  });

  it("constructs from a [lng, lat] tuple", () => {
    const p = new LngLat([-122.4194, 37.7749]);
    expect(p.lng).toBe(-122.4194);
    expect(p.lat).toBe(37.7749);
  });

  it("constructs from another LngLat instance", () => {
    const a = new LngLat({ lng: 10, lat: 20 });
    const b = new LngLat(a);
    expect(b.lng).toBe(10);
    expect(b.lat).toBe(20);
  });

  it("toJSON returns a {lat, lng} object", () => {
    const p = new LngLat({ lng: 1, lat: 2 });
    expect(p.toJSON()).toEqual({ lat: 2, lng: 1 });
  });

  describe("moveTo", () => {
    it("returns a new LngLat without mutating the original", () => {
      const start = new LngLat({ lng: 0, lat: 0 });
      const moved = start.moveTo(0, 1000);
      expect(moved).not.toBe(start);
      expect(start.lng).toBe(0);
      expect(start.lat).toBe(0);
    });

    it("moves north (bearing 0) increases latitude", () => {
      const moved = new LngLat({ lng: 0, lat: 0 }).moveTo(0, 1000);
      expect(moved.lat).toBeGreaterThan(0);
      expect(moved.lng).toBeCloseTo(0, 6);
    });

    it("moves east (bearing 90) increases longitude", () => {
      const moved = new LngLat({ lng: 0, lat: 0 }).moveTo(90, 1000);
      expect(moved.lng).toBeGreaterThan(0);
      // Latitude moves negligibly when traveling due east at the equator.
      expect(Math.abs(moved.lat)).toBeLessThan(1e-3);
    });

    it("a 1km step at the equator is roughly 0.009 degrees", () => {
      const moved = new LngLat({ lng: 0, lat: 0 }).moveTo(0, 1000);
      expect(moved.lat).toBeGreaterThan(0.008);
      expect(moved.lat).toBeLessThan(0.010);
    });
  });

  describe("getBearingTo", () => {
    // Note: getBearingTo returns the rhumb bearing FROM the argument TO `this`
    // (the inverse of what the name might suggest). Callers like
    // createDispersionLinesLayer rely on `destination.getBearingTo(ipp)`
    // yielding the bearing pointing from ipp toward destination.
    it("when the argument is south of `this`, bearing is 0 (north)", () => {
      const self = new LngLat({ lng: 0, lat: 1 });
      const other = new LngLat({ lng: 0, lat: 0 });
      expect(self.getBearingTo(other)).toBeCloseTo(0, 5);
    });

    it("when the argument is west of `this`, bearing is 90 (east)", () => {
      const self = new LngLat({ lng: 1, lat: 0 });
      const other = new LngLat({ lng: 0, lat: 0 });
      expect(self.getBearingTo(other)).toBeCloseTo(90, 5);
    });

    it("accepts plain object and tuple inputs", () => {
      const self = new LngLat({ lng: 0, lat: 1 });
      expect(self.getBearingTo({ lng: 0, lat: 0 })).toBeCloseTo(0, 5);
      expect(new LngLat({ lng: 1, lat: 0 }).getBearingTo([0, 0])).toBeCloseTo(
        90,
        5,
      );
    });
  });

  it("moveTo and getBearingTo are inverses (moved.getBearingTo(start) == bearing from start to moved)", () => {
    const start = new LngLat({ lng: -122.4194, lat: 37.7749 });
    const moved = start.moveTo(45, 5000);
    expect(moved.getBearingTo(start)).toBeCloseTo(45, 0);
  });
});
