import { describe, expect, it } from "vitest";
import { customizationsSchema, trainingProposalSchema } from "@/lib/schema";

describe("trainingProposalSchema", () => {
  it("accepts a valid add-activity proposal", () => {
    const validProposal = {
      headline: "Add Color Cards",
      reasoning: "Color recognition helps early learners.",
      changes: [
        {
          type: "add-activity",
          activity: {
            id: "color-cards",
            title: "Color Cards",
            category: "Early learning",
            summary: "Picture cards for simple color practice.",
            goal: "Support color recognition with familiar objects.",
            sessionLength: "8-12 min",
            workModeNote: "Work mode uses fixed color cards.",
            trainModeNote: "Train mode can add more color cards.",
            items: [
              {
                id: "red-card",
                title: "Red Card",
                kind: "exercise",
                summary: "A simple red object card.",
                steps: ["Show card", "Say color", "Repeat"],
                tags: ["colors", "visual"]
              }
            ]
          }
        }
      ],
      notes: ["This is a valid note."]
    };

    const result = trainingProposalSchema.safeParse(validProposal);
    expect(result.success).toBe(true);
  });

  it("accepts a valid add-items proposal", () => {
    const validProposal = {
      headline: "Extend Alphabet Cards",
      reasoning: "More practice cards for learners.",
      changes: [
        {
          type: "add-items",
          activityId: "alphabet-cards",
          activityTitle: "Alphabet Cards",
          items: [
            {
              id: "animal-pack",
              title: "Animal Pack",
              kind: "prompt-pack",
              summary: "Animal-themed alphabet cards.",
              steps: ["Show card", "Say letter", "Say animal"],
              tags: ["alphabet", "animals"]
            }
          ]
        }
      ],
      notes: []
    };

    const result = trainingProposalSchema.safeParse(validProposal);
    expect(result.success).toBe(true);
  });

  it("rejects a proposal with empty headline", () => {
    const invalid = {
      headline: "",
      reasoning: "Some reasoning.",
      changes: [
        {
          type: "add-items",
          activityId: "alphabet-cards",
          activityTitle: "Alphabet Cards",
          items: [
            {
              id: "test-item",
              title: "Test",
              kind: "exercise",
              summary: "Test summary.",
              steps: ["Step 1"],
              tags: ["test"]
            }
          ]
        }
      ],
      notes: []
    };

    const result = trainingProposalSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it("rejects a proposal with empty changes array", () => {
    const invalid = {
      headline: "Valid headline",
      reasoning: "Valid reasoning.",
      changes: [],
      notes: []
    };

    const result = trainingProposalSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it("rejects an item with no steps", () => {
    const invalid = {
      headline: "Valid headline",
      reasoning: "Valid reasoning.",
      changes: [
        {
          type: "add-items",
          activityId: "alphabet-cards",
          activityTitle: "Alphabet Cards",
          items: [
            {
              id: "test",
              title: "Test",
              kind: "exercise",
              summary: "Test.",
              steps: [],
              tags: ["tag"]
            }
          ]
        }
      ],
      notes: []
    };

    const result = trainingProposalSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it("rejects an item with no tags", () => {
    const invalid = {
      headline: "Valid headline",
      reasoning: "Valid reasoning.",
      changes: [
        {
          type: "add-items",
          activityId: "alphabet-cards",
          activityTitle: "Alphabet Cards",
          items: [
            {
              id: "test",
              title: "Test",
              kind: "exercise",
              summary: "Test.",
              steps: ["Step 1"],
              tags: []
            }
          ]
        }
      ],
      notes: []
    };

    const result = trainingProposalSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it("rejects an unknown change type", () => {
    const invalid = {
      headline: "Valid headline",
      reasoning: "Valid reasoning.",
      changes: [
        {
          type: "remove-activity",
          activityId: "alphabet-cards"
        }
      ],
      notes: []
    };

    const result = trainingProposalSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it("rejects an activity with empty items array", () => {
    const invalid = {
      headline: "Valid headline",
      reasoning: "Valid reasoning.",
      changes: [
        {
          type: "add-activity",
          activity: {
            id: "empty-cards",
            title: "Empty Cards",
            category: "Test",
            summary: "Test summary.",
            goal: "Test goal.",
            sessionLength: "5 min",
            workModeNote: "Work note.",
            trainModeNote: "Train note.",
            items: []
          }
        }
      ],
      notes: []
    };

    const result = trainingProposalSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});

describe("customizationsSchema", () => {
  it("accepts valid empty customizations", () => {
    const valid = {
      addedActivities: [],
      addedItems: [],
      history: []
    };

    const result = customizationsSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it("accepts customizations with added activities", () => {
    const valid = {
      addedActivities: [
        {
          id: "color-cards",
          title: "Color Cards",
          category: "Early learning",
          summary: "Color practice.",
          goal: "Recognize colors.",
          sessionLength: "8 min",
          workModeNote: "Fixed cards.",
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
    };

    const result = customizationsSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it("accepts customizations with history entries", () => {
    const valid = {
      addedActivities: [],
      addedItems: [],
      history: [
        {
          appliedAt: "2026-01-01T00:00:00.000Z",
          headline: "Added Color Cards"
        }
      ]
    };

    const result = customizationsSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it("accepts customizations with added items", () => {
    const valid = {
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
              steps: ["Step 1"],
              tags: ["animals"]
            }
          ]
        }
      ],
      history: []
    };

    const result = customizationsSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it("rejects customizations missing required fields", () => {
    const invalid = {
      addedActivities: []
    };

    const result = customizationsSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
