export type ActivityItemKind = "exercise" | "support" | "prompt-pack" | "setting";

export type ActivityItem = {
  id: string;
  title: string;
  kind: ActivityItemKind;
  summary: string;
  steps: string[];
  tags: string[];
};

export type Activity = {
  id: string;
  title: string;
  category: string;
  summary: string;
  goal: string;
  sessionLength: string;
  workModeNote: string;
  trainModeNote: string;
  items: ActivityItem[];
};

export type Catalog = {
  updatedAt: string;
  activities: Activity[];
};

export type AddActivityChange = {
  type: "add-activity";
  activity: Activity;
};

export type AddItemsChange = {
  type: "add-items";
  activityId: string;
  activityTitle: string;
  items: ActivityItem[];
};

export type TrainingProposal = {
  headline: string;
  reasoning: string;
  changes: Array<AddActivityChange | AddItemsChange>;
  notes: string[];
};

export type ImageOverride = {
  cardId: string;
  imageSrc: string;
  imageAlt: string;
};

export type Customizations = {
  addedActivities: Activity[];
  addedItems: Array<{
    activityId: string;
    items: ActivityItem[];
  }>;
  history: Array<{
    appliedAt: string;
    headline: string;
  }>;
  imageOverrides: ImageOverride[];
};

