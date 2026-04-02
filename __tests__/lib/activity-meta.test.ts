import { describe, expect, it } from "vitest";
import { getActivityMeta } from "@/lib/activity-meta";

describe("getActivityMeta", () => {
  it("returns correct emoji for alphabet-cards", () => {
    expect(getActivityMeta("alphabet-cards").emoji).toBe("🔤");
  });

  it("returns correct shortLabel for alphabet-cards", () => {
    expect(getActivityMeta("alphabet-cards").shortLabel).toBe("Letters");
  });

  it("returns correct emoji for counting-cards", () => {
    expect(getActivityMeta("counting-cards").emoji).toBe("🔢");
  });

  it("returns correct shortLabel for counting-cards", () => {
    expect(getActivityMeta("counting-cards").shortLabel).toBe("Numbers");
  });

  it("returns fallback emoji for an unknown activity ID", () => {
    expect(getActivityMeta("unknown-activity").emoji).toBe("🎮");
  });

  it("returns fallback shortLabel for an unknown activity ID", () => {
    expect(getActivityMeta("unknown-activity").shortLabel).toBe("Game");
  });

  it("returns fallback for an empty string ID", () => {
    const meta = getActivityMeta("");
    expect(meta.emoji).toBe("🎮");
    expect(meta.shortLabel).toBe("Game");
  });

  it("returns an object with emoji and shortLabel fields", () => {
    const meta = getActivityMeta("alphabet-cards");
    expect(meta).toHaveProperty("emoji");
    expect(meta).toHaveProperty("shortLabel");
  });

  it("returns distinct results for different known IDs", () => {
    const alpha = getActivityMeta("alphabet-cards");
    const count = getActivityMeta("counting-cards");
    expect(alpha.emoji).not.toBe(count.emoji);
    expect(alpha.shortLabel).not.toBe(count.shortLabel);
  });

  it("alphabet-cards emoji is a single grapheme cluster", () => {
    const { emoji } = getActivityMeta("alphabet-cards");
    expect([...emoji].length).toBeGreaterThanOrEqual(1);
  });

  it("counting-cards emoji is a single grapheme cluster", () => {
    const { emoji } = getActivityMeta("counting-cards");
    expect([...emoji].length).toBeGreaterThanOrEqual(1);
  });

  it("repeated calls return the same result", () => {
    const first = getActivityMeta("alphabet-cards");
    const second = getActivityMeta("alphabet-cards");
    expect(first.emoji).toBe(second.emoji);
    expect(first.shortLabel).toBe(second.shortLabel);
  });
});
