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
  kind: "letter" | "pair" | "keyboard" | "conversation" | "choice" | "alphabet" | "scene";
  lead: string;
  trail?: string;
  caption: string;
  imageSrc?: string;
  imageAlt?: string;
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

type AlphabetSeed = {
  letter: string;
  word: string;
};

const alphabetSeeds: AlphabetSeed[] = [
  { letter: "A", word: "Apple" },
  { letter: "B", word: "Ball" },
  { letter: "C", word: "Cat" },
  { letter: "D", word: "Dog" },
  { letter: "E", word: "Egg" },
  { letter: "F", word: "Fish" },
  { letter: "G", word: "Grapes" },
  { letter: "H", word: "House" },
  { letter: "I", word: "Ice Cream" },
  { letter: "J", word: "Juice" },
  { letter: "K", word: "Kite" },
  { letter: "L", word: "Leaf" },
  { letter: "M", word: "Moon" },
  { letter: "N", word: "Nest" },
  { letter: "O", word: "Orange" },
  { letter: "P", word: "Pear" },
  { letter: "Q", word: "Quilt" },
  { letter: "R", word: "Rainbow" },
  { letter: "S", word: "Sun" },
  { letter: "T", word: "Tree" },
  { letter: "U", word: "Umbrella" },
  { letter: "V", word: "Van" },
  { letter: "W", word: "Whale" },
  { letter: "X", word: "Xylophone" },
  { letter: "Y", word: "Yarn" },
  { letter: "Z", word: "Zebra" }
];

function createAlphabetCards(): ActivityPlayCard[] {
  return alphabetSeeds.map((seed) => ({
    id: "alphabet-" + seed.letter.toLowerCase(),
    title: seed.letter + " for " + seed.word,
    prompt: "Say the letter, then say the picture word.",
    focus: "Letter " + seed.letter,
    cue: "Say, " + seed.letter + " for " + seed.word + ".",
    example: seed.letter + " for " + seed.word + ".",
    art: {
      kind: "alphabet",
      lead: seed.word,
      trail: seed.letter,
      caption: seed.word + " card",
      imageSrc: "/cards/alphabet/" + seed.word.toLowerCase().replaceAll(" ", "-") + ".jpg",
      imageAlt: seed.word + " photo card"
    }
  }));
}

