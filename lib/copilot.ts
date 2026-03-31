import { trainingProposalSchema } from "@/lib/schema";
import type { Activity, ActivityItem, Catalog, TrainingProposal } from "@/lib/types";

type BuildTrainingProposalArgs = {
  prompt: string;
  catalog: Catalog;
};

function slugify(value: string) {
  const lower = value.toLowerCase();
  let output = "";
  let lastWasDash = false;

  for (const char of lower) {
    const isLetter = char >= "a" && char <= "z";
    const isNumber = char >= "0" && char <= "9";

    if (isLetter || isNumber) {
      output += char;
      lastWasDash = false;
      continue;
    }

    if (!lastWasDash && output.length > 0) {
      output += "-";
      lastWasDash = true;
    }
  }

  if (output.endsWith("-")) {
    output = output.slice(0, -1);
  }

  return output;
}

function item(title: string, kind: ActivityItem["kind"], summary: string, steps: string[], tags: string[]) {
  return {
    id: slugify(title),
    title,
    kind,
    summary,
    steps,
    tags
  } satisfies ActivityItem;
}

function activityTemplate(activity: Omit<Activity, "id"> & { id?: string }) {
  return {
    ...activity,
    id: activity.id ?? slugify(activity.title)
  } satisfies Activity;
}

function extractJsonBlock(input: string) {
  const fenceStart = input.indexOf("```");

  if (fenceStart >= 0) {
    const firstBrace = input.indexOf("{", fenceStart);
    const fenceEnd = input.lastIndexOf("```");

    if (firstBrace >= 0 && fenceEnd > firstBrace) {
      return input.slice(firstBrace, fenceEnd).trim();
    }
  }

  const start = input.indexOf("{");
  const end = input.lastIndexOf("}");

  if (start >= 0 && end > start) {
    return input.slice(start, end + 1);
  }

  throw new Error("Copilot response did not include valid JSON.");
}

function fallbackProposal(prompt: string, catalog: Catalog): TrainingProposal {
  const lowerPrompt = prompt.toLowerCase();
  const alphabetActivity = catalog.activities.find((activity) => activity.id === "alphabet-cards");
  const countingActivity = catalog.activities.find((activity) => activity.id === "counting-cards");
  const looksAlphabet =
    lowerPrompt.includes("alphabet") ||
    lowerPrompt.includes("letter") ||
    lowerPrompt.includes("phonics") ||
    lowerPrompt.includes("a to z");
  const looksCounting =
    lowerPrompt.includes("count") ||
    lowerPrompt.includes("number") ||
    lowerPrompt.includes("math") ||
    lowerPrompt.includes("how many");

  if (looksAlphabet && alphabetActivity) {
    return {
      headline: "Add more alphabet picture cards",
      reasoning:
        "The request matches the alphabet deck, so the safest change is to extend that activity with more concrete picture cards and short cue phrases.",
      changes: [
        {
          type: "add-items",
          activityId: alphabetActivity.id,
          activityTitle: alphabetActivity.title,
          items: [
            item(
              "Animal Alphabet Add-On",
              "prompt-pack",
              "A small add-on pack that keeps the same one-letter, one-picture structure with animal cards.",
              [
                "Show one animal picture card.",
                "Say the letter first.",
                "Say the animal word next."
              ],
              ["alphabet", "animals", "visual cards"]
            ),
            item(
              "Food Alphabet Add-On",
              "prompt-pack",
              "A concrete food-themed picture pack that keeps the existing alphabet routine.",
              [
                "Point to the picture.",
                "Name the letter.",
                "Repeat the object word once."
              ],
              ["alphabet", "food", "picture cards"]
            )
          ]
        }
      ],
      notes: ["Fallback generator used because GitHub Copilot SDK was unavailable."]
    };
  }

  if (countingActivity && (looksCounting || !looksAlphabet)) {
    return {
      headline: "Add more counting picture packs",
      reasoning:
        "The request fits the counting deck, so the safest change is to extend that activity with more concrete number-picture packs.",
      changes: [
        {
          type: "add-items",
          activityId: countingActivity.id,
          activityTitle: countingActivity.title,
          items: [
            item(
              "Animal Counting Pack",
              "prompt-pack",
              "A small add-on pack that keeps the same count-and-say routine with one clear animal photo repeated on each number card.",
              [
                "Look at the number card.",
                "Count the repeated picture.",
                "Say the whole number phrase."
              ],
              ["counting", "animals", "real photos"]
            ),
            item(
              "Toy Counting Pack",
              "support",
              "A concrete counting pack that uses familiar toy photos while keeping the same calm visual structure.",
              [
                "Point to each picture tile.",
                "Count in order.",
                "Say the number and object together."
              ],
              ["counting", "toys", "number phrases"]
            )
          ]
        }
      ],
      notes: ["Fallback generator used because GitHub Copilot SDK was unavailable."]
    };
  }

  return {
    headline: "Add a new picture card set",
    reasoning:
      "The request does not point to one area clearly, so the fallback proposes one additional child-facing picture-card activity instead of broad platform changes.",
    changes: [
      {
        type: "add-activity",
        activity: activityTemplate({
          title: "Color Cards",
          category: "Early learning",
          summary: "Picture cards for simple color practice using one clear real photo on each card.",
          goal: "Support color recognition with familiar objects and short repeatable cue phrases.",
          sessionLength: "8-12 min",
          workModeNote:
            "Work mode uses these cards as a fixed child-facing picture set with no live generation.",
          trainModeNote:
            "Train mode can add more color cards, but the set should stay visual, concrete, and predictable.",
          items: [
            item(
              "Red Card",
              "exercise",
              "A simple red object card with one short color phrase.",
              [
                "Show one color picture card.",
                "Say the color word.",
                "Repeat once if helpful."
              ],
              ["colors", "visual card", "real photo"]
            ),
            item(
              "Blue Card",
              "support",
              "A clear blue object card with the same short color routine.",
              [
                "Show the picture card.",
                "Say the color word.",
                "Move to the next card slowly."
              ],
              ["colors", "matching", "visual support"]
            )
          ]
        })
      }
    ],
    notes: [
      "Fallback generator used because GitHub Copilot SDK was unavailable.",
      "The new proposal stays aligned with the current visual activity structure."
    ]
  };
}

