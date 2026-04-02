import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { baseCatalog } from "@/lib/base-catalog";

// Mock supabase so catalog-store falls back to file operations
vi.mock("@/lib/supabase-admin", () => ({
  getSupabaseAdminClient: () => null
}));

// Mock node:fs/promises for isolated file system operations
vi.mock("node:fs/promises", () => ({
  mkdir: vi.fn().mockResolvedValue(undefined),
  readFile: vi.fn(),
  writeFile: vi.fn().mockResolvedValue(undefined)
}));

import { readFile, writeFile } from "node:fs/promises";
import { applyTrainingProposal, getActivityById, getMergedCatalog } from "@/lib/catalog-store";

const emptyCustomizations = JSON.stringify({
  addedActivities: [],
  addedItems: [],
  history: []
});

beforeEach(() => {
  vi.mocked(readFile).mockResolvedValue(emptyCustomizations as never);
  vi.mocked(writeFile).mockResolvedValue(undefined as never);
});

afterEach(() => {
  vi.clearAllMocks();
});

describe("getMergedCatalog", () => {
  it("returns base catalog activities when no customizations", async () => {
    const catalog = await getMergedCatalog();
    expect(catalog.activities.length).toBe(baseCatalog.activities.length);
  });

  it("includes alphabet-cards", async () => {
    const catalog = await getMergedCatalog();
    const found = catalog.activities.find((a) => a.id === "alphabet-cards");
    expect(found).toBeDefined();
  });

  it("includes counting-cards", async () => {
    const catalog = await getMergedCatalog();
    const found = catalog.activities.find((a) => a.id === "counting-cards");
    expect(found).toBeDefined();
  });

  it("returns a catalog with a valid updatedAt timestamp", async () => {
    const catalog = await getMergedCatalog();
    expect(catalog.updatedAt).toBeTruthy();
    expect(new Date(catalog.updatedAt).getTime()).not.toBeNaN();
  });

  it("returns activities sorted alphabetically by title", async () => {
    const catalog = await getMergedCatalog();
    const titles = catalog.activities.map((a) => a.title);
    const sorted = [...titles].sort((a, b) => a.localeCompare(b));
    expect(titles).toEqual(sorted);
  });

  it("merges a customized added activity", async () => {
    const customizations = JSON.stringify({
      addedActivities: [
        {
          id: "color-cards",
          title: "Color Cards",
          category: "Early learning",
          summary: "Color practice.",
          goal: "Recognize colors.",
          sessionLength: "8 min",
          workModeNote: "Fixed.",
          trainModeNote: "Can extend.",
          items: [
            {
              id: "red-card",
              title: "Red Card",
              kind: "exercise",
              summary: "Red card.",
              steps: ["Show", "Say", "Repeat"],
              tags: ["colors"]
            }
          ]
        }
      ],
      addedItems: [],
      history: []
    });

    vi.mocked(readFile).mockResolvedValue(customizations as never);

    const catalog = await getMergedCatalog();
    const colorCards = catalog.activities.find((a) => a.id === "color-cards");
    expect(colorCards).toBeDefined();
    expect(colorCards?.title).toBe("Color Cards");
  });

  it("merges added items into an existing activity", async () => {
    const customizations = JSON.stringify({
      addedActivities: [],
      addedItems: [
        {
          activityId: "alphabet-cards",
          items: [
            {
              id: "animal-pack",
              title: "Animal Pack",
              kind: "prompt-pack",
              summary: "Animal pack.",
              steps: ["Show", "Say", "Repeat"],
              tags: ["animals"]
            }
          ]
        }
      ],
      history: []
    });

    vi.mocked(readFile).mockResolvedValue(customizations as never);

    const catalog = await getMergedCatalog();
    const alphabet = catalog.activities.find((a) => a.id === "alphabet-cards");
    expect(alphabet).toBeDefined();
    const animalPack = alphabet?.items.find((i) => i.id === "animal-pack");
    expect(animalPack).toBeDefined();
  });

  it("skips addedItems for unknown activity IDs", async () => {
    const customizations = JSON.stringify({
      addedActivities: [],
      addedItems: [
        {
          activityId: "nonexistent-activity",
          items: [
            {
              id: "ghost-item",
              title: "Ghost Item",
              kind: "exercise",
              summary: "Ghost.",
              steps: ["Step 1"],
              tags: ["ghost"]
            }
          ]
        }
      ],
      history: []
    });

    vi.mocked(readFile).mockResolvedValue(customizations as never);

    const catalog = await getMergedCatalog();
    const base = baseCatalog.activities.length;
    expect(catalog.activities.length).toBe(base);
  });

  it("deduplicates items when same item is added twice", async () => {
    const customizations = JSON.stringify({
      addedActivities: [],
      addedItems: [
        {
          activityId: "alphabet-cards",
          items: [
            {
              id: "dupe-item",
              title: "Dupe Item",
              kind: "exercise",
              summary: "Duplicate.",
              steps: ["Step 1"],
              tags: ["dupe"]
            },
            {
              id: "dupe-item",
              title: "Dupe Item",
              kind: "exercise",
              summary: "Duplicate.",
              steps: ["Step 1"],
              tags: ["dupe"]
            }
          ]
        }
      ],
      history: []
    });

    vi.mocked(readFile).mockResolvedValue(customizations as never);

    const catalog = await getMergedCatalog();
    const alphabet = catalog.activities.find((a) => a.id === "alphabet-cards");
    const dupeItems = alphabet?.items.filter((i) => i.id === "dupe-item");
    expect(dupeItems?.length).toBe(1);
  });
});