const bespokeConfigs: Record<string, ActivityPlayConfig> = {
  "alphabet-cards": {
    defaultModuleId: "alphabet_deck",
    coverLabel: "Alphabet Cards",
    supportLine: "Tap a picture card, hear it, and say the letter with the word.",
    audience: "Built for early learners who benefit from clear object pictures, short language, and predictable repetition.",
    theme: {
      primary: "#ea6f42",
      secondary: "#ffe4d8",
      surface: "#fff8f3",
      ink: "#4a2b20",
      badge: "#fff0b8",
      mascot: "Sunny"
    },
    modules: [
      {
        id: "alphabet_deck",
        title: "A to Z",
        description: "Move through all 26 picture cards.",
        accent: "Alphabet",
        skills: ["Look", "Hear", "Say"],
        calmNote: "One card at a time. Repeat when the child is ready.",
        cards: createAlphabetCards()
      }
    ]
  },
  "social-scenes": {
    defaultModuleId: "swing_time",
    coverLabel: "Social Scenes",
    supportLine: "Photo cards for everyday moments like turns, snack, greetings, and asking for help.",
    audience: "Helpful for autistic children and other learners who benefit from visual supports, predictable language, and concrete everyday situations.",
    theme: {
      primary: "#4f7aef",
      secondary: "#dbe8ff",
      surface: "#f5f8ff",
      ink: "#213252",
      badge: "#fff0b8",
      mascot: "Kiki"
    },
    modules: [
      {
        id: "swing_time",
        title: "Swing Time",
        description: "Practice waiting, asking for a turn, and finishing at the swing.",
        accent: "Playground",
        skills: ["Wait", "Ask", "Finish"],
        calmNote: "Keep the order the same each time.",
        cards: [
          {
            id: "swing-wait",
            title: "Wait for the swing",
            prompt: "Look at the swing and say the waiting words.",
            focus: "Waiting",
            cue: "Say, wait for the swing.",
            example: "Wait for the swing.",
            art: {
              kind: "scene",
              lead: "Swing",
              trail: "Wait",
              caption: "Playground swing",
              imageSrc: "/cards/social-scenes/swing.jpg",
              imageAlt: "Playground swing photo"
            }
          },
          {
            id: "swing-my-turn",
            title: "My turn on the swing",
            prompt: "Look at the swing and ask for a turn.",
            focus: "Turn taking",
            cue: "Say, my turn on the swing.",
            example: "My turn on the swing.",
            art: {
              kind: "scene",
              lead: "Swing",
              trail: "My turn",
              caption: "My swing turn",
              imageSrc: "/cards/social-scenes/swing.jpg",
              imageAlt: "Playground swing photo"
            }
          },
          {
            id: "swing-all-done",
            title: "All done with the swing",
            prompt: "Look at the swing and say the finished words.",
            focus: "Finishing",
            cue: "Say, all done with the swing.",
            example: "All done with the swing.",
            art: {
              kind: "scene",
              lead: "Swing",
              trail: "All done",
              caption: "Swing finished",
              imageSrc: "/cards/social-scenes/swing.jpg",
              imageAlt: "Playground swing photo"
            }
          }
        ]
      },
      {
        id: "slide_line",
        title: "Slide Line",
        description: "Practice lining up, waiting, and taking one turn at the slide.",
        accent: "Playground",
        skills: ["Line up", "Wait", "Turn"],
        calmNote: "Line up, wait, then go.",
        cards: [
          {
            id: "slide-line-up",
            title: "Line up for the slide",
            prompt: "Look at the slide and say the line-up words.",
            focus: "Joining the line",
            cue: "Say, line up for the slide.",
            example: "Line up for the slide.",
            art: {
              kind: "scene",
              lead: "Slide",
              trail: "Line up",
              caption: "Slide line",
              imageSrc: "/cards/social-scenes/slide.jpg",
              imageAlt: "Playground slide photo"
            }
          },
          {
            id: "slide-wait",
            title: "Wait for the slide",
            prompt: "Look at the slide and say the waiting words.",
            focus: "Waiting",
            cue: "Say, wait for the slide.",
            example: "Wait for the slide.",
            art: {
              kind: "scene",
              lead: "Slide",
              trail: "Wait",
              caption: "Wait for the slide",
              imageSrc: "/cards/social-scenes/slide.jpg",
              imageAlt: "Playground slide photo"
            }
          },
          {
            id: "slide-my-turn",
            title: "My turn on the slide",
            prompt: "Look at the slide and say the turn words.",
            focus: "Turn taking",
            cue: "Say, my turn on the slide.",
            example: "My turn on the slide.",
            art: {
              kind: "scene",
              lead: "Slide",
              trail: "My turn",
              caption: "Slide turn",
              imageSrc: "/cards/social-scenes/slide.jpg",
              imageAlt: "Playground slide photo"
            }
          }
        ]
      },
      {
        id: "snack_time",
        title: "Snack Time",
        description: "Practice choosing, asking, and finishing at snack.",
        accent: "Snack",
        skills: ["Choose", "Ask", "Finish"],
        calmNote: "Use one short snack phrase at a time.",
        cards: [
          {
            id: "snack-choice",
            title: "Apple, please",
            prompt: "Look at the snack and say what you want.",
            focus: "Choosing",
            cue: "Say, apple, please.",
            example: "Apple, please.",
            art: {
              kind: "choice",
              lead: "Apple",
              trail: "Cracker",
              caption: "Snack choice",
              imageSrc: "/cards/social-scenes/snack.jpg",
              imageAlt: "Snack time photo"
            }
          },
          {
            id: "snack-juice",
            title: "Juice, please",
            prompt: "Look at the drink and ask for it.",
            focus: "Requesting",
            cue: "Say, juice, please.",
            example: "Juice, please.",
            art: {
              kind: "scene",
              lead: "Juice",
              trail: "Please",
              caption: "Ask for juice",
              imageSrc: "/cards/social-scenes/snack.jpg",
              imageAlt: "Snack time photo"
            }
          },
          {
            id: "snack-all-done",
            title: "All done with snack",
            prompt: "Look at the snack and say the finished words.",
            focus: "Finishing",
            cue: "Say, all done with snack.",
            example: "All done with snack.",
            art: {
              kind: "scene",
              lead: "Snack",
              trail: "All done",
              caption: "Snack finished",
              imageSrc: "/cards/social-scenes/snack.jpg",
              imageAlt: "Snack time photo"
            }
          }
        ]
      },
      {
        id: "hello_time",
        title: "Hello Time",
        description: "Practice hello, good morning, and goodbye.",
        accent: "Greeting",
        skills: ["Wave", "Say hello", "Say goodbye"],
        calmNote: "Use one greeting, then pause.",
        cards: [
          {
            id: "hello-hi",
            title: "Hello",
            prompt: "Look at the picture and say hello.",
            focus: "Greeting",
            cue: "Say, hello.",
            example: "Hello.",
            art: {
              kind: "conversation",
              lead: "Hello",
              trail: "Hi",
              caption: "Say hello",
              imageSrc: "/cards/social-scenes/hello.jpg",
              imageAlt: "Greeting photo"
            }
          },
          {
            id: "hello-morning",
            title: "Good morning",
            prompt: "Look at the picture and say good morning.",
            focus: "Greeting",
            cue: "Say, good morning.",
            example: "Good morning.",
            art: {
              kind: "conversation",
              lead: "Good morning",
              trail: "Hello",
              caption: "Morning hello",
              imageSrc: "/cards/social-scenes/hello.jpg",
              imageAlt: "Greeting photo"
            }
          },
          {
            id: "hello-bye",
            title: "Goodbye",
            prompt: "Look at the picture and say goodbye.",
            focus: "Goodbye",
            cue: "Say, goodbye.",
            example: "Goodbye.",
            art: {
              kind: "conversation",
              lead: "Goodbye",
              trail: "See you",
              caption: "Say goodbye",
              imageSrc: "/cards/social-scenes/hello.jpg",
              imageAlt: "Greeting photo"
            }
          }
        ]
      },
      {
        id: "ask_for_help",
        title: "Ask for Help",
        description: "Practice asking for help with simple clear words.",
        accent: "Help",
        skills: ["Notice", "Ask", "Repeat"],
        calmNote: "Keep the help words short and clear.",
        cards: [
          {
            id: "help-teacher",
            title: "I need help",
            prompt: "Look at the picture and ask for help.",
            focus: "Help",
            cue: "Say, I need help.",
            example: "I need help.",
            art: {
              kind: "scene",
              lead: "Teacher",
              trail: "Help",
              caption: "Ask for help",
              imageSrc: "/cards/social-scenes/help.jpg",
              imageAlt: "Classroom help photo"
            }
          },
          {
            id: "help-backpack",
            title: "Help with my backpack",
            prompt: "Look at the picture and ask for backpack help.",
            focus: "Help",
            cue: "Say, help with my backpack, please.",
            example: "Help with my backpack, please.",
            art: {
              kind: "scene",
              lead: "Backpack",
              trail: "Help",
              caption: "Backpack help",
              imageSrc: "/cards/social-scenes/help.jpg",
              imageAlt: "Classroom help photo"
            }
          },
          {
            id: "help-open",
            title: "Open it, please",
            prompt: "Look at the picture and ask someone to open it.",
            focus: "Help",
            cue: "Say, open it, please.",
            example: "Open it, please.",
            art: {
              kind: "scene",
              lead: "Open",
              trail: "Please",
              caption: "Ask to open",
              imageSrc: "/cards/social-scenes/help.jpg",
              imageAlt: "Classroom help photo"
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
      mascot: "Helper"
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
          focus: item.steps[0] ?? "Step " + String(index + 1),
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
