export type ActivityMeta = {
  emoji: string;
  shortLabel: string;
};

const knownMeta: Record<string, ActivityMeta> = {
  "alphabet-cards": { emoji: "🔤", shortLabel: "Letters" },
  "counting-cards": { emoji: "🔢", shortLabel: "Numbers" }
};

const fallbackMeta: ActivityMeta = { emoji: "🎮", shortLabel: "Game" };

export function getActivityMeta(activityId: string): ActivityMeta {
  return knownMeta[activityId] ?? fallbackMeta;
}
