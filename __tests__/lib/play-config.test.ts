import { describe, expect, it } from "vitest";
import { baseCatalog } from "@/lib/base-catalog";
import {
  applyImageOverrides,
  getCountingSetId,
  getPlayConfigForActivity,
  getPlayModule
} from "@/lib/play-config";

const alphabetActivity = baseCatalog.activities.find((a) => a.id === "alphabet-cards")!;
const countingActivity = baseCatalog.activities.find((a) => a.id === "counting-cards")!;

describe("getCountingSetId", () => {
  it("returns 'mixed' when 'mixed' is passed", () => {
    expect(getCountingSetId("mixed")).toBe("mixed");
  });

  it("returns 'apples' when 'apples' is passed", () => {
    expect(getCountingSetId("apples")).toBe("apples");
  });

  it("returns 'apples' when undefined is passed", () => {
    expect(getCountingSetId(undefined)).toBe("apples");
  });

  it("returns 'apples' when null is passed", () => {
    expect(getCountingSetId(null)).toBe("apples");
  });

  it("returns 'apples' for any unknown value", () => {
    expect(getCountingSetId("random")).toBe("apples");
  });
});

describe("getPlayConfigForActivity - alphabet", () => {
  const config = getPlayConfigForActivity(alphabetActivity);

  it("returns config with correct coverLabel", () => {
    expect(config.coverLabel).toBe("Alphabet Cards");
  });

  it("returns config with one module", () => {
    expect(config.modules).toHaveLength(1);
  });

  it("the alphabet module has exactly 26 cards", () => {
    expect(config.modules[0]?.cards).toHaveLength(26);
  });

  it("cards have correct IDs (alphabet-a through alphabet-z)", () => {
    const cards = config.modules[0]?.cards ?? [];
    expect(cards[0]?.id).toBe("alphabet-a");
    expect(cards[25]?.id).toBe("alphabet-z");
  });

  it("each card has required fields", () => {
    const cards = config.modules[0]?.cards ?? [];
    for (const card of cards) {
      expect(card.id).toBeTruthy();
      expect(card.title).toBeTruthy();
      expect(card.prompt).toBeTruthy();
      expect(card.focus).toBeTruthy();
      expect(card.cue).toBeTruthy();
      expect(card.example).toBeTruthy();
      expect(card.art).toBeDefined();
    }
  });

  it("each card has kind 'alphabet'", () => {
    const cards = config.modules[0]?.cards ?? [];
    for (const card of cards) {
      expect(card.art.kind).toBe("alphabet");
    }
  });

  it("each card has an imageSrc pointing to a valid path", () => {
    const cards = config.modules[0]?.cards ?? [];
    for (const card of cards) {
      expect(card.art.imageSrc).toMatch(/^\/cards\/alphabet\/.+\.jpg$/);
    }
  });

  it("L card uses lily.jpg (not leaf.jpg)", () => {
    const cards = config.modules[0]?.cards ?? [];
    const lCard = cards.find((c) => c.id === "alphabet-l");
    expect(lCard?.art.imageSrc).toBe("/cards/alphabet/lily.jpg");
  });

  it("L card is titled 'L for Lily'", () => {
    const cards = config.modules[0]?.cards ?? [];
    const lCard = cards.find((c) => c.id === "alphabet-l");
    expect(lCard?.title).toBe("L for Lily");
  });

  it("cards are in alphabetical order A-Z", () => {
    const cards = config.modules[0]?.cards ?? [];
    const letters = cards.map((c) => c.art.trail);
    expect(letters[0]).toBe("A");
    expect(letters[12]).toBe("M");
    expect(letters[25]).toBe("Z");
  });

  it("theme has required color fields", () => {
    expect(config.theme.primary).toBeTruthy();
    expect(config.theme.secondary).toBeTruthy();
    expect(config.theme.surface).toBeTruthy();
    expect(config.theme.ink).toBeTruthy();
    expect(config.theme.badge).toBeTruthy();
  });

  it("module has skills array", () => {
    const module = config.modules[0]!;
    expect(module.skills.length).toBeGreaterThan(0);
  });

  it("module has calmNote", () => {
    const module = config.modules[0]!;
    expect(module.calmNote).toBeTruthy();
  });

  it("defaultModuleId matches a real module", () => {
    const found = config.modules.find((m) => m.id === config.defaultModuleId);
    expect(found).toBeDefined();
  });
});

