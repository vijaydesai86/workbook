import type { Activity } from "@/lib/types";

export type CountingSetId = "apples" | "mixed";

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
  imagePosition?: string;
  imageScale?: number;
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

type PlayConfigOptions = {
  countingSet?: string | null;
};

type AlphabetSeed = {
  letter: string;
  word: string;
};

type CountSeed = {
  value: number;
  objectLabel: string;
  cardLabel: string;
  imageSrc: string;
  imageAlt: string;
  imagePosition?: string;
  imageScale?: number;
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

const appleCountSeeds: CountSeed[] = Array.from({ length: 20 }, (_, index) => ({
  value: index + 1,
  objectLabel: index === 0 ? "apple" : "apples",
  cardLabel: "Apple",
  imageSrc: "/cards/alphabet/apple.jpg",
  imageAlt: "Apple photo"
}));

const mixedCountSeeds: CountSeed[] = [
  {
    value: 1,
    objectLabel: "apple",
    cardLabel: "Apple",
    imageSrc: "/cards/alphabet/apple.jpg",
    imageAlt: "Apple photo"
  },
  {
    value: 2,
    objectLabel: "balls",
    cardLabel: "Ball",
    imageSrc: "/cards/alphabet/ball.jpg",
    imageAlt: "Ball photo",
    imagePosition: "34% 58%",
    imageScale: 1.18
  },
  {
    value: 3,
    objectLabel: "cats",
    cardLabel: "Cat",
    imageSrc: "/cards/alphabet/cat.jpg",
    imageAlt: "Cat photo"
  },
  {
    value: 4,
    objectLabel: "dogs",
    cardLabel: "Dog",
    imageSrc: "/cards/alphabet/dog.jpg",
    imageAlt: "Dog photo"
  },
  {
    value: 5,
    objectLabel: "eggs",
    cardLabel: "Egg",
    imageSrc: "/cards/alphabet/egg.jpg",
    imageAlt: "Egg photo"
  },
  {
    value: 6,
    objectLabel: "fish",
    cardLabel: "Fish",
    imageSrc: "/cards/alphabet/fish.jpg",
    imageAlt: "Fish photo",
    imagePosition: "50% 46%",
    imageScale: 1.24
  },
  {
    value: 7,
    objectLabel: "houses",
    cardLabel: "House",
    imageSrc: "/cards/alphabet/house.jpg",
    imageAlt: "House photo"
  },
  {
    value: 8,
    objectLabel: "ice creams",
    cardLabel: "Ice Cream",
    imageSrc: "/cards/alphabet/ice-cream.jpg",
    imageAlt: "Ice cream photo",
    imagePosition: "14% 28%",
    imageScale: 1.3
  },
  {
    value: 9,
    objectLabel: "juice glasses",
    cardLabel: "Juice",
    imageSrc: "/cards/alphabet/juice.jpg",
    imageAlt: "Juice photo",
    imagePosition: "36% 52%",
    imageScale: 1.16
  },
  {
    value: 10,
    objectLabel: "moons",
    cardLabel: "Moon",
    imageSrc: "/cards/alphabet/moon.jpg",
    imageAlt: "Moon photo"
  },
  {
    value: 11,
    objectLabel: "nests",
    cardLabel: "Nest",
    imageSrc: "/cards/alphabet/nest.jpg",
    imageAlt: "Nest photo"
  },
  {
    value: 12,
    objectLabel: "pears",
    cardLabel: "Pear",
    imageSrc: "/cards/alphabet/pear.jpg",
    imageAlt: "Pear photo",
    imagePosition: "50% 20%",
    imageScale: 1.12
  },
  {
    value: 13,
    objectLabel: "quilts",
    cardLabel: "Quilt",
    imageSrc: "/cards/alphabet/quilt.jpg",
    imageAlt: "Quilt photo"
  },
  {
    value: 14,
    objectLabel: "rainbows",
    cardLabel: "Rainbow",
    imageSrc: "/cards/alphabet/rainbow.jpg",
    imageAlt: "Rainbow photo",
    imagePosition: "18% 55%",
    imageScale: 1.14
  },
  {
    value: 15,
    objectLabel: "suns",
    cardLabel: "Sun",
    imageSrc: "/cards/alphabet/sun.jpg",
    imageAlt: "Sun photo"
  },
  {
    value: 16,
    objectLabel: "umbrellas",
    cardLabel: "Umbrella",
    imageSrc: "/cards/alphabet/umbrella.jpg",
    imageAlt: "Umbrella photo",
    imagePosition: "22% 28%",
    imageScale: 1.24
  },
  {
    value: 17,
    objectLabel: "vans",
    cardLabel: "Van",
    imageSrc: "/cards/alphabet/van.jpg",
    imageAlt: "Van photo"
  },
  {
    value: 18,
    objectLabel: "flowers",
    cardLabel: "Flower",
    imageSrc: "/cards/alphabet/leaf.jpg",
    imageAlt: "Flower photo",
    imagePosition: "64% 50%",
    imageScale: 1.18
  },
  {
    value: 19,
    objectLabel: "zebras",
    cardLabel: "Zebra",
    imageSrc: "/cards/alphabet/zebra.jpg",
    imageAlt: "Zebra photo",
    imagePosition: "58% 46%",
    imageScale: 1.08
  },
  {
    value: 20,
    objectLabel: "oranges",
    cardLabel: "Orange",
    imageSrc: "/cards/alphabet/orange.jpg",
    imageAlt: "Orange photo",
    imagePosition: "74% 40%",
    imageScale: 1.18
  }
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

function createCountingCards(range: [number, number], countingSet: CountingSetId): ActivityPlayCard[] {
  const sourceSeeds = countingSet === "mixed" ? mixedCountSeeds : appleCountSeeds;

  return sourceSeeds
    .filter((seed) => seed.value >= range[0] && seed.value <= range[1])
    .map((seed) => {
      const numberWord = numberWords[seed.value - 1];
      const phrase = numberWord + " " + seed.objectLabel;

      return {
        id: countingSet + "-count-" + String(seed.value),
        title: phrase,
        prompt: "Count the " + seed.objectLabel + " and say the whole number phrase.",
        focus: "Number " + String(seed.value),
        cue: "Say, " + phrase + ".",
        example: phrase + ".",
        art: {
          kind: "count",
          lead: phrase,
          trail: String(seed.value),
          caption: seed.cardLabel + " count card",
          imageSrc: seed.imageSrc,
          imageAlt: seed.imageAlt,
          imagePosition: seed.imagePosition,
          imageScale: seed.imageScale,
          count: seed.value
        }
      };
    });
}

const alphabetConfig: ActivityPlayConfig = {
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
};

function createCountingConfig(countingSet: CountingSetId): ActivityPlayConfig {
  return {
    defaultModuleId: "count_1_10",
    coverLabel: "Counting Cards",
    supportLine: "Count from 1 to 20 with either the same apple cards or a different real-photo object on each number card.",
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
        accent: countingSet === "mixed" ? "Number photos" : "Apple cards",
        skills: ["Look", "Count", "Say"],
        calmNote: "Point to each picture as you count.",
        cards: createCountingCards([1, 10], countingSet)
      },
      {
        id: "count_11_20",
        title: "Count 11 to 20",
        description: "Move to larger groups once the child is ready.",
        accent: countingSet === "mixed" ? "Number photos" : "Apple cards",
        skills: ["Look", "Count", "Say"],
        calmNote: "Count across the card slowly from left to right.",
        cards: createCountingCards([11, 20], countingSet)
      }
    ]
  };
}

const bespokeConfigs: Record<string, ActivityPlayConfig> = {
  "alphabet-cards": alphabetConfig
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

export function getCountingSetId(requestedSet?: string | null): CountingSetId {
  return requestedSet === "mixed" ? "mixed" : "apples";
}

export function getPlayConfigForActivity(activity: Activity, options?: PlayConfigOptions): ActivityPlayConfig {
  if (activity.id === "counting-cards") {
    return createCountingConfig(getCountingSetId(options?.countingSet));
  }

  return bespokeConfigs[activity.id] ?? createFallbackConfig(activity);
}

export function getPlayModule(config: ActivityPlayConfig, requestedModuleId?: string | null) {
  return (
    config.modules.find((module) => module.id === requestedModuleId) ??
    config.modules.find((module) => module.id === config.defaultModuleId) ??
    config.modules[0]
  );
}
