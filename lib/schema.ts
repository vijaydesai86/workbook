import { z } from "zod";

const activityItemSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  kind: z.enum(["exercise", "support", "prompt-pack", "setting"]),
  summary: z.string().min(1),
  steps: z.array(z.string().min(1)).min(1),
  tags: z.array(z.string().min(1)).min(1)
});

const activitySchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  category: z.string().min(1),
  summary: z.string().min(1),
  goal: z.string().min(1),
  sessionLength: z.string().min(1),
  workModeNote: z.string().min(1),
  trainModeNote: z.string().min(1),
  items: z.array(activityItemSchema).min(1)
});

export const imageOverrideSchema = z.object({
  cardId: z.string().min(1),
  imageSrc: z.string().min(1),
  imageAlt: z.string()
});

export const trainingProposalSchema = z.object({
  headline: z.string().min(1),
  reasoning: z.string().min(1),
  changes: z
    .array(
      z.discriminatedUnion("type", [
        z.object({
          type: z.literal("add-activity"),
          activity: activitySchema
        }),
        z.object({
          type: z.literal("add-items"),
          activityId: z.string().min(1),
          activityTitle: z.string().min(1),
          items: z.array(activityItemSchema).min(1)
        })
      ])
    )
    .min(1),
  notes: z.array(z.string().min(1))
});

export const customizationsSchema = z.object({
  addedActivities: z.array(activitySchema),
  addedItems: z.array(
    z.object({
      activityId: z.string().min(1),
      items: z.array(activityItemSchema)
    })
  ),
  history: z.array(
    z.object({
      appliedAt: z.string().min(1),
      headline: z.string().min(1)
    })
  ),
  imageOverrides: z.array(imageOverrideSchema).default([])
});