describe("getPlayConfigForActivity - counting (apples)", () => {
  const config = getPlayConfigForActivity(countingActivity, { countingSet: "apples" });

  it("returns config with correct coverLabel", () => {
    expect(config.coverLabel).toBe("Counting Cards");
  });

  it("returns config with exactly 2 modules", () => {
    expect(config.modules).toHaveLength(2);
  });

  it("first module covers 1-10 with 10 cards", () => {
    const mod = config.modules.find((m) => m.id === "count_1_10");
    expect(mod).toBeDefined();
    expect(mod?.cards).toHaveLength(10);
  });

  it("second module covers 11-20 with 10 cards", () => {
    const mod = config.modules.find((m) => m.id === "count_11_20");
    expect(mod).toBeDefined();
    expect(mod?.cards).toHaveLength(10);
  });

  it("apple cards all use apple image", () => {
    for (const mod of config.modules) {
      for (const card of mod.cards) {
        expect(card.art.imageSrc).toBe("/cards/alphabet/apple.jpg");
      }
    }
  });

  it("each card has kind 'count'", () => {
    for (const mod of config.modules) {
      for (const card of mod.cards) {
        expect(card.art.kind).toBe("count");
      }
    }
  });

  it("cards have count values", () => {
    const firstMod = config.modules.find((m) => m.id === "count_1_10")!;
    for (let i = 0; i < firstMod.cards.length; i++) {
      expect(firstMod.cards[i]?.art.count).toBe(i + 1);
    }
  });
});

describe("getPlayConfigForActivity - counting (mixed)", () => {
  const config = getPlayConfigForActivity(countingActivity, { countingSet: "mixed" });

  it("returns config with 2 modules", () => {
    expect(config.modules).toHaveLength(2);
  });

  it("mixed cards use different images", () => {
    const firstMod = config.modules.find((m) => m.id === "count_1_10")!;
    const imageSrcs = firstMod.cards.map((c) => c.art.imageSrc);
    const uniqueImages = new Set(imageSrcs);
    expect(uniqueImages.size).toBeGreaterThan(1);
  });

  it("card 18 (flowers) uses lily.jpg", () => {
    const secondMod = config.modules.find((m) => m.id === "count_11_20")!;
    const card18 = secondMod.cards.find((c) => c.art.count === 18);
    expect(card18?.art.imageSrc).toBe("/cards/alphabet/lily.jpg");
  });

  it("all cards have a count value matching their position", () => {
    const firstMod = config.modules.find((m) => m.id === "count_1_10")!;
    for (let i = 0; i < firstMod.cards.length; i++) {
      expect(firstMod.cards[i]?.art.count).toBe(i + 1);
    }
    const secondMod = config.modules.find((m) => m.id === "count_11_20")!;
    for (let i = 0; i < secondMod.cards.length; i++) {
      expect(secondMod.cards[i]?.art.count).toBe(i + 11);
    }
  });
});

describe("getPlayConfigForActivity - fallback for custom activity", () => {
  const customActivity = {
    id: "custom-activity",
    title: "Custom Activity",
    category: "Custom",
    summary: "A custom activity for testing.",
    goal: "Test the fallback config.",
    sessionLength: "5 min",
    workModeNote: "Work note.",
    trainModeNote: "Train note.",
    items: [
      {
        id: "item-1",
        title: "Item One",
        kind: "exercise" as const,
        summary: "First item.",
        steps: ["Step A", "Step B", "Step C"],
        tags: ["test", "custom"]
      },
      {
        id: "item-2",
        title: "Item Two",
        kind: "support" as const,
        summary: "Second item.",
        steps: ["Step X", "Step Y", "Step Z"],
        tags: ["support", "custom"]
      }
    ]
  };

  const config = getPlayConfigForActivity(customActivity);

  it("creates a fallback config with guided_practice module", () => {
    const mod = config.modules.find((m) => m.id === "guided_practice");
    expect(mod).toBeDefined();
  });

  it("fallback creates one card per item", () => {
    const mod = config.modules.find((m) => m.id === "guided_practice")!;
    expect(mod.cards).toHaveLength(2);
  });

  it("fallback cards use the item title as card title", () => {
    const mod = config.modules.find((m) => m.id === "guided_practice")!;
    expect(mod.cards[0]?.title).toBe("Item One");
    expect(mod.cards[1]?.title).toBe("Item Two");
  });

  it("fallback uses activity title as coverLabel", () => {
    expect(config.coverLabel).toBe("Custom Activity");
  });
});

