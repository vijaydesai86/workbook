import { trainingProposalSchema } from "@/lib/schema";
import type { Activity, ActivityItem, Catalog, TrainingProposal } from "@/lib/types";

type BuildTrainingProposalArgs = {
  prompt: string;
  catalog: Catalog;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
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
  const fenced = input.match(/```(?:json)?\s*([\s\S]*?)```/i);

  if (fenced?.[1]) {
    return fenced[1];
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
  const speechActivity = catalog.activities.find((activity) => activity.id === "speech-training");
  const typingActivity = catalog.activities.find((activity) => activity.id === "typing-lab");
  const socialActivity = catalog.activities.find((activity) => activity.id === "social-scenes");

  if (lowerPrompt.includes("speech") && speechActivity) {
    return {
      headline: "Add new speech home-practice items",
      reasoning:
        "The request is aligned with the existing speech-training activity, so the safest change is to extend that activity with a few repeatable home-practice packs.",
      changes: [
        {
          type: "add-items",
          activityId: speechActivity.id,
          activityTitle: speechActivity.title,
          items: [
            item(
              "S Sound Warm-Up",
              "exercise",
              "A slow progression from isolated /s/ sound to simple syllables.",
              [
                "Hold a quiet /s/ for 3 seconds.",
                "Repeat sa, see, so with steady airflow.",
                "Finish with three target words."
              ],
              ["speech", "articulation", "/s/"]
            ),
            item(
              "Sh Sound Ladder",
              "prompt-pack",
              "A short ladder for /sh/ in syllables and phrases.",
              [
                "Repeat sh in isolation.",
                "Move to sha, she, sho.",
                "Practice one short phrase with /sh/."
              ],
              ["speech", "articulation", "/sh/"]
            ),
            item(
              "Phrase Carryover Cards",
              "support",
              "A tiny set of carryover cues for using the target sound inside daily phrases.",
              [
                "Choose one target phrase.",
                "Repeat it in three calm turns.",
                "Use it once during a daily routine."
              ],
              ["carryover", "home practice", "phrases"]
            )
          ]
        }
      ],
      notes: [
        "Fallback generator used because GitHub Copilot SDK was unavailable.",
        "Apply the proposal and refine later once Copilot CLI is configured."
      ]
    };
  }

  if (lowerPrompt.includes("typing") && typingActivity) {
    return {
      headline: "Extend typing supports with learner-friendly packs",
      reasoning:
        "The request matches the typing activity, so the proposed change adds bounded support packs rather than changing the core product flow.",
      changes: [
        {
          type: "add-items",
          activityId: typingActivity.id,
          activityTitle: typingActivity.title,
          items: [
            item(
              "Color Cue Letters",
              "support",
              "Use stable colors to group key targets and reduce scanning load.",
              [
                "Pick one key color group.",
                "Practice only that group for one round.",
                "Review success before switching."
              ],
              ["typing", "color cue", "support"]
            ),
            item(
              "Starter Word Tray",
              "prompt-pack",
              "A predictable set of short learner-friendly words for first typing wins.",
              [
                "Choose three short words.",
                "Type each word twice.",
                "Finish with one timed replay."
              ],
              ["typing", "beginner", "words"]
            )
          ]
        }
      ],
      notes: ["Fallback generator used because GitHub Copilot SDK was unavailable."]
    };
  }

  return {
    headline: "Add a new guided conversation activity",
    reasoning:
      "The request does not point to one activity clearly, so the fallback adds one aligned activity instead of broad feature changes.",
    changes: [
      {
        type: "add-activity",
        activity: activityTemplate({
          title: "Turn Taking Studio",
          category: "Conversation practice",
          summary:
            "Short turn-taking drills for predictable exchanges with a visible start, response, and finish.",
          goal: "Build tolerance for waiting, responding, and handing the turn back.",
          sessionLength: "10-15 min",
          workModeNote:
            "Work mode uses these turn-taking drills as a fixed set of scene cards with no live generation.",
          trainModeNote:
            "Train mode can add more scene cards or response ladders, but should keep the routine-based structure.",
          items: [
            item(
              "Pass the Turn",
              "exercise",
              "Practice saying one line, waiting, and answering once more.",
              [
                "Say one starter line.",
                "Wait for the other speaker.",
                "Reply with one follow-up."
              ],
              ["turn-taking", "waiting", "conversation"]
            ),
            item(
              "Question Relay",
              "prompt-pack",
              "A set of short questions for back-and-forth exchanges.",
              [
                "Ask one short question.",
                "Listen for one answer.",
                "Ask one linked follow-up."
              ],
              ["questions", "conversation", "routine"]
            )
          ]
        })
      }
    ],
    notes: [
      "Fallback generator used because GitHub Copilot SDK was unavailable.",
      `Closest existing activity was ${socialActivity?.title ?? "social scenes"}.`
    ]
  };
}

async function generateWithCopilot(prompt: string, catalog: Catalog) {
  const { CopilotClient } = await import("@github/copilot-sdk");
  const client = new CopilotClient();

  try {
    const session = await client.createSession({ model: "gpt-4.1" });

    const response = await session.sendAndWait({
      prompt: [
        "You are designing additions for a communication-support activity app.",
        "Return JSON only. Do not include markdown.",
        "Allowed changes:",
        "- add-items to an existing activity",
        "- add-activity for one new aligned activity",
        "Do not suggest arbitrary platform features or admin systems.",
        "Keep additions aligned with the current activity-hub structure inspired by SocialDiverse.",
        "Prefer extending existing options such as speech-training before creating something new.",
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
              activityId: "speech-training",
              activityTitle: "Speech Training",
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
        `User request: ${prompt}`
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