async function generateWithCopilot(prompt: string, catalog: Catalog) {
  const { CopilotClient } = await import("@github/copilot-sdk");
  const client = new CopilotClient() as any;

  try {
    const session = await client.createSession({ model: "gpt-4.1" });

    const response = await session.sendAndWait({
      prompt: [
        "You are designing additions for a child-focused communication-support activity app.",
        "Return JSON only. Do not include markdown.",
        "Allowed changes:",
        "- add-items to an existing activity",
        "- add-activity for one new aligned activity",
        "Do not suggest arbitrary platform features or admin systems.",
        "Keep additions aligned with the visual activity-hub structure.",
        "Prefer extending existing options such as alphabet-cards or counting-cards before creating something new.",
        "Every new item must include 3 short steps and 2-5 tags.",
        "Current catalog JSON:",
        JSON.stringify(catalog),
        "JSON shape to return:",
        JSON.stringify({
          headline: "Short proposal title",
          reasoning: "Why this fits the current catalog",
          changes: [
            {
              type: "add-items",
              activityId: "counting-cards",
              activityTitle: "Counting Cards",
              items: [
                {
                  id: "example-item-id",
                  title: "Example item",
                  kind: "exercise",
                  summary: "One-sentence summary",
                  steps: ["Step 1", "Step 2", "Step 3"],
                  tags: ["tag-one", "tag-two"]
                }
              ]
            }
          ],
          notes: ["Optional implementation note"]
        }),
        "User request: " + prompt
      ].join("\n")
    });

    const content =
      typeof response?.data?.content === "string"
        ? response.data.content
        : JSON.stringify(response?.data?.content ?? "");
    const parsed = JSON.parse(extractJsonBlock(content));
    return trainingProposalSchema.parse(parsed);
  } finally {
    await client.stop();
  }
}

export async function buildTrainingProposal({
  prompt,
  catalog
}: BuildTrainingProposalArgs): Promise<{ proposal: TrainingProposal; source: string }> {
  try {
    const proposal = await generateWithCopilot(prompt, catalog);
    return {
      proposal,
      source: "github-copilot-sdk"
    };
  } catch {
    return {
      proposal: fallbackProposal(prompt, catalog),
      source: "fallback-generator"
    };
  }
}
