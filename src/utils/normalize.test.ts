import { describe, it, expect } from "vitest";
import {
  initializeNormalState,
  initializeNormalStateWithCounter,
  mergeItems,
  removeItem,
  toArray,
  denormalize,
  removeDenormalized,
  removeMatchingValuesByKey,
} from "./normalize";

describe("initializeNormalState", () => {
  it("returns an empty {allIds, byId} container", () => {
    expect(initializeNormalState()).toEqual({ allIds: [], byId: {} });
  });

  it("initializeNormalStateWithCounter seeds counter at 0", () => {
    expect(initializeNormalStateWithCounter()).toEqual({
      allIds: [],
      byId: {},
      counter: 0,
    });
  });
});

describe("mergeItems", () => {
  it("appends new items to the end by default", () => {
    const state = initializeNormalState();
    const next = mergeItems(state, [{ _id: "a" }, { _id: "b" }], {});
    expect(next.allIds).toEqual(["a", "b"]);
    expect(next.byId.a._id).toBe("a");
    expect(next.byId.b._id).toBe("b");
  });

  it("inserts at the start when insertAt='start'", () => {
    let state = mergeItems(initializeNormalState(), [{ _id: "a" }], {});
    state = mergeItems(state, [{ _id: "b" }], { insertAt: "start" });
    expect(state.allIds).toEqual(["b", "a"]);
  });

  it("merges into an existing item by default (overwrite=true)", () => {
    let state = mergeItems(initializeNormalState(), [{ _id: "a", x: 1 }], {});
    state = mergeItems(state, [{ _id: "a", y: 2 }], {});
    expect(state.allIds).toEqual(["a"]);
    expect(state.byId.a).toMatchObject({ _id: "a", x: 1, y: 2 });
  });

  it("replaces an existing item when overwrite=false", () => {
    let state = mergeItems(initializeNormalState(), [{ _id: "a", x: 1 }], {});
    state = mergeItems(state, [{ _id: "a", y: 2 }], { overwrite: false });
    expect(state.byId.a).toEqual({ _id: "a", y: 2 });
  });

  it("auto-assigns ids from the counter when item has no _id", () => {
    let state = initializeNormalStateWithCounter();
    state = mergeItems(state, [{ name: "first" }, { name: "second" }], {});
    expect(state.allIds).toEqual(["0", "1"]);
    expect(state.counter).toBe(2);
    expect(state.byId["0"].name).toBe("first");
    expect(state.byId["1"].name).toBe("second");
  });

  it("populates configured indexes", () => {
    const state = mergeItems(
      { ...initializeNormalState(), byKind: {} } as any,
      [
        { _id: "a", kind: "x" },
        { _id: "b", kind: "x" },
        { _id: "c", kind: "y" },
      ],
      { indexes: [{ name: "byKind", field: "kind" }] },
    );
    expect((state as any).byKind.x).toEqual(["a", "b"]);
    expect((state as any).byKind.y).toEqual(["c"]);
  });
});

describe("removeItem", () => {
  it("drops the id from allIds and byId", () => {
    const state = mergeItems(initializeNormalState(), [{ _id: "a" }, { _id: "b" }], {});
    const next = removeItem(state, "a", {});
    expect(next.allIds).toEqual(["b"]);
    expect(next.byId.a).toBeUndefined();
  });

  it("returns the same state when the id does not exist", () => {
    const state = mergeItems(initializeNormalState(), [{ _id: "a" }], {});
    const next = removeItem(state, "missing", {});
    expect(next).toBe(state);
  });

  it("removes the id from configured indexes", () => {
    const state = mergeItems(
      { ...initializeNormalState(), byKind: {} } as any,
      [
        { _id: "a", kind: "x" },
        { _id: "b", kind: "x" },
      ],
      { indexes: [{ name: "byKind", field: "kind" }] },
    );
    const next = removeItem(state, "a", {
      indexes: [{ name: "byKind", field: "kind" }],
    });
    expect((next as any).byKind.x).toEqual(["b"]);
  });
});

describe("toArray", () => {
  it("returns items in allIds order", () => {
    const state = mergeItems(
      initializeNormalState(),
      [{ _id: "a", n: 1 }, { _id: "b", n: 2 }],
      {},
    );
    expect(toArray(state)).toEqual([
      { _id: "a", n: 1 },
      { _id: "b", n: 2 },
    ]);
  });
});

describe("denormalize", () => {
  it("extracts nested objects and drops items missing the key", () => {
    const items = [
      { _id: "a", child: { _id: "c1" } },
      { _id: "b" },
      { _id: "c", child: { _id: "c2" } },
    ];
    expect(denormalize(items, "child")).toEqual([{ _id: "c1" }, { _id: "c2" }]);
  });
});

describe("removeDenormalized", () => {
  it("replaces nested objects with `${key}Id` references by default", () => {
    const items = [{ _id: "a", child: { _id: "c1" } }];
    const result = removeDenormalized(items, ["child"]);
    expect(result).toEqual([{ _id: "a", childId: "c1" }]);
  });

  it("supports custom objectKey/idKey pairings", () => {
    const items = [{ _id: "a", parent: { _id: "p1" } }];
    const result = removeDenormalized(items, [
      { objectKey: "parent", idKey: "parentRef" },
    ]);
    expect(result).toEqual([{ _id: "a", parentRef: "p1" }]);
  });
});

describe("removeMatchingValuesByKey", () => {
  it("nulls out matching values without removing the items", () => {
    const state = mergeItems(
      initializeNormalState(),
      [
        { _id: "a", parentId: "p" },
        { _id: "b", parentId: "q" },
        { _id: "c", parentId: "p" },
      ],
      {},
    );
    const next = removeMatchingValuesByKey(state, "parentId", "p");
    expect(next.byId.a.parentId).toBeNull();
    expect(next.byId.b.parentId).toBe("q");
    expect(next.byId.c.parentId).toBeNull();
    expect(next.allIds).toEqual(["a", "b", "c"]);
  });
});
