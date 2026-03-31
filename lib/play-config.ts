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
  kind: "letter" | "pair" | "keyboard" | "conversation" | "choice" | "alphabet" | "scene" | "count";
  lead: string;
  trail?: string;
  caption: string;
  imageSrc?: string;
  imageAlt?: string;
  count?: number;
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

type CountSeed = {
  value: number;
  objectLabel: string;
  imageSrc: string;
  imageAlt: string;
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

const numberWords = [
  "One",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight",
  "Nine",
  "Ten",
  "Eleven",
  "Twelve",
  "Thirteen",
  "Fourteen",
  "Fifteen",
  "Sixteen",
  "Seventeen",
  "Eighteen",
  "Nineteen",
  "Twenty"
];

const countSeeds: CountSeed[] = [
  { value: 1, objectLabel: "apple", imageSrc: "/cards/alphabet/apple.jpg", imageAlt: "Apple photo" },
  { value: 2, objectLabel: "apples", imageSrc: "/cards/alphabet/apple.jpg", imageAlt: "Apple photo" },
  { value: 3, objectLabel: "apples", imageSrc: "/cards/alphabet/apple.jpg", imageAlt: "Apple photo" },
  { value: 4, objectLabel: "apples", imageSrc: "/cards/alphabet/apple.jpg", imageAlt: "Apple photo" },
  { value: 5, objectLabel: "apples", imageSrc: "/cards/alphabet/apple.jpg", imageAlt: "Apple photo" },
  { value: 6, objectLabel: "apples", imageSrc: "/cards/alphabet/apple.jpg", imageAlt: "Apple photo" },
  { value: 7, objectLabel: "apples", imageSrc: "/cards/alphabet/apple.jpg", imageAlt: "Apple photo" },
  { value: 8, objectLabel: "apples", imageSrc: "/cards/alphabet/apple.jpg", imageAlt: "Apple photo" },
  { value: 9, objectLabel: "apples", imageSrc: "/cards/alphabet/apple.jpg", imageAlt: "Apple photo" },
  { value: 10, objectLabel: "apples", imageSrc: "/cards/alphabet/apple.jpg", imageAlt: "Apple photo" },
  { value: 11, objectLabel: "apples", imageSrc: "/cards/alphabet/apple.jpg", imageAlt: "Apple photo" },
  { value: 12, objectLabel: "apples", imageSrc: "/cards/alphabet/apple.jpg", imageAlt: "Apple photo" },
  { value: 13, objectLabel: "apples", imageSrc: "/cards/alphabet/apple.jpg", imageAlt: "Apple photo" },
  { value: 14, objectLabel: "apples", imageSrc: "/cards/alphabet/apple.jpg", imageAlt: "Apple photo" },
  { value: 15, objectLabel: "apples", imageSrc: "/cards/alphabet/apple.jpg", imageAlt: "Apple photo" },
  { value: 16, objectLabel: "apples", imageSrc: "/cards/alphabet/apple.jpg", imageAlt: "Apple photo" },
  { value: 17, objectLabel: "apples", imageSrc: "/cards/alphabet/apple.jpg", imageAlt: "Apple photo" },
  { value: 18, objectLabel: "apples", imageSrc: "/cards/alphabet/apple.jpg", imageAlt: "Apple photo" },
  { value: 19, objectLabel: "apples", imageSrc: "/cards/alphabet/apple.jpg", imageAlt: "Apple photo" },
  { value: 20, objectLabel: "apples", imageSrc: "/cards/alphabet/apple.jpg", imageAlt: "Apple photo" }
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

function createCountingCards(range: [number, number]): ActivityPlayCard[] {
  return countSeeds
    .filter((seed) => seed.value >= range[0] && seed.value <= range[1])
    .map((seed) => {
      const numberWord = numberWords[seed.value - 1];
      const phrase = numberWord + " " + seed.objectLabel;

      return {
        id: "count-" + String(seed.value),
        title: phrase,
        prompt: "Count the apples and say the whole number phrase.",
        focus: "Number " + String(seed.value),
        cue: "Say, " + phrase + ".",
        example: phrase + ".",
        art: {
          kind: "count",
          lead: phrase,
          trail: String(seed.value),
          caption: "Apple count card",
          imageSrc: seed.imageSrc,
          imageAlt: seed.imageAlt,
          count: seed.value
        }
      };
    });
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
  "counting-cards": {
    defaultModuleId: "count_1_10",
    coverLabel: "Counting Cards",
    supportLine: "Big number cards from 1 to 20 with real photo objects to count on every card.",
    audience: "Helpful for children who learn best with large numerals, concrete repeated pictures, and simple count-and-say routines.",
    theme: {
      primary: "#2f9f6f",
      secondary: "#dff6e7",
      surface: "#f5fff8",
      ink: "#1f4133",
      badge: "#fff0b8",
      mascot: "Milo"
    },
    modules: [
      {
        id: "count_1_10",
        title: "Count 1 to 10",
        description: "Start with smaller groups and clear one-step counting.",
        accent: "Numbers",
        skills: ["Look", "Count", "Say"],
        calmNote: "Point to each picture as you count.",
        cards: createCountingCards([1, 10])
      },
      {
        id: "count_11_20",
        title: "Count 11 to 20",
        description: "Move to larger groups once the child is ready.",
        accent: "Numbers",
        skills: ["Look", "Count", "Say"],
        calmNote: "Count across the card slowly from left to right.",
        cards: createCountingCards([11, 20])
      }
    ]
  },
  "social-scenes": {
    defaultModuleId: "swing_time",
    coverLabel: "Social Scenes",
    supportLine: "Real photo cards for everyday places, greetings, snack requests, and asking for help.",
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
        description: "Practice seeing the swing and waiting for the swing.",
        accent: "Playground",
        skills: ["Look", "Wait"],
        calmNote: "Show one swing picture at a time.",
        cards: [
          {
            id: "swing-go",
            title: "See the swing",
            prompt: "Look at the swing card and say swing.",
            focus: "Seeing the swing",
            cue: "Say, swing.",
            example: "Swing.",
            art: {
              kind: "scene",
              lead: "Swing",
              trail: "Look",
              caption: "Swing card",
              imageSrc: "/cards/social-scenes/swing.jpg",
              imageAlt: "Playground swing photo"
            }
          },
          {
            id: "swing-turn",
            title: "Wait for the swing",
            prompt: "Look at the swing picture and say the waiting words.",
            focus: "Waiting",
            cue: "Say, wait for the swing.",
            example: "Wait for the swing.",
            art: {
              kind: "scene",
              lead: "Swing",
              trail: "Wait",
              caption: "Wait for swing",
              imageSrc: "/cards/social-scenes/swing-wait.jpg",
              imageAlt: "Child waiting near a playground swing"
            }
          }
        ]
      },
      {
        id: "slide_time",
        title: "Slide Time",
        description: "Practice seeing the slide and going down the slide.",
        accent: "Playground",
        skills: ["Look", "Slide"],
        calmNote: "Keep the pictures in the same order each time.",
        cards: [
          {
            id: "slide-climb",
            title: "See the slide",
            prompt: "Look at the slide card and say slide.",
            focus: "Seeing the slide",
            cue: "Say, slide.",
            example: "Slide.",
            art: {
              kind: "scene",
              lead: "Slide",
              trail: "Look",
              caption: "Slide card",
              imageSrc: "/cards/social-scenes/slide.jpg",
              imageAlt: "Playground slide photo"
            }
          },
          {
            id: "slide-down",
            title: "Go down the slide",
            prompt: "Look at the slide picture and say the action.",
            focus: "Sliding",
            cue: "Say, go down the slide.",
            example: "Go down the slide.",
            art: {
              kind: "scene",
              lead: "Slide",
              trail: "Go down",
              caption: "Go down slide",
              imageSrc: "/cards/social-scenes/slide-turn.jpg",
              imageAlt: "Child going down a playground slide"
            }
          }
        ]
      },
      {
        id: "snack_time",
        title: "Snack Time",
        description: "Practice asking for one food and one drink.",
        accent: "Snack",
        skills: ["Choose", "Ask"],
        calmNote: "Use one snack card and one short phrase.",
        cards: [
          {
            id: "snack-apple",
            title: "Apple, please",
            prompt: "Look at the apple card and ask for it.",
            focus: "Choosing food",
            cue: "Say, apple, please.",
            example: "Apple, please.",
            art: {
              kind: "scene",
              lead: "Apple",
              trail: "Please",
              caption: "Apple snack",
              imageSrc: "/cards/alphabet/apple.jpg",
              imageAlt: "Apple photo"
            }
          },
          {
            id: "snack-juice",
            title: "Juice, please",
            prompt: "Look at the juice card and ask for it.",
            focus: "Choosing a drink",
            cue: "Say, juice, please.",
            example: "Juice, please.",
            art: {
              kind: "scene",
              lead: "Juice",
              trail: "Please",
              caption: "Juice snack",
              imageSrc: "/cards/alphabet/juice.jpg",
              imageAlt: "Juice photo"
            }
          }
        ]
      },
      {
        id: "hello_time",
        title: "Hello Time",
        description: "Practice hello and goodbye with two greeting pictures.",
        accent: "Greeting",
        skills: ["Wave", "Hello"],
        calmNote: "Say one greeting, then pause.",
        cards: [
          {
            id: "hello-hi",
            title: "Hello",
            prompt: "Look at the picture and say hello.",
            focus: "Greeting",
            cue: "Say, hello.",
            example: "Hello.",
            art: {
              kind: "scene",
              lead: "Hello",
              trail: "Wave",
              caption: "Hello card",
              imageSrc: "/cards/social-scenes/hello.jpg",
              imageAlt: "Waving hello photo"
            }
          },
          {
            id: "hello-goodbye",
            title: "Goodbye",
            prompt: "Look at the picture and say goodbye.",
            focus: "Goodbye",
            cue: "Say, goodbye.",
            example: "Goodbye.",
            art: {
              kind: "scene",
              lead: "Goodbye",
              trail: "Bye",
              caption: "Goodbye card",
              imageSrc: "/cards/social-scenes/goodbye.jpg",
              imageAlt: "Child waving goodbye"
            }
          }
        ]
      },
      {
        id: "ask_for_help",
        title: "Ask for Help",
        description: "Practice saying help with one school picture at a time.",
        accent: "Help",
        skills: ["Notice", "Ask"],
        calmNote: "Keep the help words short and clear.",
        cards: [
          {
            id: "help-teacher",
            title: "I need help",
            prompt: "Look at the picture and ask for help.",
            focus: "Getting help",
            cue: "Say, I need help.",
            example: "I need help.",
            art: {
              kind: "scene",
              lead: "Help",
              trail: "I need help",
              caption: "Ask for help",
              imageSrc: "/cards/social-scenes/help.jpg",
              imageAlt: "Raised hand in a classroom"
            }
          },
          {
            id: "help-backpack",
            title: "I need my backpack",
            prompt: "Look at the backpack picture and say what you need.",
            focus: "Needing a backpack",
            cue: "Say, I need my backpack.",
            example: "I need my backpack.",
            art: {
              kind: "scene",
              lead: "Backpack",
              trail: "I need it",
              caption: "My backpack",
              imageSrc: "/cards/social-scenes/backpack-help.jpg",
              imageAlt: "Children selecting school backpacks"
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
