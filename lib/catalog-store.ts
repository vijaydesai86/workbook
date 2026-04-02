import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { baseCatalog } from "@/lib/base-catalog";
import { customizationsSchema } from "@/lib/schema";
import { getSupabaseAdminClient } from "@/lib/supabase-admin";
import type { Activity, Catalog, Customizations, ImageOverride, TrainingProposal } from "@/lib/types";

const dataDir = path.join(process.cwd(), "data");
const customizationsFile = path.join(dataDir, "customizations.json");
const stateTable = "catalog_state";
const stateKey = "customizations";

const emptyCustomizations: Customizations = {
  addedActivities: [],
  addedItems: [],
  history: [],
  imageOverrides: []
};

function dedupeItems(items: Activity["items"]) {
  const seen = new Set<string>();

  return items.filter((item) => {
    if (seen.has(item.id)) {
      return false;
    }

    seen.add(item.id);
    return true;
  });
}

async function ensureCustomizationsFile() {
  await mkdir(dataDir, { recursive: true });

  try {
    await readFile(customizationsFile, "utf8");
  } catch {
    await writeFile(customizationsFile, JSON.stringify(emptyCustomizations, null, 2), "utf8");
  }
}

async function readCustomizationsFromFile() {
  await ensureCustomizationsFile();
  const raw = await readFile(customizationsFile, "utf8");
  return customizationsSchema.parse(JSON.parse(raw));
}

async function writeCustomizationsToFile(customizations: Customizations) {
  await ensureCustomizationsFile();
  await writeFile(customizationsFile, JSON.stringify(customizations, null, 2), "utf8");
}

async function readCustomizationsFromSupabase() {
  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from(stateTable)
    .select("value")
    .eq("key", stateKey)
    .maybeSingle();

  if (error) {
    throw new Error(`Unable to read customization state from Supabase: ${error.message}`);
  }

  if (!data) {
    return emptyCustomizations;
  }

  return customizationsSchema.parse(data.value);
}

async function writeCustomizationsToSupabase(customizations: Customizations) {
  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    return false;
  }

  const { error } = await supabase.from(stateTable).upsert(
    {
      key: stateKey,
      value: customizations,
      updated_at: new Date().toISOString()
    },
    {
      onConflict: "key"
    }
  );

  if (error) {
    throw new Error(`Unable to write customization state to Supabase: ${error.message}`);
  }

  return true;
}

async function readCustomizations() {
  const supabaseCustomizations = await readCustomizationsFromSupabase();

  if (supabaseCustomizations) {
    return supabaseCustomizations;
  }

  return readCustomizationsFromFile();
}

async function writeCustomizations(customizations: Customizations) {
  const wroteToSupabase = await writeCustomizationsToSupabase(customizations);

  if (wroteToSupabase) {
    return;
  }

  await writeCustomizationsToFile(customizations);
}

export async function getMergedCatalog(): Promise<Catalog> {
  const customizations = await readCustomizations();
  const activityMap = new Map<string, Activity>();

  for (const activity of baseCatalog.activities) {
    activityMap.set(activity.id, {
      ...activity,
      items: [...activity.items]
    });
  }

  for (const addedActivity of customizations.addedActivities) {
    const existing = activityMap.get(addedActivity.id);
    activityMap.set(addedActivity.id, {
      ...(existing ?? addedActivity),
      ...addedActivity,
      items: dedupeItems([...(existing?.items ?? []), ...addedActivity.items])
    });
  }

  for (const addition of customizations.addedItems) {
    const existing = activityMap.get(addition.activityId);

    if (!existing) {
      continue;
    }

    activityMap.set(addition.activityId, {
      ...existing,
      items: dedupeItems([...existing.items, ...addition.items])
    });
  }

  return {
    updatedAt: new Date().toISOString(),
    activities: [...activityMap.values()].sort((left, right) => left.title.localeCompare(right.title))
  };
}

export async function applyTrainingProposal(proposal: TrainingProposal) {
  const customizations = await readCustomizations();

  for (const change of proposal.changes) {
    if (change.type === "add-activity") {
      const existingIndex = customizations.addedActivities.findIndex(
        (activity) => activity.id === change.activity.id
      );

      if (existingIndex >= 0) {
        customizations.addedActivities[existingIndex] = {
          ...customizations.addedActivities[existingIndex],
          ...change.activity,
          items: dedupeItems([
            ...customizations.addedActivities[existingIndex].items,
            ...change.activity.items
          ])
        };
      } else {
        customizations.addedActivities.push(change.activity);
      }

      continue;
    }

    const existingEntry = customizations.addedItems.find(
      (entry) => entry.activityId === change.activityId
    );

    if (existingEntry) {
      existingEntry.items = dedupeItems([...existingEntry.items, ...change.items]);
    } else {
      customizations.addedItems.push({
        activityId: change.activityId,
        items: dedupeItems([...change.items])
      });
    }
  }

  customizations.history.push({
    appliedAt: new Date().toISOString(),
    headline: proposal.headline
  });

  await writeCustomizations(customizations);
}


export async function getActivityById(activityId: string) {
  const catalog = await getMergedCatalog();
  return catalog.activities.find((activity) => activity.id === activityId) ?? null;
}

export async function getImageOverrides(): Promise<ImageOverride[]> {
  const customizations = await readCustomizations();
  return customizations.imageOverrides;
}

export async function saveImageOverride(override: ImageOverride): Promise<void> {
  const customizations = await readCustomizations();
  const existing = customizations.imageOverrides.findIndex((o) => o.cardId === override.cardId);

  if (existing >= 0) {
    customizations.imageOverrides[existing] = override;
  } else {
    customizations.imageOverrides.push(override);
  }

  await writeCustomizations(customizations);
}
