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
      id: "counting-cards",
      title: "Counting Cards",
      category: "Early math",
      summary:
        "A counting deck from 1 to 20 with real photo objects repeated right on each card.",
      goal: "Support early number sense with clear counting layouts, large numerals, and concrete real-object groups.",
      sessionLength: "8-15 min",
      workModeNote:
        "Work mode keeps the number cards stable so the child can count the same layouts again and again.",
      trainModeNote:
        "Train mode can add more counting themes later, but the main 1 to 20 deck should stay simple and familiar.",
      items: [
        {
          id: "count-1-10",
          title: "Count 1 to 10",
          kind: "exercise",
          summary: "Start with the first ten number cards and count one group at a time.",
          steps: [
            "Look at the number.",
            "Count the photo objects.",
            "Say the whole count phrase."
          ],
          tags: ["numbers", "counting", "real objects"]
        },
        {
          id: "count-11-20",
          title: "Count 11 to 20",
          kind: "exercise",
          summary: "Move to bigger groups once the child is ready for longer counts.",
          steps: [
            "Point to the big number first.",
            "Count across the card slowly.",
            "Say the number and object together."
          ],
          tags: ["numbers", "larger groups", "visual math"]
        }
      ]
    },
    {
      id: "social-scenes",
      title: "Social Scenes",
      category: "Everyday communication",
      summary:
        "Five everyday picture sets for swing time, slide time, snack time, greetings, and asking for help.",
      goal: "Support social communication with concrete photos, short repeatable phrases, and more obvious visual meaning.",
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
          summary: "Use two clear swing pictures for going to the swing and taking a turn.",
          steps: [
            "Show the first swing picture.",
            "Say one short swing phrase.",
            "Move to the next picture when ready."
          ],
          tags: ["playground", "swing", "turn taking"]
        },
        {
          id: "scene-slide-time",
          title: "Slide Time",
          kind: "exercise",
          summary: "Use one picture for climbing and one for going down the slide.",
          steps: [
            "Point to the slide picture.",
            "Say the action phrase.",
            "Keep the order the same each time."
          ],
          tags: ["playground", "slide", "action words"]
        },
        {
          id: "scene-snack-time",
          title: "Snack Time",
          kind: "support",
          summary: "Use familiar food and drink cards for simple snack requests.",
          steps: [
            "Look at one snack card.",
            "Say the food or drink phrase.",
            "Pause before the next card."
          ],
          tags: ["snack", "requesting", "food"]
        },
        {
          id: "scene-hello-time",
          title: "Hello Time",
          kind: "exercise",
          summary: "Practice hello and goodbye with two different greeting pictures.",
          steps: [
            "Show the greeting picture.",
            "Say the greeting phrase.",
            "Pause and smile before moving on."
          ],
          tags: ["greetings", "waving", "conversation"]
        },
        {
          id: "scene-ask-help",
          title: "Ask for Help",
          kind: "support",
          summary: "Use one help photo and one backpack photo for clear help requests.",
          steps: [
            "Look at the help picture.",
            "Say the help phrase.",
            "Repeat once if needed."
          ],
          tags: ["help", "school", "requesting"]
        }
      ]
    }
  ]
};