describe("getActivityById", () => {
  it("returns the correct activity for a known ID", async () => {
    const activity = await getActivityById("alphabet-cards");
    expect(activity).toBeDefined();
    expect(activity?.id).toBe("alphabet-cards");
  });

  it("returns null for an unknown ID", async () => {
    const activity = await getActivityById("nonexistent");
    expect(activity).toBeNull();
  });

  it("returns counting-cards activity", async () => {
    const activity = await getActivityById("counting-cards");
    expect(activity).toBeDefined();
    expect(activity?.title).toBe("Counting Cards");
  });
});

describe("applyTrainingProposal - add-items", () => {
  it("writes updated customizations with new items", async () => {
    const proposal = {
      headline: "Add Animal Pack",
      reasoning: "More variety for learners.",
      changes: [
        {
          type: "add-items" as const,
          activityId: "alphabet-cards",
          activityTitle: "Alphabet Cards",
          items: [
            {
              id: "animal-pack",
              title: "Animal Pack",
              kind: "prompt-pack" as const,
              summary: "Animal-themed cards.",
              steps: ["Show card", "Say letter", "Say animal"],
              tags: ["alphabet", "animals"]
            }
          ]
        }
      ],
      notes: []
    };

    await applyTrainingProposal(proposal);

    expect(vi.mocked(writeFile)).toHaveBeenCalledOnce();
    const written = JSON.parse(vi.mocked(writeFile).mock.calls[0]![1] as string);
    const added = written.addedItems.find((e: { activityId: string }) => e.activityId === "alphabet-cards");
    expect(added).toBeDefined();
    expect(added.items[0].id).toBe("animal-pack");
  });

  it("records the proposal in history", async () => {
    const proposal = {
      headline: "Add Animal Pack",
      reasoning: "More variety.",
      changes: [
        {
          type: "add-items" as const,
          activityId: "alphabet-cards",
          activityTitle: "Alphabet Cards",
          items: [
            {
              id: "item-x",
              title: "Item X",
              kind: "exercise" as const,
              summary: "Summary.",
              steps: ["Step 1"],
              tags: ["tag"]
            }
          ]
        }
      ],
      notes: []
    };

    await applyTrainingProposal(proposal);

    const written = JSON.parse(vi.mocked(writeFile).mock.calls[0]![1] as string);
    expect(written.history.length).toBe(1);
    expect(written.history[0].headline).toBe("Add Animal Pack");
  });

  it("merges items into existing addedItems entry for same activity", async () => {
    const existingCustomizations = JSON.stringify({
      addedActivities: [],
      addedItems: [
        {
          activityId: "alphabet-cards",
          items: [
            {
              id: "existing-item",
              title: "Existing",
              kind: "exercise",
              summary: "Existing.",
              steps: ["Step 1"],
              tags: ["existing"]
            }
          ]
        }
      ],
      history: []
    });

    vi.mocked(readFile).mockResolvedValue(existingCustomizations as never);

    const proposal = {
      headline: "Add Another Pack",
      reasoning: "More variety.",
      changes: [
        {
          type: "add-items" as const,
          activityId: "alphabet-cards",
          activityTitle: "Alphabet Cards",
          items: [
            {
              id: "new-item",
              title: "New Item",
              kind: "exercise" as const,
              summary: "New.",
              steps: ["Step 1"],
              tags: ["new"]
            }
          ]
        }
      ],
      notes: []
    };

    await applyTrainingProposal(proposal);

    const written = JSON.parse(vi.mocked(writeFile).mock.calls[0]![1] as string);
    const added = written.addedItems.find((e: { activityId: string }) => e.activityId === "alphabet-cards");
    expect(added.items.length).toBe(2);
    expect(added.items.find((i: { id: string }) => i.id === "existing-item")).toBeDefined();
    expect(added.items.find((i: { id: string }) => i.id === "new-item")).toBeDefined();
  });
});

