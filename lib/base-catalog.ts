import type { Catalog } from "@/lib/types";

export const baseCatalog: Catalog = {
  updatedAt: "2026-03-31T00:00:00.000Z",
  activities: [
    {
      id: "typing-lab",
      title: "Typing Lab",
      category: "Keyboard practice",
      summary:
        "Short, repeatable typing sessions with visual pacing and cue-driven prompts for early learners.",
      goal: "Build confidence with letters, words, and short phrases.",
      sessionLength: "10-15 min",
      workModeNote:
        "Work mode keeps this static: choose one typing item and run the steps as listed, with no live generation.",
      trainModeNote:
        "Train mode can extend this activity with more levels, prompt packs, or accessibility supports such as slower pacing and extra visual cues.",
      items: [
        {
          id: "typing-letter-match",
          title: "Letter Match",
          kind: "exercise",
          summary: "Match one sound to one key with slow pacing and strong repetition.",
          steps: [
            "Show one target letter at a time.",
            "Say the sound aloud before pressing the key.",
            "Repeat the same target for 5-8 turns before switching."
          ],
          tags: ["early typing", "letter-sound", "repetition"]
        },
        {
          id: "typing-word-builder",
          title: "Word Builder",
          kind: "exercise",
          summary: "Move from letters to simple high-frequency words with a predictable prompt rhythm.",
          steps: [
            "Read the word together.",
            "Type one letter at a time with a visual cue.",
            "Replay the full word at the end."
          ],
          tags: ["words", "visual support", "motor planning"]
        },
        {
          id: "typing-calm-settings",
          title: "Calm Settings Pack",
          kind: "setting",
          summary: "Static support options to keep the activity predictable.",
          steps: [
            "Reduce visual clutter to one target at a time.",
            "Use a slower countdown between prompts.",
            "Keep success feedback short and consistent."
          ],
          tags: ["accessibility", "predictability", "support"]
        }
      ]
    },
    {
      id: "speech-training",
      title: "Speech Training",
      category: "Speech practice",
      summary:
        "Home-practice speech routines with breathing, articulation, and short phrase drills that can be reused every day.",
      goal: "Support sound formation and clearer phrase production.",
      sessionLength: "8-12 min",
      workModeNote:
        "Work mode treats speech training like a printed routine: pick one item, follow the steps, and stop there.",
      trainModeNote:
        "Train mode can add more sound families, short articulation ladders, or new home-practice packs similar to the speech-training direction on SocialDiverse.",
      items: [
        {
          id: "speech-breath-reset",
          title: "Breath Reset",
          kind: "exercise",
          summary: "A short warm-up for posture, breath, and steady voice onset.",
          steps: [
            "Sit tall and place both feet on the floor.",
            "Inhale through the nose for 3 counts.",
            "Exhale with a long quiet sound for 4 counts."
          ],
          tags: ["warm-up", "breathing", "voice"]
        },
        {
          id: "speech-mirror-sounds",
          title: "Mirror Sounds",
          kind: "exercise",
          summary: "Use a mirror to copy mouth shape for target sounds.",
          steps: [
            "Watch the mouth shape together.",
            "Copy the sound 5 times slowly.",
            "Move from sound to short syllables."
          ],
          tags: ["articulation", "mirror", "visual cue"]
        },
        {
          id: "speech-short-phrases",
          title: "Short Phrase Ladder",
          kind: "prompt-pack",
          summary: "Practice one sound inside short everyday phrases.",
          steps: [
            "Start with one target word.",
            "Expand to a 2-3 word phrase.",
            "Repeat the final phrase in three calm turns."
          ],
          tags: ["phrases", "carryover", "daily practice"]
        }
      ]
    },
    {
      id: "social-scenes",
      title: "Social Scenes",
      category: "Conversation practice",
      summary:
        "Guided scene cards for short exchanges, turn-taking, and predictable response practice.",
      goal: "Support social communication in familiar settings.",
      sessionLength: "12-18 min",
      workModeNote:
        "Work mode keeps the scene library fixed so learners get the same prompts and steps every session.",
      trainModeNote:
        "Train mode can add more scenes or item packs, but they should stay structured and close to the current categories.",
      items: [
        {
          id: "scene-greeting-loop",
          title: "Greeting Loop",
          kind: "exercise",
          summary: "A repeatable hello-and-response routine for familiar people.",
          steps: [
            "Practice a hello line.",
            "Wait for one reply.",
            "Use one closing line."
          ],
          tags: ["greeting", "turn-taking", "routine"]
        },
        {
          id: "scene-help-request",
          title: "Help Request Card",
          kind: "support",
          summary: "A structured way to ask for help using one cue sentence and one follow-up.",
          steps: [
            "Name the problem.",
            "Ask for help with one sentence.",
            "Repeat the request once if needed."
          ],
          tags: ["requesting", "support", "sentence starter"]
        },
        {
          id: "scene-choice-practice",
          title: "Choice Practice",
          kind: "prompt-pack",
          summary: "Practice answering simple preference questions with visual support.",
          steps: [
            "Show two options.",
            "Ask one short question.",
            "Answer with one clear preference sentence."
          ],
          tags: ["choices", "response practice", "visual support"]
        }
      ]
    }
  ]
};
