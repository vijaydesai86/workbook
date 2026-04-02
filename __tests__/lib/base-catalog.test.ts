import { describe, expect, it } from "vitest";
import { baseCatalog } from "@/lib/base-catalog";

describe("baseCatalog", () => {
  it("has exactly 2 activities", () => {
    expect(baseCatalog.activities).toHaveLength(2);
  });

  it("has an updatedAt timestamp", () => {
    expect(baseCatalog.updatedAt).toBeTruthy();
    expect(new Date(baseCatalog.updatedAt).getTime()).not.toBeNaN();
  });

  it("contains alphabet-cards activity", () => {
    const alphabet = baseCatalog.activities.find((a) => a.id === "alphabet-cards");
    expect(alphabet).toBeDefined();
    expect(alphabet?.title).toBe("Alphabet Cards");
    expect(alphabet?.category).toBe("Letter learning");
  });

  it("contains counting-cards activity", () => {
    const counting = baseCatalog.activities.find((a) => a.id === "counting-cards");
    expect(counting).toBeDefined();
    expect(counting?.title).toBe("Counting Cards");
    expect(counting?.category).toBe("Early math");
  });

  it("alphabet-cards has exactly 5 items", () => {
    const alphabet = baseCatalog.activities.find((a) => a.id === "alphabet-cards");
    expect(alphabet?.items).toHaveLength(5);
  });

  it("counting-cards has exactly 2 items", () => {
    const counting = baseCatalog.activities.find((a) => a.id === "counting-cards");
    expect(counting?.items).toHaveLength(2);
  });

  it("all activities have required string fields", () => {
    for (const activity of baseCatalog.activities) {
      expect(activity.id).toBeTruthy();
      expect(activity.title).toBeTruthy();
      expect(activity.category).toBeTruthy();
      expect(activity.summary).toBeTruthy();
      expect(activity.goal).toBeTruthy();
      expect(activity.sessionLength).toBeTruthy();
      expect(activity.workModeNote).toBeTruthy();
      expect(activity.trainModeNote).toBeTruthy();
    }
  });

  it("all activity items have required fields", () => {
    for (const activity of baseCatalog.activities) {
      for (const item of activity.items) {
        expect(item.id).toBeTruthy();
        expect(item.title).toBeTruthy();
        expect(item.kind).toBeTruthy();
        expect(item.summary).toBeTruthy();
        expect(item.steps.length).toBeGreaterThanOrEqual(1);
        expect(item.tags.length).toBeGreaterThanOrEqual(1);
      }
    }
  });

  it("all items have exactly 3 steps each", () => {
    for (const activity of baseCatalog.activities) {
      for (const item of activity.items) {
        expect(item.steps).toHaveLength(3);
      }
    }
  });

  it("alphabet-cards item IDs are unique", () => {
    const alphabet = baseCatalog.activities.find((a) => a.id === "alphabet-cards")!;
    const ids = alphabet.items.map((i) => i.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it("counting-cards item IDs are unique", () => {
    const counting = baseCatalog.activities.find((a) => a.id === "counting-cards")!;
    const ids = counting.items.map((i) => i.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it("all activity IDs are unique", () => {
    const ids = baseCatalog.activities.map((a) => a.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it("alphabet-cards items cover the full alphabet in groups", () => {
    const alphabet = baseCatalog.activities.find((a) => a.id === "alphabet-cards")!;
    const itemIds = alphabet.items.map((i) => i.id);
    expect(itemIds).toContain("alphabet-a-f");
    expect(itemIds).toContain("alphabet-g-l");
    expect(itemIds).toContain("alphabet-m-r");
    expect(itemIds).toContain("alphabet-s-x");
    expect(itemIds).toContain("alphabet-y-z");
  });

  it("counting-cards items cover 1-10 and 11-20", () => {
    const counting = baseCatalog.activities.find((a) => a.id === "counting-cards")!;
    const itemIds = counting.items.map((i) => i.id);
    expect(itemIds).toContain("count-1-10");
    expect(itemIds).toContain("count-11-20");
  });
});
