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
  cue: string;
};

const alphabetSeeds: AlphabetSeed[] = [
  { letter: "A", word: "Apple", cue: "Say A, then apple." },
  { letter: "B", word: "Ball", cue: "Say B, then ball." },
  { letter: "C", word: "Cat", cue: "Say C, then cat." },
  { letter: "D", word: "Dog", cue: "Say D, then dog." },
  { letter: "E", word: "Egg", cue: "Say E, then egg." },
  { letter: "F", word: "Fish", cue: "Say F, then fish." },
  { letter: "G", word: "Grapes", cue: "Say G, then grapes." },
  { letter: "H", word: "House", cue: "Say H, then house." },
  { letter: "I", word: "Ice Cream", cue: "Say I, then ice cream." },
  { letter: "J", word: "Juice", cue: "Say J, then juice." },
  { letter: "K", word: "Kite", cue: "Say K, then kite." },
  { letter: "L", word: "Leaf", cue: "Say L, then leaf." },
  { letter: "M", word: "Moon", cue: "Say M, then moon." },
  { letter: "N", word: "Nest", cue: "Say N, then nest." },
  { letter: "O", word: "Orange", cue: "Say O, then orange." },
  { letter: "P", word: "Pear", cue: "Say P, then pear." },
  { letter: "Q", word: "Quilt", cue: "Say Q, then quilt." },
  { letter: "R", word: "Rainbow", cue: "Say R, then rainbow." },
  { letter: "S", word: "Sun", cue: "Say S, then sun." },
  { letter: "T", word: "Tree", cue: "Say T, then tree." },
  { letter: "U", word: "Umbrella", cue: "Say U, then umbrella." },
  { letter: "V", word: "Van", cue: "Say V, then van." },
  { letter: "W", word: "Whale", cue: "Say W, then whale." },
  { letter: "X", word: "Xylophone", cue: "Say X, then xylophone." },
  { letter: "Y", word: "Yarn", cue: "Say Y, then yarn." },
  { letter: "Z", word: "Zebra", cue: "Say Z, then zebra." }
];

function createAlphabetCards(): ActivityPlayCard[] {
  return alphabetSeeds.map((seed) => ({
    id: "alphabet-" + seed.letter.toLowerCase(),
    title: seed.letter + " is for " + seed.word,
    prompt: "Look at the " + seed.word.toLowerCase() + " card, say the letter, then say the object word.",
    focus: "Letter " + seed.letter,
    cue: seed.cue,
    example: seed.letter + ". " + seed.word + ".",
    art: {
      kind: "alphabet",
      lead: seed.word.toUpperCase(),
      trail: seed.letter,
      caption: seed.word + " card"
    }
  }));
}

