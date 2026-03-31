"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ActivityPosterScene } from "@/app/components/activity-scenes";
import { getPlayConfigForActivity } from "@/lib/play-config";
import type { Activity, Catalog } from "@/lib/types";

type WorkbookAppProps = {
  initialCatalog: Catalog;
};

function ActivityVisual({ activity }: { activity: Activity }) {
  const config = getPlayConfigForActivity(activity);
  const firstModule = config.modules[0];
  const fallbackArt = {
    kind: "letter" as const,
    lead: activity.title.slice(0, 1).toUpperCase(),
    caption: config.supportLine
  };

  return (
    <ActivityPosterScene
      art={firstModule?.cards[0]?.art ?? fallbackArt}
      badge={config.theme.badge}
      ink={config.theme.ink}
      primary={config.theme.primary}
      secondary={config.theme.secondary}
      surface={config.theme.surface}
      title={config.coverLabel}
    />
  );
}

export function WorkbookApp({ initialCatalog }: WorkbookAppProps) {
  const [selectedActivityId, setSelectedActivityId] = useState(initialCatalog.activities[0]?.id ?? "");

  useEffect(() => {
    if (initialCatalog.activities.some((activity) => activity.id === selectedActivityId) === false) {
      setSelectedActivityId(initialCatalog.activities[0]?.id ?? "");
    }
  }, [initialCatalog.activities, selectedActivityId]);

  const selectedActivity = useMemo(
    () => initialCatalog.activities.find((activity) => activity.id === selectedActivityId) ?? initialCatalog.activities[0],
    [initialCatalog.activities, selectedActivityId]
  );

  const selectedConfig = selectedActivity ? getPlayConfigForActivity(selectedActivity) : null;
  const featuredModule = selectedConfig?.modules[0] ?? null;
  const totalCards = selectedConfig?.modules.reduce((sum, module) => sum + module.cards.length, 0) ?? 0;
  const playHref = selectedActivity ? "/activities/" + selectedActivity.id + "/play?module=" + String(featuredModule?.id ?? "") : "/";

  return (
    <main className="app-shell kid-home-shell">
      <header className="app-topbar kid-topbar">
        <Link className="brand-mark" href="/">
          BrightPath Play
        </Link>
        <Link className="caregiver-link kid-adult-link" href="/caregiver">
          Adult area
        </Link>
      </header>

      {selectedActivity && selectedConfig ? (
        <section className="kid-home-stage">
          <div className="kid-home-main-card" style={{ backgroundColor: selectedConfig.theme.surface }}>
            <div className="kid-home-main-visual">
              <ActivityVisual activity={selectedActivity} />
            </div>

            <div className="kid-home-main-copy">
              <div className="eyebrow">Game</div>
              <h1>{selectedActivity.title}</h1>
              <p>{selectedConfig.supportLine}</p>
              <div className="kid-home-meta">
                <span className="soft-chip">{totalCards} cards</span>
                <span className="soft-chip">{featuredModule?.title}</span>
              </div>
              <div className="kid-home-main-actions">
                <Link className="button kid-main-button kid-home-play-button" href={playHref}>
                  Play
                </Link>
                <Link className="ghost-button kid-secondary-button" href={"/activities/" + selectedActivity.id}>
                  Open
                </Link>
              </div>
            </div>
          </div>

          <section className="kid-picker-panel" aria-label="Choose a game">
            <div className="kid-picker-head">
              <div className="eyebrow">Choose</div>
              <h2>Pick a game</h2>
            </div>

            <div className="kid-picker-rail">
              {initialCatalog.activities.map((activity) => {
                const config = getPlayConfigForActivity(activity);
                const isActive = activity.id === selectedActivity.id;

                return (
                  <button
                    className={"kid-picker-card " + (isActive ? "kid-picker-card-active" : "")}
                    key={activity.id}
                    onClick={() => setSelectedActivityId(activity.id)}
                    style={isActive ? { backgroundColor: config.theme.surface, borderColor: config.theme.primary } : undefined}
                    type="button"
                  >
                    <div className="kid-picker-card-visual">
                      <ActivityVisual activity={activity} />
                    </div>
                    <div className="kid-picker-card-copy">
                      <strong>{activity.title}</strong>
                      <span>{config.supportLine}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        </section>
      ) : null}

      <section className="caregiver-callout kid-caregiver-callout">
        <div>
          <div className="eyebrow">Adult area</div>
          <h2>Change cards here</h2>
          <p className="subtle">Add or update cards in the adult area.</p>
        </div>
        <Link className="ghost-button kid-secondary-button" href="/caregiver">
          Open adult area
        </Link>
      </section>
    </main>
  );
}
