import type { Catalog } from "@/lib/types";

export const baseCatalog: Catalog = {
  updatedAt: "2026-03-31T00:00:00.000Z",
  activities: [
    {
      id: "alphabet-cards",
      title: "Alphabet Cards",
      category: "Letter learning",
      summary:
        "A visual alphabet deck with one clear object card for each letter from A to Z.",
      goal: "Build letter recognition, object-word pairing, and predictable sound practice.",
      sessionLength: "10-15 min",
      workModeNote:
        "Work mode keeps the alphabet deck fixed so the child can revisit the same object cards and sounds in a calm routine.",
      trainModeNote:
        "Train mode can add more alphabet objects or themed letter packs, but the main alphabet deck should stay simple and consistent.",
      items: [
        {
          id: "alphabet-a-f",
          title: "A to F cards",
          kind: "exercise",
          summary: "Start with a short set of early alphabet object cards.",
          steps: [
            "Show one picture card at a time.",
            "Say the letter name first.",
            "Say the object word next."
          ],
          tags: ["letters", "objects", "visual cards"]
        },
        {
          id: "alphabet-g-l",
          title: "G to L cards",
          kind: "exercise",
          summary: "Keep the same rhythm with the next letter group.",
          steps: [
            "Point to the picture.",
            "Name the letter once.",
            "Repeat the object word clearly."
          ],
          tags: ["letters", "repetition", "predictable routine"]
        },
        {
          id: "alphabet-m-r",
          title: "M to R cards",
          kind: "exercise",
          summary: "Use the middle letter group for short review rounds.",
          steps: [
            "Look at the picture card.",
            "Say the letter and object together.",
            "Move to the next card slowly."
          ],
          tags: ["review", "matching", "speech support"]
        },
        {
          id: "alphabet-s-x",
          title: "S to X cards",
          kind: "support",
          summary: "Later letters stay visual and concrete with familiar picture prompts.",
          steps: [
            "Keep the pace slow.",
            "Use one short cue sentence.",
            "Repeat only when the child is ready."
          ],
          tags: ["visual support", "calm pacing", "letters"]
        },
        {
          id: "alphabet-y-z",
          title: "Y to Z cards",
          kind: "support",
          summary: "Finish the alphabet with the same picture-card routine.",
          steps: [
            "Point to the card.",
            "Say the letter.",
            "Say the object word."
          ],
          tags: ["end of deck", "object cards", "consistency"]
        }
      ]
    },
    {
      id: "social-scenes",
      title: "Social Scenes",
      category: "Everyday communication",
      summary:
        "Five everyday scene sets for swing time, slide line, snack time, hello time, and asking for help.",
      goal: "Support social communication with familiar places, clear picture cues, and short repeatable phrases.",
      sessionLength: "10-18 min",
      workModeNote:
        "Work mode keeps the same scene cards and phrases available each session so the child gets a predictable routine.",
      trainModeNote:
        "Train mode can add more social scenes later, but they should stay concrete, visual, and grounded in everyday life.",
      items: [
        {
          id: "scene-swing-time",
          title: "Swing Time",
          kind: "exercise",
          summary: "Practice waiting, asking for a turn, and finishing at the swing.",
          steps: [
            "Show the swing card.",
            "Practice one short phrase.",
            "Repeat with the same calm order."
          ],
          tags: ["playground", "turn taking", "swing"]
        },
        {
          id: "scene-slide-line",
          title: "Slide Line",
          kind: "exercise",
          summary: "Use picture cues for lining up and waiting at the slide.",
          steps: [
            "Point to the slide picture.",
            "Say the line-up phrase.",
            "Move to the next card when ready."
          ],
          tags: ["playground", "waiting", "slide"]
        },
        {
          id: "scene-snack-time",
          title: "Snack Time",
          kind: "support",
          summary: "Use food and drink cards for choosing and requesting at snack time.",
          steps: [
            "Show two picture choices.",
            "Ask one short question.",
            "Answer with one clear phrase."
          ],
          tags: ["snack", "choices", "requesting"]
        },
        {
          id: "scene-hello-time",
          title: "Hello Time",
          kind: "exercise",
          summary: "Practice hello, good morning, and goodbye with familiar greeting cards.",
          steps: [
            "Look at the greeting picture.",
            "Say one greeting phrase.",
            "Pause for a reply."
          ],
          tags: ["greetings", "school", "conversation"]
        },
        {
          id: "scene-ask-help",
          title: "Ask for Help",
          kind: "support",
          summary: "Use teacher and backpack cards to practice asking for help clearly.",
          steps: [
            "Show the help picture.",
            "Model the help phrase.",
            "Repeat once if needed."
          ],
          tags: ["help", "teacher", "requesting"]
        }
      ]
    }
  ]
};
