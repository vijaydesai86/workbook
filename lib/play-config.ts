import type { Activity } from "@/lib/types";

export type ActivityTheme = {
  primary: string;
  secondary: string;
  surface: string;
  ink: string;
  badge: string;
  mascot: string;
};

export type ActivityArt = {
  kind: "letter" | "pair" | "keyboard" | "conversation" | "choice";
  lead: string;
  trail?: string;
  caption: string;
};

export type ActivityPlayCard = {
  id: string;
  title: string;
  prompt: string;
  focus: string;
  cue: string;
  example: string;
  art: ActivityArt;
};

export type ActivityPlayModule = {
  id: string;
  title: string;
  description: string;
  accent: string;
  skills: string[];
  calmNote: string;
  cards: ActivityPlayCard[];
};

export type ActivityPlayConfig = {
  defaultModuleId: string;
  coverLabel: string;
  supportLine: string;
  audience: string;
  theme: ActivityTheme;
  modules: ActivityPlayModule[];
};

const bespokeConfigs: Record<string, ActivityPlayConfig> = {
  "speech-training": {
    defaultModuleId: "single_letters",
    coverLabel: "Speech Studio",
    supportLine: "Slow speech cards with visual cues, repeatable turns, and no pressure timers.",
    audience: "Great for home practice, early communicators, and articulation warm-ups.",
    theme: {
      primary: "#ff8a5b",
      secondary: "#ffe6db",
      surface: "#fff6f1",
      ink: "#48281e",
      badge: "#fff0c2",
      mascot: "Milo the mouth coach"
    },
    modules: [
      {
        id: "single_letters",
        title: "Single Letters",
        description: "Practice one speech sound at a time using large visual cards.",
        accent: "Warm-up mode",
        skills: ["See it", "Say it", "Repeat it"],
        calmNote: "One sound per card. Repeat slowly. Stop any time.",
        cards: [
          {
            id: "letter-s",
            title: "S Sound",
            prompt: "Watch the mouth shape, then hold the /s/ sound in a long gentle stream.",
            focus: "Long quiet airflow",
            cue: "Smile a little and keep the tongue behind the teeth.",
            example: "sss",
            art: {
              kind: "letter",
              lead: "S",
              caption: "Snake sound"
            }
          },
          {
            id: "letter-m",
            title: "M Sound",
            prompt: "Close the lips, hum /m/, and feel the buzz before opening the mouth.",
            focus: "Lips together first",
            cue: "Touch your lips lightly, then let the sound hum.",
            example: "mmm",
            art: {
              kind: "letter",
              lead: "M",
              caption: "Humming sound"
            }
          },
          {
            id: "letter-p",
            title: "P Sound",
            prompt: "Press the lips together and pop the /p/ sound once with a tiny puff of air.",
            focus: "Quick lip pop",
            cue: "Keep the jaw loose and use a short burst of air.",
            example: "puh",
            art: {
              kind: "letter",
              lead: "P",
              caption: "Pop sound"
            }
          }
        ]
      },
      {
        id: "sound_pairs",
        title: "Sound Pairs",
        description: "Blend one sound into a short vowel pair using two-part cards.",
        accent: "Bridge mode",
        skills: ["Blend", "Pause", "Repeat"],
        calmNote: "Say the first sound, then slide into the second one without rushing.",
        cards: [
          {
            id: "pair-sa",
            title: "sa",
            prompt: "Start with /s/ and slide into ah in one smooth move.",
            focus: "Smooth blend",
            cue: "Keep the air moving before you open into the vowel.",
            example: "sa",
            art: {
              kind: "pair",
              lead: "S",
              trail: "A",
              caption: "Slide together"
            }
          },
          {
            id: "pair-sho",
            title: "sho",
            prompt: "Make /sh/ first and round the lips for oh without stopping.",
            focus: "Rounded lips",
            cue: "Whisper the first sound softly, then round the mouth.",
            example: "sho",
            art: {
              kind: "pair",
              lead: "SH",
              trail: "O",
              caption: "Quiet to round"
            }
          },
          {
            id: "pair-ma",
            title: "ma",
            prompt: "Hum /m/ and release into ah in one calm motion.",
            focus: "One motion",
            cue: "Keep the lips closed at first and open gently.",
            example: "ma",
            art: {
              kind: "pair",
              lead: "M",
              trail: "A",
              caption: "Hum then open"
            }
          }
        ]
      },
      {
        id: "home_phrases",
        title: "Home Phrases",
        description: "Use a target sound inside short everyday phrases.",
        accent: "Use-it mode",
        skills: ["Ask", "Point", "Use words"],
        calmNote: "Keep the phrase short. One breath. One clear try.",
        cards: [
          {
            id: "phrase-more-water",
            title: "More water",
            prompt: "Point to the drink and say the full phrase in one calm breath.",
            focus: "Steady pacing",
            cue: "Point first, then speak once.",
            example: "More water",
            art: {
              kind: "conversation",
              lead: "MORE",
              trail: "WATER",
              caption: "Ask for a drink"
            }
          },
          {
            id: "phrase-my-turn",
            title: "My turn",
            prompt: "Use the phrase before reaching for the toy or game.",
            focus: "Clear first word",
            cue: "Tap the card once before saying the words.",
            example: "My turn",
            art: {
              kind: "conversation",
              lead: "MY",
              trail: "TURN",
              caption: "Ask to join"
            }
          },
          {
            id: "phrase-see-it",
            title: "See it",
            prompt: "Look at the item and say the two words together.",
            focus: "Crisp opening sound",
            cue: "Stretch the first sound lightly and keep the phrase short.",
            example: "See it",
            art: {
              kind: "conversation",
              lead: "SEE",
              trail: "IT",
              caption: "Name what you notice"
            }
          }
        ]
      }
    ]
  },
  "typing-lab": {
    defaultModuleId: "learning",
    coverLabel: "Typing Game",
    supportLine: "Calm keyboard play with large targets, short rounds, and praise-focused feedback.",
    audience: "Made for beginners, non-verbal learners, and children who need predictable repetition.",
    theme: {
      primary: "#4c8bf5",
      secondary: "#dce8ff",
      surface: "#f3f7ff",
      ink: "#1a2d4f",
      badge: "#e6f8e5",
      mascot: "Pixel the typing buddy"
    },
    modules: [
      {
        id: "learning",
        title: "Learning",
        description: "Letters appear in a guided order with one big target at a time.",
        accent: "Learning mode",
        skills: ["Look", "Tap", "Celebrate"],
        calmNote: "One key only. No rush. Repeat with the same pace.",
        cards: [
          {
            id: "type-a",
            title: "Find A",
            prompt: "Look for the A key and press it once when you are ready.",
            focus: "One target only",
            cue: "Eyes on the key, then one quiet tap.",
            example: "A",
            art: {
              kind: "keyboard",
              lead: "A",
              caption: "Home row target"
            }
          },
          {
            id: "type-s",
            title: "Find S",
            prompt: "Say the letter name first, then press S slowly.",
            focus: "Name then tap",
            cue: "Start from the home row and tap once.",
            example: "S",
            art: {
              kind: "keyboard",
              lead: "S",
              caption: "Say then tap"
            }
          },
          {
            id: "type-d",
            title: "Find D",
            prompt: "Press D and watch the same letter appear on screen.",
            focus: "Cause and effect",
            cue: "Tap once, look up, and smile at the match.",
            example: "D",
            art: {
              kind: "keyboard",
              lead: "D",
              caption: "See the match"
            }
          }
        ]
      },
      {
        id: "practice",
        title: "Practice",
        description: "Short words with the same calm rhythm on every round.",
        accent: "Practice mode",
        skills: ["Read", "Type", "Repeat"],
        calmNote: "Short words only. Use a pause between each key.",
        cards: [
          {
            id: "word-sun",
            title: "sun",
            prompt: "Type the word sun one letter at a time.",
            focus: "Three-key sequence",
            cue: "Read the full word first, then type it slowly.",
            example: "sun",
            art: {
              kind: "keyboard",
              lead: "SUN",
              caption: "Short bright word"
            }
          },
          {
            id: "word-map",
            title: "map",
            prompt: "Type map and pause after every letter.",
            focus: "Pause between taps",
            cue: "Point to each letter before pressing it.",
            example: "map",
            art: {
              kind: "keyboard",
              lead: "MAP",
              caption: "Three taps"
            }
          },
          {
            id: "word-dog",
            title: "dog",
            prompt: "Type dog once, then try the same word one more time.",
            focus: "Confidence replay",
            cue: "Keep the same speed on both turns.",
            example: "dog",
            art: {
              kind: "keyboard",
              lead: "DOG",
              caption: "Repeat the win"
            }
          }
        ]
      },
      {
        id: "free_play",
        title: "Free Play",
        description: "Explore keys freely while hearing or seeing the target.",
        accent: "Free play",
        skills: ["Explore", "Notice", "Try again"],
        calmNote: "No score. No finish line. Just explore letters.",
        cards: [
          {
            id: "free-b",
            title: "Tap B",
            prompt: "Tap B whenever you feel ready and listen for the letter cue.",
            focus: "Explore one letter",
            cue: "There is no wrong pace here.",
            example: "B",
            art: {
              kind: "keyboard",
              lead: "B",
              caption: "Try any time"
            }
          },
          {
            id: "free-c",
            title: "Tap C",
            prompt: "Tap C and watch the screen answer back.",
            focus: "See and hear",
            cue: "Look, press, then reset for another turn.",
            example: "C",
            art: {
              kind: "keyboard",
              lead: "C",
              caption: "Sound + sight"
            }
          },
          {
            id: "free-l",
            title: "Tap L",
            prompt: "Try L at your own speed and notice where it sits on the keyboard.",
            focus: "Find the place",
            cue: "Use one finger and take your time.",
            example: "L",
            art: {
              kind: "keyboard",
              lead: "L",
              caption: "Find the spot"
            }
          }
        ]
      }
    ]
  },
  "social-scenes": {
    defaultModuleId: "greetings",
    coverLabel: "Social Stories",
    supportLine: "Practice short social moments through visual turns, simple scripts, and clear choices.",
    audience: "Helpful for greetings, asking for help, and building short conversation routines.",
    theme: {
      primary: "#6b56d6",
      secondary: "#e7e0ff",
      surface: "#f7f4ff",
      ink: "#291d54",
      badge: "#fff2bf",
      mascot: "Tara the talk buddy"
    },
    modules: [
      {
        id: "greetings",
        title: "Greetings",
        description: "Short predictable openings for familiar people.",
        accent: "Start together",
        skills: ["Wave", "Say hello", "Wait"],
        calmNote: "One greeting, one wait, one reply.",
        cards: [
          {
            id: "hello",
            title: "Hello",
            prompt: "Look up, wave once, and say hello.",
            focus: "Face and word",
            cue: "Count 1-2, then speak.",
            example: "Hello",
            art: {
              kind: "conversation",
              lead: "HELLO",
              trail: "HI",
              caption: "Greeting turn"
            }
          },
          {
            id: "good-morning",
            title: "Good morning",
            prompt: "Use the full greeting in one calm voice.",
            focus: "Whole phrase",
            cue: "Smile first, then start the words.",
            example: "Good morning",
            art: {
              kind: "conversation",
              lead: "GOOD",
              trail: "MORNING",
              caption: "Start the day"
            }
          },
          {
            id: "how-are-you",
            title: "How are you?",
            prompt: "Ask the question and wait for one response.",
            focus: "Ask then wait",
            cue: "Keep the hands still while listening.",
            example: "How are you?",
            art: {
              kind: "conversation",
              lead: "HOW",
              trail: "YOU",
              caption: "Question turn"
            }
          }
        ]
      },
      {
        id: "help_requests",
        title: "Help Requests",
        description: "Practice asking for help using one clear sentence.",
        accent: "Ask for support",
        skills: ["Notice", "Ask", "Repeat"],
        calmNote: "Use one sentence, then repeat it only once if needed.",
        cards: [
          {
            id: "need-help",
            title: "I need help",
            prompt: "Use the full sentence clearly one time.",
            focus: "Whole sentence",
            cue: "Point to the problem before speaking.",
            example: "I need help",
            art: {
              kind: "conversation",
              lead: "I NEED",
              trail: "HELP",
              caption: "Ask clearly"
            }
          },
          {
            id: "can-you-help",
            title: "Can you help me?",
            prompt: "Say the question and wait for one answer.",
            focus: "Question voice",
            cue: "Take one breath before starting.",
            example: "Can you help me?",
            art: {
              kind: "conversation",
              lead: "CAN YOU",
              trail: "HELP",
              caption: "Ask a person"
            }
          },
          {
            id: "please-open",
            title: "Please open it",
            prompt: "Show the item and say the request once.",
            focus: "Request with object",
            cue: "Hold the item still while speaking.",
            example: "Please open it",
            art: {
              kind: "conversation",
              lead: "PLEASE",
              trail: "OPEN",
              caption: "Request turn"
            }
          }
        ]
      },
      {
        id: "choices",
        title: "Choice Making",
        description: "Use short choice cards to answer preference questions.",
        accent: "Pick one",
        skills: ["Look", "Pick", "Say it"],
        calmNote: "Two choices. One answer. One calm sentence.",
        cards: [
          {
            id: "choice-snack",
            title: "Snack choice",
            prompt: "Look at two snack choices and say which one you want.",
            focus: "One clear preference",
            cue: "Point first, then say the choice.",
            example: "I want apple",
            art: {
              kind: "choice",
              lead: "APPLE",
              trail: "CRACKER",
              caption: "Pick your snack"
            }
          },
          {
            id: "choice-toy",
            title: "Toy choice",
            prompt: "Choose one toy and say the name of it.",
            focus: "Choose and say",
            cue: "Touch the choice before speaking.",
            example: "Car please",
            art: {
              kind: "choice",
              lead: "CAR",
              trail: "BALL",
              caption: "Pick a toy"
            }
          },
          {
            id: "choice-song",
            title: "Song choice",
            prompt: "Pick one song card and say the name clearly.",
            focus: "Choice request",
            cue: "Use one short phrase only.",
            example: "Play Wheels",
            art: {
              kind: "choice",
              lead: "WHEELS",
              trail: "RAINBOW",
              caption: "Pick the song"
            }
          }
        ]
      }
    ]
  }
};

