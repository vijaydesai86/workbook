import type { Activity } from "@/lib/types";

export type ActivityPlayCard = {
  id: string;
  title: string;
  prompt: string;
  focus: string;
  cue: string;
  example: string;
};

export type ActivityPlayModule = {
  id: string;
  title: string;
  description: string;
  accent: string;
  cards: ActivityPlayCard[];
};

export type ActivityPlayConfig = {
  defaultModuleId: string;
  modules: ActivityPlayModule[];
};

const bespokeConfigs: Record<string, ActivityPlayConfig> = {
  "speech-training": {
    defaultModuleId: "single_letters",
    modules: [
      {
        id: "single_letters",
        title: "Single Letters",
        description: "Short articulation cards for one sound at a time.",
        accent: "Speech starter",
        cards: [
          {
            id: "letter-s",
            title: "S",
            prompt: "Say the sound /s/ slowly and keep the airflow steady.",
            focus: "Long quiet airflow",
            cue: "Smile slightly and keep the tongue behind the teeth.",
            example: "sss"
          },
          {
            id: "letter-m",
            title: "M",
            prompt: "Close the lips and hum /m/ before opening into a vowel.",
            focus: "Lips together first",
            cue: "Feel the buzz in the lips, then release slowly.",
            example: "mmm"
          },
          {
            id: "letter-p",
            title: "P",
            prompt: "Press the lips together, then pop the sound /p/ once.",
            focus: "Quick lip release",
            cue: "Use a tiny puff of air and keep the jaw relaxed.",
            example: "puh"
          }
        ]
      },
      {
        id: "sound_pairs",
        title: "Sound Pairs",
        description: "Move from one sound into a short pair such as sa, see, so.",
        accent: "Carryover",
        cards: [
          {
            id: "pair-sa",
            title: "sa",
            prompt: "Blend the sound /s/ into a short open vowel.",
            focus: "Smooth blend",
            cue: "Keep the /s/ going, then open into ah.",
            example: "sa"
          },
          {
            id: "pair-sho",
            title: "sho",
            prompt: "Say /sh/ and move straight into oh without stopping.",
            focus: "Rounded lips",
            cue: "Start with a quiet /sh/, then round the lips for oh.",
            example: "sho"
          },
          {
            id: "pair-ma",
            title: "ma",
            prompt: "Hum /m/ and release into ah in one calm motion.",
            focus: "One continuous motion",
            cue: "Keep the lips closed for m, then open gently.",
            example: "ma"
          }
        ]
      },
      {
        id: "home_phrases",
        title: "Home Phrases",
        description: "Use the target sound inside very short everyday phrases.",
        accent: "Daily use",
        cards: [
          {
            id: "phrase-more-water",
            title: "More water",
            prompt: "Say the short request clearly in one calm breath.",
            focus: "Steady pacing",
            cue: "Point to the item first, then say the phrase.",
            example: "More water"
          },
          {
            id: "phrase-my-turn",
            title: "My turn",
            prompt: "Say the phrase with a clear first word and pause after it.",
            focus: "Clear first consonant",
            cue: "Tap once before speaking to slow the start.",
            example: "My turn"
          },
          {
            id: "phrase-see-it",
            title: "See it",
            prompt: "Stretch the first sound lightly and keep the phrase short.",
            focus: "Crisp opening sound",
            cue: "Look at the object, then say the words together.",
            example: "See it"
          }
        ]
      }
    ]
  },
  "typing-lab": {
    defaultModuleId: "letter_lane",
    modules: [
      {
        id: "letter_lane",
        title: "Letter Lane",
        description: "One target key at a time with visual pacing.",
        accent: "Keyboard focus",
        cards: [
          {
            id: "type-a",
            title: "A",
            prompt: "Find the A key and press it once when ready.",
            focus: "One target only",
            cue: "Keep your eyes on the key, then tap once.",
            example: "A"
          },
          {
            id: "type-s",
            title: "S",
            prompt: "Say the key name aloud, then press it slowly.",
            focus: "Name then tap",
            cue: "Use the home row as your starting point.",
            example: "S"
          },
          {
            id: "type-d",
            title: "D",
            prompt: "Press D and watch the same letter appear on screen.",
            focus: "Cause and effect",
            cue: "Tap once, look up, then reset.",
            example: "D"
          }
        ]
      },
      {
        id: "word_builder",
        title: "Word Builder",
        description: "Build one short word from a sequence of known keys.",
        accent: "Word practice",
        cards: [
          {
            id: "word-sun",
            title: "sun",
            prompt: "Type the word sun one letter at a time.",
            focus: "Slow three-key sequence",
            cue: "Read the full word first, then type it.",
            example: "sun"
          },
          {
            id: "word-map",
            title: "map",
            prompt: "Type map and pause after each letter.",
            focus: "Pause between taps",
            cue: "Point to each letter before pressing it.",
            example: "map"
          },
          {
            id: "word-dog",
            title: "dog",
            prompt: "Type dog once, then replay it a second time.",
            focus: "Repeat with confidence",
            cue: "Keep the same pace on both tries.",
            example: "dog"
          }
        ]
      }
    ]
  },
  "social-scenes": {
    defaultModuleId: "greetings",
    modules: [
      {
        id: "greetings",
        title: "Greetings",
        description: "Short predictable openings for familiar people.",
        accent: "Conversation starter",
        cards: [
          {
            id: "hello-friend",
            title: "Hello",
            prompt: "Look up, wave once, and say hello.",
            focus: "Face + word",
            cue: "Count 1-2, then speak.",
            example: "Hello"
          },
          {
            id: "good-morning",
            title: "Good morning",
            prompt: "Use the full greeting in one calm voice.",
            focus: "Full phrase",
            cue: "Smile first, then start the words.",
            example: "Good morning"
          },
          {
            id: "how-are-you",
            title: "How are you?",
            prompt: "Ask the question and wait for one response.",
            focus: "Ask then wait",
            cue: "Hands still while the other person answers.",
            example: "How are you?"
          }
        ]
      },
      {
        id: "help_requests",
        title: "Help Requests",
        description: "Practice asking for help with one sentence and one repeat.",
        accent: "Support phrase",
        cards: [
          {
            id: "need-help",
            title: "I need help",
            prompt: "Say the full request clearly once.",
            focus: "Whole sentence",
            cue: "Point to the problem before speaking.",
            example: "I need help"
          },
          {
            id: "can-you-help",
            title: "Can you help me?",
            prompt: "Use the question and wait for the reply.",
            focus: "Question voice",
            cue: "Take one breath before the sentence.",
            example: "Can you help me?"
          },
          {
            id: "please-open",
            title: "Please open it",
            prompt: "Use the request phrase while showing the item.",
            focus: "Request with context",
            cue: "Hold the item still and speak once.",
            example: "Please open it"
          }
        ]
      }
    ]
  }
};

function createFallbackConfig(activity: Activity): ActivityPlayConfig {
  return {
    defaultModuleId: "guided_practice",
    modules: [
      {
        id: "guided_practice",
        title: "Guided Practice",
        description: "Play through the saved activity items one card at a time.",
        accent: activity.category,
        cards: activity.items.map((item, index) => ({
          id: item.id,
          title: item.title,
          prompt: item.summary,
          focus: item.steps[0] ?? `Step ${index + 1}`,
          cue: item.steps[1] ?? item.tags.join(", "),
          example: item.steps[2] ?? item.tags[0] ?? item.kind
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
