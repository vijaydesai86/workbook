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
        "A counting deck from 1 to 20 with calm real-photo cards and a choice of apple cards or mixed picture cards.",
      goal: "Support early number sense with clear counting layouts, large numerals, and concrete real-object groups.",
      sessionLength: "8-15 min",
      workModeNote:
        "Work mode keeps the number cards stable so the child can revisit the same apple set or picture set again and again.",
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
      id: "pizza-pizza",
      title: "Pizza, Pizza!",
      category: "Colour and shape matching",
      summary:
        "A fun pizza-building game where you spin for a colour and shape, then find the matching topping to fill your pizza.",
      goal: "Build colour recognition, shape matching, and turn-taking skills through a calm, predictable game loop.",
      sessionLength: "5-10 min",
      workModeNote:
        "Work mode uses a fixed seed so the pizza board and topping cards are always the same, giving the child a predictable routine.",
      trainModeNote:
        "Train mode could add new topping themes or adjust board sizes, but the core game should stay simple.",
      items: [
        {
          id: "pizza-spin-match",
          title: "Spin and match",
          kind: "exercise",
          summary: "Spin the spinners, then pick the matching topping card.",
          steps: [
            "Tap the Spin button.",
            "Look at the colour and shape.",
            "Pick the matching topping card."
          ],
          tags: ["colours", "shapes", "matching"]
        },
        {
          id: "pizza-place-topping",
          title: "Place the topping",
          kind: "exercise",
          summary: "Good toppings go on the pizza. Yucky toppings go in the bin!",
          steps: [
            "If the topping is good, it goes on your pizza.",
            "If the topping is yucky, it goes in the bin.",
            "Fill all the slices to win!"
          ],
          tags: ["sorting", "decision making", "fun"]
        }
      ]
    }
  ]
};