const bespokeConfigs: Record<string, ActivityPlayConfig> = {
  "alphabet-cards": {
    defaultModuleId: "alphabet_deck",
    coverLabel: "Alphabet Deck",
    supportLine: "A full visual alphabet with one picture card and one audio cue for each letter.",
    audience: "Built for early learners who benefit from clear object pictures, short language, and predictable repetition.",
    theme: {
      primary: "#ea6f42",
      secondary: "#ffe4d8",
      surface: "#fff8f3",
      ink: "#4a2b20",
      badge: "#fff0b8",
      mascot: "Sunny the alphabet buddy"
    },
    modules: [
      {
        id: "alphabet_deck",
        title: "A to Z Cards",
        description: "Move through all 26 alphabet picture cards in one calm, repeatable deck.",
        accent: "Full alphabet",
        skills: ["See the picture", "Name the letter", "Say the word"],
        calmNote: "One letter card at a time. Repeat only when the child is ready.",
        cards: createAlphabetCards()
      }
    ]
  },
  "social-scenes": {
    defaultModuleId: "swing_time",
    coverLabel: "Social Scenes",
    supportLine: "Everyday visual scenes for playground turns, snack choices, greetings, and help requests.",
    audience: "Helpful for autistic children and other learners who benefit from visual supports, predictable language, and concrete everyday situations.",
    theme: {
      primary: "#4f7aef",
      secondary: "#dbe8ff",
      surface: "#f5f8ff",
      ink: "#213252",
      badge: "#fff0b8",
      mascot: "Kiki the social buddy"
    },
    modules: [
      {
        id: "swing_time",
        title: "Swing Time",
        description: "Practice waiting, asking for a turn, and finishing at the swing.",
        accent: "Playground routine",
        skills: ["Wait", "Ask", "Finish"],
        calmNote: "Keep the order the same: wait, ask, swing, all done.",
        cards: [
          {
            id: "swing-wait",
            title: "Wait for the swing",
            prompt: "Show the swing card and say the waiting phrase one time.",
            focus: "Waiting with one short phrase",
            cue: "Point to the swing and say, wait for swing.",
            example: "Wait for swing.",
            art: {
              kind: "scene",
              lead: "SWING",
              trail: "WAIT",
              caption: "Playground swing"
            }
          },
          {
            id: "swing-my-turn",
            title: "My turn on the swing",
            prompt: "Use the swing picture and practice asking for a turn calmly.",
            focus: "Turn-taking phrase",
            cue: "Point to the swing and say, my turn swing.",
            example: "My turn swing.",
            art: {
              kind: "scene",
              lead: "SWING",
              trail: "MY TURN",
              caption: "Ask for the swing"
            }
          },
          {
            id: "swing-all-done",
            title: "All done swing",
            prompt: "Use the same swing card to practice finishing with a clear phrase.",
            focus: "Ending the routine",
            cue: "Touch the card and say, all done swing.",
            example: "All done swing.",
            art: {
              kind: "scene",
              lead: "SWING",
              trail: "ALL DONE",
              caption: "Finish the swing turn"
            }
          }
        ]
      },
      {
        id: "slide_line",
        title: "Slide Line",
        description: "Practice lining up, waiting, and taking one turn at the slide.",
        accent: "Wait in line",
        skills: ["Line up", "Wait", "Go"],
        calmNote: "Use the same sequence every time: line up, wait, then go.",
        cards: [
          {
            id: "slide-line-up",
            title: "Line up for the slide",
            prompt: "Look at the slide card and say the line-up phrase.",
            focus: "Joining the line",
            cue: "Point to the slide and say, line up.",
            example: "Line up.",
            art: {
              kind: "scene",
              lead: "SLIDE",
              trail: "LINE UP",
              caption: "Slide line"
            }
          },
          {
            id: "slide-wait",
            title: "Wait at the slide",
            prompt: "Practice waiting with one simple phrase before the turn.",
            focus: "Waiting in place",
            cue: "Point to the slide and say, wait.",
            example: "Wait.",
            art: {
              kind: "scene",
              lead: "SLIDE",
              trail: "WAIT",
              caption: "Wait for the slide"
            }
          },
          {
            id: "slide-my-turn",
            title: "My turn slide",
            prompt: "Use the slide card and say the turn phrase when ready.",
            focus: "Turn phrase",
            cue: "Point to the slide and say, my turn slide.",
            example: "My turn slide.",
            art: {
              kind: "scene",
              lead: "SLIDE",
              trail: "MY TURN",
              caption: "Take a slide turn"
            }
          }
        ]
      },
      {
        id: "snack_time",
        title: "Snack Time",
        description: "Use snack pictures to choose food, ask for juice, and finish calmly.",
        accent: "Snack choices",
        skills: ["Choose", "Request", "Finish"],
        calmNote: "Show two clear food cards and use one short phrase at a time.",
        cards: [
          {
            id: "snack-choice",
            title: "Apple or cracker",
            prompt: "Look at the snack pictures and choose one with a clear phrase.",
            focus: "Making one choice",
            cue: "Point to the snack and say, apple please or cracker please.",
            example: "Apple please.",
            art: {
              kind: "choice",
              lead: "APPLE",
              trail: "CRACKER",
              caption: "Snack choice"
            }
          },
          {
            id: "snack-juice",
            title: "Juice please",
            prompt: "Use the drink picture to practice one short request.",
            focus: "Requesting a drink",
            cue: "Point to the juice card and say, juice please.",
            example: "Juice please.",
            art: {
              kind: "scene",
              lead: "JUICE",
              trail: "PLEASE",
              caption: "Ask for juice"
            }
          },
          {
            id: "snack-all-done",
            title: "All done snack",
            prompt: "Use the snack picture to end the routine with one clear phrase.",
            focus: "Ending snack time",
            cue: "Touch the snack card and say, all done snack.",
            example: "All done snack.",
            art: {
              kind: "scene",
              lead: "CRACKER",
              trail: "ALL DONE",
              caption: "Finish snack time"
            }
          }
        ]
      },
      {
        id: "hello_time",
        title: "Hello Time",
        description: "Practice hello, good morning, and goodbye with familiar visual cues.",
        accent: "Greeting routine",
        skills: ["Wave", "Say hello", "Say goodbye"],
        calmNote: "Use one greeting at a time and pause for a reply.",
        cards: [
          {
            id: "hello-hi",
            title: "Hello",
            prompt: "Look at the greeting card and say hello one time.",
            focus: "Simple greeting",
            cue: "Wave and say, hello.",
            example: "Hello.",
            art: {
              kind: "conversation",
              lead: "HELLO",
              trail: "HI",
              caption: "Say hello"
            }
          },
          {
            id: "hello-morning",
            title: "Good morning",
            prompt: "Use the greeting card for a morning hello.",
            focus: "Whole greeting phrase",
            cue: "Smile and say, good morning.",
            example: "Good morning.",
            art: {
              kind: "conversation",
              lead: "GOOD MORNING",
              trail: "HELLO",
              caption: "Morning greeting"
            }
          },
          {
            id: "hello-bye",
            title: "Goodbye",
            prompt: "Practice ending the interaction with one goodbye phrase.",
            focus: "Closing the interaction",
            cue: "Wave and say, goodbye.",
            example: "Goodbye.",
            art: {
              kind: "conversation",
              lead: "GOODBYE",
              trail: "SEE YOU",
              caption: "Say goodbye"
            }
          }
        ]
      },
      {
        id: "ask_for_help",
        title: "Ask for Help",
        description: "Use teacher and backpack pictures for clear help requests.",
        accent: "Help routine",
        skills: ["Notice", "Ask", "Repeat once"],
        calmNote: "Keep help requests short and concrete.",
        cards: [
          {
            id: "help-teacher",
            title: "Teacher help",
            prompt: "Use the teacher card to practice a help request.",
            focus: "Asking an adult for help",
            cue: "Point to the teacher and say, I need help.",
            example: "I need help.",
            art: {
              kind: "scene",
              lead: "TEACHER",
              trail: "HELP",
              caption: "Ask the teacher"
            }
          },
          {
            id: "help-backpack",
            title: "Backpack help",
            prompt: "Use the backpack picture to ask for help with a zipper or buckle.",
            focus: "Naming the problem",
            cue: "Point to the backpack and say, help backpack please.",
            example: "Help backpack please.",
            art: {
              kind: "scene",
              lead: "BACKPACK",
              trail: "HELP PLEASE",
              caption: "Help with backpack"
            }
          },
          {
            id: "help-open",
            title: "Open please",
            prompt: "Use the drink or snack card to ask someone to open it.",
            focus: "Short request phrase",
            cue: "Hold the item card and say, open please.",
            example: "Open please.",
            art: {
              kind: "scene",
              lead: "JUICE",
              trail: "OPEN PLEASE",
              caption: "Ask to open"
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
