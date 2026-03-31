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
  const socialActivity = catalog.activities.find((activity) => activity.id === "social-scenes");
  const looksAlphabet =
    lowerPrompt.includes("alphabet") ||
    lowerPrompt.includes("letter") ||
    lowerPrompt.includes("phonics") ||
    lowerPrompt.includes("a to z");
  const looksSocial =
    lowerPrompt.includes("social") ||
    lowerPrompt.includes("scene") ||
    lowerPrompt.includes("playground") ||
    lowerPrompt.includes("swing") ||
    lowerPrompt.includes("slide") ||
    lowerPrompt.includes("snack") ||
    lowerPrompt.includes("hello") ||
    lowerPrompt.includes("help");

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

  if (socialActivity && (looksSocial || !looksAlphabet)) {
    return {
      headline: "Add more social scene cards",
      reasoning:
        "The request fits the social scenes library, so the safest change is to extend that activity with more concrete everyday scene cards.",
      changes: [
        {
          type: "add-items",
          activityId: socialActivity.id,
          activityTitle: socialActivity.title,
          items: [
            item(
              "Playground Waiting Cards",
              "prompt-pack",
              "A small add-on pack for waiting in line and asking for a turn at playground equipment.",
              [
                "Show one playground picture card.",
                "Practice one short phrase.",
                "Repeat in the same order."
              ],
              ["social scenes", "playground", "waiting"]
            ),
            item(
              "Snack Choice Add-On",
              "support",
              "A concrete snack choice pack with food and drink request prompts.",
              [
                "Show two picture choices.",
                "Ask one short question.",
                "Answer with one clear phrase."
              ],
              ["social scenes", "snack", "choices"]
            )
          ]
        }
      ],
      notes: ["Fallback generator used because GitHub Copilot SDK was unavailable."]
    };
  }

  return {
    headline: "Add a new everyday scene set",
    reasoning:
      "The request does not point to one area clearly, so the fallback proposes one additional child-facing scene set instead of broad platform changes.",
    changes: [
      {
        type: "add-activity",
        activity: activityTemplate({
          title: "Home Routines",
          category: "Everyday communication",
          summary: "Picture cards for simple home routines such as getting shoes, washing hands, and tidying up.",
          goal: "Support daily communication with familiar objects and short routine phrases.",
          sessionLength: "8-12 min",
          workModeNote:
            "Work mode uses these routine cards as a fixed child-facing scene set with no live generation.",
          trainModeNote:
            "Train mode can add more routine cards, but the set should stay visual, concrete, and predictable.",
          items: [
            item(
              "Shoes On",
              "exercise",
              "A simple routine card for putting on shoes with one short phrase.",
              [
                "Show the shoes picture.",
                "Say one short routine phrase.",
                "Repeat once if helpful."
              ],
              ["home routine", "visual card", "daily living"]
            ),
            item(
              "Wash Hands",
              "support",
              "A clear hand-washing picture card with a short step sequence.",
              [
                "Show the hand-washing card.",
                "Say the routine phrase.",
                "Move to the next step slowly."
              ],
              ["home routine", "washing", "visual support"]
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
        "Prefer extending existing options such as social-scenes or alphabet-cards before creating something new.",
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
              activityId: "social-scenes",
              activityTitle: "Social Scenes",
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
