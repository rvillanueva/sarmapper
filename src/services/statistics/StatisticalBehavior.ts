import { dispersions as dispersionData } from '../../data/behaviors';

const distanceNames = ['25%', '50%', '75%', '95%'];

export interface BehaviorData {
  _id: string;
  n: number;
  hierarchy: string[];
  distances: number[];
  dispersion?: BehaviorDispersion;
}

export interface DispersionAngles {
  p25: number;
  p50: number;
  p75: number;
  p95: number;
}

export interface BehaviorDispersion {
  hierarchy?: string[];
  n?: number;
  angles: number[];
  [key: string]: unknown;
}

interface RawDispersion {
  hierarchy: string[];
  n: number;
  angles: DispersionAngles;
}

export default class Behavior {
  _id: string;
  n: number;
  hierarchy: string[];
  distances: number[];
  dispersion: BehaviorDispersion;

  constructor(data: BehaviorData) {
    this._id = data._id;
    this.n = data.n;
    this.hierarchy = data.hierarchy;
    this.distances = data.distances;
    this.dispersion = this.getDispersion();
  }
  getDispersion(): BehaviorDispersion {
    function filterUsingHierarchy(
      dispersions: RawDispersion[],
      remainingHierarchy: string[],
    ): RawDispersion {
      if (dispersions.length === 1) return dispersions[0];
      const filtered = dispersions.filter(
        dispersion => dispersion.hierarchy[0] === remainingHierarchy[0],
      );
      if (filtered.length === 1) return filtered[0];
      if (filtered.length === 0 || remainingHierarchy.length === 1) return dispersions[0];
      return filterUsingHierarchy(filtered, remainingHierarchy.slice(1));
    }
    const dispersion = filterUsingHierarchy(dispersionData as RawDispersion[], this.hierarchy);
    return {
      ...dispersion,
      angles: [dispersion.angles.p25, dispersion.angles.p50, dispersion.angles.p75, dispersion.angles.p95],
    };
  }
  getName() {
    return `${this._id}`;
  }
  getDistanceProbabilities() {
    return this.distances.map((distance, d) => ({ label: distanceNames[d], value: distance }));
  }
  toJSON() {
    return Object.assign({}, this);
  }
}