function createFallbackConfig(activity: Activity): ActivityPlayConfig {
  return {
    defaultModuleId: "guided_practice",
    coverLabel: activity.title,
    supportLine: activity.summary,
    audience: activity.goal,
    theme: {
      primary: "#0b8f7a",
      secondary: "#dff7f1",
      surface: "#f3fbf8",
      ink: "#14363a",
      badge: "#fff3cb",
      mascot: "Helper buddy"
    },
    modules: [
      {
        id: "guided_practice",
        title: "Guided Practice",
        description: "Play through the saved activity cards one step at a time.",
        accent: activity.category,
        skills: ["Look", "Try", "Repeat"],
        calmNote: "Use the same order each time for a predictable routine.",
        cards: activity.items.map((item, index) => ({
          id: item.id,
          title: item.title,
          prompt: item.summary,
          focus: item.steps[0] ?? `Step ${index + 1}`,
          cue: item.steps[1] ?? item.tags.join(", "),
          example: item.steps[2] ?? item.tags[0] ?? item.kind,
          art: {
            kind: "letter",
            lead: item.title.slice(0, 2).toUpperCase(),
            caption: item.kind
          }
        }))
      }
    ]
  };
}

export function getPlayConfigForActivity(activity: Activity): ActivityPlayConfig {
  return bespokeConfigs[activity.id] ?? createFallbackConfig(activity);
}

export function getPlayModule(config: ActivityPlayConfig, requestedModuleId?: string | null) {
  return (
    config.modules.find((module) => module.id === requestedModuleId) ??
    config.modules.find((module) => module.id === config.defaultModuleId) ??
    config.modules[0]
  );
}