describe("getPlayModule", () => {
  const config = getPlayConfigForActivity(alphabetActivity);

  it("returns the module matching the requested ID", () => {
    const mod = getPlayModule(config, "alphabet_deck");
    expect(mod?.id).toBe("alphabet_deck");
  });

  it("returns the default module when no ID is given", () => {
    const mod = getPlayModule(config, null);
    expect(mod?.id).toBe(config.defaultModuleId);
  });

  it("returns the default module when undefined is given", () => {
    const mod = getPlayModule(config, undefined);
    expect(mod?.id).toBe(config.defaultModuleId);
  });

  it("returns the default module when an invalid ID is given", () => {
    const mod = getPlayModule(config, "nonexistent-module");
    expect(mod?.id).toBe(config.defaultModuleId);
  });

  it("returns first module as fallback when defaultModuleId is invalid", () => {
    const brokenConfig = { ...config, defaultModuleId: "invalid" };
    const mod = getPlayModule(brokenConfig, null);
    expect(mod?.id).toBe(config.modules[0]?.id);
  });
});

describe("applyImageOverrides", () => {
  const config = getPlayConfigForActivity(
    baseCatalog.activities.find((a) => a.id === "alphabet-cards")!
  );

  it("returns the same config reference when overrides is empty", () => {
    const result = applyImageOverrides(config, []);
    expect(result).toBe(config);
  });

  it("replaces imageSrc for a matching card", () => {
    const result = applyImageOverrides(config, [
      { cardId: "alphabet-a", imageSrc: "/custom/new-apple.jpg", imageAlt: "A shiny apple" }
    ]);
    const aCard = result.modules[0]?.cards.find((c) => c.id === "alphabet-a");
    expect(aCard?.art.imageSrc).toBe("/custom/new-apple.jpg");
  });

  it("replaces imageAlt for a matching card", () => {
    const result = applyImageOverrides(config, [
      { cardId: "alphabet-a", imageSrc: "/custom/new-apple.jpg", imageAlt: "A shiny apple" }
    ]);
    const aCard = result.modules[0]?.cards.find((c) => c.id === "alphabet-a");
    expect(aCard?.art.imageAlt).toBe("A shiny apple");
  });

  it("leaves other cards unchanged", () => {
    const original = config.modules[0]?.cards.find((c) => c.id === "alphabet-b");
    const result = applyImageOverrides(config, [
      { cardId: "alphabet-a", imageSrc: "/custom/new-apple.jpg", imageAlt: "A shiny apple" }
    ]);
    const bCard = result.modules[0]?.cards.find((c) => c.id === "alphabet-b");
    expect(bCard?.art.imageSrc).toBe(original?.art.imageSrc);
  });

  it("applies multiple overrides independently", () => {
    const result = applyImageOverrides(config, [
      { cardId: "alphabet-a", imageSrc: "/custom/apple2.jpg", imageAlt: "Apple 2" },
      { cardId: "alphabet-b", imageSrc: "/custom/ball2.jpg", imageAlt: "Ball 2" }
    ]);
    expect(result.modules[0]?.cards.find((c) => c.id === "alphabet-a")?.art.imageSrc).toBe("/custom/apple2.jpg");
    expect(result.modules[0]?.cards.find((c) => c.id === "alphabet-b")?.art.imageSrc).toBe("/custom/ball2.jpg");
  });

  it("ignores overrides for unknown card IDs", () => {
    const result = applyImageOverrides(config, [
      { cardId: "nonexistent-card", imageSrc: "/custom/x.jpg", imageAlt: "X" }
    ]);
    expect(result.modules[0]?.cards[0]?.art.imageSrc).toBe(config.modules[0]?.cards[0]?.art.imageSrc);
  });

  it("preserves other art fields on overridden card", () => {
    const original = config.modules[0]?.cards.find((c) => c.id === "alphabet-a");
    const result = applyImageOverrides(config, [
      { cardId: "alphabet-a", imageSrc: "/custom/new.jpg", imageAlt: "New" }
    ]);
    const aCard = result.modules[0]?.cards.find((c) => c.id === "alphabet-a");
    expect(aCard?.art.kind).toBe(original?.art.kind);
    expect(aCard?.art.lead).toBe(original?.art.lead);
    expect(aCard?.art.trail).toBe(original?.art.trail);
  });

  it("does not mutate the original config", () => {
    const originalSrc = config.modules[0]?.cards.find((c) => c.id === "alphabet-a")?.art.imageSrc;
    applyImageOverrides(config, [
      { cardId: "alphabet-a", imageSrc: "/custom/mutated.jpg", imageAlt: "Mutated" }
    ]);
    const stillOriginal = config.modules[0]?.cards.find((c) => c.id === "alphabet-a")?.art.imageSrc;
    expect(stillOriginal).toBe(originalSrc);
  });
});
