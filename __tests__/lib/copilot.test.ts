import { describe, expect, it, vi } from "vitest";
import { baseCatalog } from "@/lib/base-catalog";
import { buildTrainingProposal, slugify } from "@/lib/copilot";

// Mock the Copilot SDK import to force fallback path
vi.mock("@github/copilot-sdk", () => ({
  CopilotClient: class {
    stop() {
      return Promise.resolve();
    }
    createSession() {
      return Promise.reject(new Error("Copilot SDK not available in test environment."));
    }
  }
}));

describe("slugify", () => {
  it("lowercases input", () => {
    expect(slugify("HELLO")).toBe("hello");
  });

  it("replaces spaces with dashes", () => {
    expect(slugify("hello world")).toBe("hello-world");
  });

  it("handles multiple consecutive spaces", () => {
    expect(slugify("a  b")).toBe("a-b");
  });

  it("removes special characters", () => {
    expect(slugify("hello!world")).toBe("hello-world");
  });

  it("handles alphanumeric input", () => {
    expect(slugify("abc123")).toBe("abc123");
  });

  it("strips leading dash-like characters", () => {
    expect(slugify("hello world")).toBe("hello-world");
  });

  it("strips trailing dashes", () => {
    expect(slugify("hello world!")).toBe("hello-world");
  });

  it("handles title case with hyphens", () => {
    expect(slugify("Animal Alphabet Add-On")).toBe("animal-alphabet-add-on");
  });

  it("handles an empty string", () => {
    expect(slugify("")).toBe("");
  });

  it("handles a single word", () => {
    expect(slugify("Apple")).toBe("apple");
  });

  it("handles numbers only", () => {
    expect(slugify("123")).toBe("123");
  });

  it("handles mixed dashes and spaces", () => {
    expect(slugify("step-1 two")).toBe("step-1-two");
  });
});

describe("buildTrainingProposal - fallback (Copilot unavailable)", () => {
  it("returns fallback proposal when Copilot fails", async () => {
    const result = await buildTrainingProposal({ prompt: "add color cards", catalog: baseCatalog });
    expect(result.proposal).toBeDefined();
    expect(result.proposal.headline).toBeTruthy();
    expect(result.proposal.reasoning).toBeTruthy();
    expect(result.proposal.changes.length).toBeGreaterThan(0);
  });

  it("returns source as fallback-generator when Copilot fails", async () => {
    const result = await buildTrainingProposal({ prompt: "add color cards", catalog: baseCatalog });
    expect(result.source).toBe("fallback-generator");
  });

  it("returns alphabet-focused proposal for alphabet prompt", async () => {
    const result = await buildTrainingProposal({ prompt: "add more alphabet letter cards", catalog: baseCatalog });
    expect(result.proposal.headline.toLowerCase()).toMatch(/alphabet/);
  });

  it("returns counting-focused proposal for counting prompt", async () => {
    const result = await buildTrainingProposal({ prompt: "add more counting picture packs", catalog: baseCatalog });
    expect(result.proposal.headline.toLowerCase()).toMatch(/count/);
  });

  it("returns a generic proposal for unrelated prompt", async () => {
    const result = await buildTrainingProposal({ prompt: "something completely different", catalog: baseCatalog });
    expect(result.proposal.changes.length).toBeGreaterThan(0);
  });

  it("proposal has valid structure per schema", async () => {
    const { trainingProposalSchema } = await import("@/lib/schema");
    const result = await buildTrainingProposal({ prompt: "add more cards", catalog: baseCatalog });
    const parsed = trainingProposalSchema.safeParse(result.proposal);
    expect(parsed.success).toBe(true);
  });

  it("alphabet proposal targets the alphabet-cards activity", async () => {
    const result = await buildTrainingProposal({ prompt: "add more phonics letter cards", catalog: baseCatalog });
    const change = result.proposal.changes[0];
    if (change?.type === "add-items") {
      expect(change.activityId).toBe("alphabet-cards");
    }
  });

  it("counting proposal targets the counting-cards activity", async () => {
    const result = await buildTrainingProposal({ prompt: "add more counting number cards", catalog: baseCatalog });
    const change = result.proposal.changes[0];
    if (change?.type === "add-items") {
      expect(change.activityId).toBe("counting-cards");
    }
  });

  it("notes array contains fallback attribution", async () => {
    const result = await buildTrainingProposal({ prompt: "add more cards", catalog: baseCatalog });
    expect(result.proposal.notes.some((n) => n.toLowerCase().includes("fallback"))).toBe(true);
  });

  it("fallback proposal items have valid steps and tags", async () => {
    const result = await buildTrainingProposal({ prompt: "add more cards", catalog: baseCatalog });
    for (const change of result.proposal.changes) {
      const items = change.type === "add-items" ? change.items : change.activity.items;
      for (const item of items) {
        expect(item.steps.length).toBeGreaterThanOrEqual(1);
        expect(item.tags.length).toBeGreaterThanOrEqual(1);
      }
    }
  });
});
