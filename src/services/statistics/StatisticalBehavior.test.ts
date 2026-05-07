import { describe, it, expect } from "vitest";
import StatisticalBehavior from "./StatisticalBehavior";

const baseBehavior = {
  _id: "hiker__temperate__mtn",
  n: 100,
  hierarchy: ["hiker", "temperate", "mtn"],
  distances: [0.3, 1.5, 5.5, 9.9],
};

describe("StatisticalBehavior", () => {
  it("copies fields from the input data", () => {
    const b = new StatisticalBehavior(baseBehavior);
    expect(b._id).toBe(baseBehavior._id);
    expect(b.n).toBe(baseBehavior.n);
    expect(b.hierarchy).toEqual(baseBehavior.hierarchy);
    expect(b.distances).toEqual(baseBehavior.distances);
  });

  it("getDistanceProbabilities pairs each distance with its quantile label", () => {
    const b = new StatisticalBehavior(baseBehavior);
    expect(b.getDistanceProbabilities()).toEqual([
      { label: "25%", value: 0.3 },
      { label: "50%", value: 1.5 },
      { label: "75%", value: 5.5 },
      { label: "95%", value: 9.9 },
    ]);
  });

  it("getDispersion flattens p25/p50/p75/p95 into a sorted angles array", () => {
    const b = new StatisticalBehavior(baseBehavior);
    const { angles } = b.getDispersion();
    expect(angles).toHaveLength(4);
    // Angles are stored as quantiles, so they must be non-decreasing.
    for (let i = 1; i < angles.length; i++) {
      expect(angles[i]).toBeGreaterThanOrEqual(angles[i - 1]);
    }
    angles.forEach((angle) => {
      expect(typeof angle).toBe("number");
      expect(angle).toBeGreaterThanOrEqual(0);
      expect(angle).toBeLessThanOrEqual(180);
    });
  });

  it("falls back to the default dispersion when the hierarchy is unknown", () => {
    const unknown = new StatisticalBehavior({
      ...baseBehavior,
      _id: "unknown",
      hierarchy: ["doesnotexist", "neither", "nope"],
    });
    // Default dispersion is the first entry: {p25:10, p50:30, p75:78, p95:144}.
    expect(unknown.getDispersion().angles).toEqual([10, 30, 78, 144]);
  });

  it("getName returns the _id", () => {
    const b = new StatisticalBehavior(baseBehavior);
    expect(b.getName()).toBe(baseBehavior._id);
  });

  it("toJSON includes the public fields", () => {
    const b = new StatisticalBehavior(baseBehavior);
    const json = b.toJSON();
    expect(json._id).toBe(baseBehavior._id);
    expect(json.distances).toEqual(baseBehavior.distances);
    expect(Array.isArray(json.dispersion.angles)).toBe(true);
  });
});