describe("applyTrainingProposal - add-activity", () => {
  it("writes updated customizations with new activity", async () => {
    const proposal = {
      headline: "Add Color Cards",
      reasoning: "Color recognition.",
      changes: [
        {
          type: "add-activity" as const,
          activity: {
            id: "color-cards",
            title: "Color Cards",
            category: "Early learning",
            summary: "Color practice.",
            goal: "Recognize colors.",
            sessionLength: "8 min",
            workModeNote: "Fixed.",
            trainModeNote: "Can extend.",
            items: [
              {
                id: "red-card",
                title: "Red Card",
                kind: "exercise" as const,
                summary: "Red.",
                steps: ["Show", "Say", "Repeat"],
                tags: ["colors"]
              }
            ]
          }
        }
      ],
      notes: []
    };

    await applyTrainingProposal(proposal);

    const written = JSON.parse(vi.mocked(writeFile).mock.calls[0]![1] as string);
    const added = written.addedActivities.find((a: { id: string }) => a.id === "color-cards");
    expect(added).toBeDefined();
    expect(added.title).toBe("Color Cards");
  });

  it("updates an existing added activity without duplicating", async () => {
    const existingCustomizations = JSON.stringify({
      addedActivities: [
        {
          id: "color-cards",
          title: "Color Cards",
          category: "Early learning",
          summary: "Color practice.",
          goal: "Recognize colors.",
          sessionLength: "8 min",
          workModeNote: "Fixed.",
          trainModeNote: "Can extend.",
          items: [
            {
              id: "red-card",
              title: "Red Card",
              kind: "exercise",
              summary: "Red.",
              steps: ["Show", "Say", "Repeat"],
              tags: ["colors"]
            }
          ]
        }
      ],
      addedItems: [],
      history: []
    });

    vi.mocked(readFile).mockResolvedValue(existingCustomizations as never);

    const proposal = {
      headline: "Extend Color Cards",
      reasoning: "More colors.",
      changes: [
        {
          type: "add-activity" as const,
          activity: {
            id: "color-cards",
            title: "Color Cards",
            category: "Early learning",
            summary: "Color practice updated.",
            goal: "Recognize more colors.",
            sessionLength: "10 min",
            workModeNote: "Fixed.",
            trainModeNote: "Can extend.",
            items: [
              {
                id: "blue-card",
                title: "Blue Card",
                kind: "exercise" as const,
                summary: "Blue.",
                steps: ["Show", "Say", "Repeat"],
                tags: ["colors"]
              }
            ]
          }
        }
      ],
      notes: []
    };

    await applyTrainingProposal(proposal);

    const written = JSON.parse(vi.mocked(writeFile).mock.calls[0]![1] as string);
    const colorActivities = written.addedActivities.filter((a: { id: string }) => a.id === "color-cards");
    expect(colorActivities.length).toBe(1);
    expect(colorActivities[0].items.length).toBe(2);
  });
});
