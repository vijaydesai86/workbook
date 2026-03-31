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
  const totalModules = initialCatalog.activities.reduce(
    (sum, activity) => sum + getPlayConfigForActivity(activity).modules.length,
    0
  );
  const playHref = selectedActivity ? "/activities/" + selectedActivity.id + "/play?module=" + String(featuredModule?.id ?? "") : "/";

  return (
    <main className="app-shell kid-home-shell">
      <header className="app-topbar kid-topbar">
        <Link className="brand-mark" href="/">
          BrightPath Play
        </Link>
        <Link className="caregiver-link" href="/caregiver">
          Caregiver tools
        </Link>
      </header>

      <section className="landing-hero kid-hero-home">
        <div className="landing-copy kid-hero-copy">
          <div className="eyebrow">Pick a game</div>
          <h1>Tap a big card and start.</h1>
          <p>
            Real photo cards, calm sound, and easy next buttons made for children who do better with
            simple steps and clear choices.
          </p>
          <div className="hero-actions kid-hero-actions">
            {selectedActivity ? (
              <Link className="button hero-button kid-main-button" href={playHref}>
                Start {selectedActivity.title}
              </Link>
            ) : null}
            <a className="ghost-button kid-secondary-button" href="#activity-gallery">
              See games
            </a>
          </div>
          <div className="kid-how-row">
            <div className="kid-how-card">
              <strong>1</strong>
              <span>Pick</span>
            </div>
            <div className="kid-how-card">
              <strong>2</strong>
              <span>Hear</span>
            </div>
            <div className="kid-how-card">
              <strong>3</strong>
              <span>Say</span>
            </div>
          </div>
        </div>

        <div className="hero-showcase kid-hero-showcase">
          {selectedActivity ? <ActivityVisual activity={selectedActivity} /> : null}
          <div className="hero-helper-card kid-hero-helper">
            <div className="hero-helper-title">Ready to play</div>
            <div className="quick-chip-row">
              <span className="quick-chip">{initialCatalog.activities.length} games</span>
              <span className="quick-chip">{totalModules} parts</span>
              <span className="quick-chip">sound on every card</span>
            </div>
          </div>
        </div>
      </section>

      <section className="hub-grid kid-hub-grid">
        <div className="hub-main">
          <div className="section-head kid-section-head" id="activity-gallery">
            <div>
              <div className="eyebrow">Games</div>
              <h2>Choose one to play</h2>
            </div>
          </div>

          <div className="activity-gallery kid-activity-gallery">
            {initialCatalog.activities.map((activity) => {
              const config = getPlayConfigForActivity(activity);
              const isActive = activity.id === selectedActivity?.id;
              const cardClassName = "gallery-card kid-gallery-card " + (isActive ? "gallery-card-active kid-gallery-card-active" : "");

              return (
                <article className={cardClassName} key={activity.id}>
                  <button className="gallery-card-top" onClick={() => setSelectedActivityId(activity.id)} type="button">
                    <ActivityVisual activity={activity} />
                    <div className="gallery-card-copy kid-gallery-copy">
                      <h3>{activity.title}</h3>
                      <p className="subtle">{config.supportLine}</p>
                    </div>
                  </button>
                  <div className="gallery-card-actions kid-gallery-actions">
                    <Link className="ghost-button kid-secondary-button" href={"/activities/" + activity.id}>
                      Open
                    </Link>
                    <Link className="button kid-main-button" href={"/activities/" + activity.id + "/play"}>
                      Play
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <aside className="hub-side">
          {selectedActivity && selectedConfig ? (
            <section className="focus-panel kid-focus-panel" style={{ backgroundColor: selectedConfig.theme.surface }}>
              <div className="focus-top">
                <div>
                  <div className="eyebrow">Start here</div>
                  <h2>{selectedActivity.title}</h2>
                </div>
                <span className="soft-chip" style={{ backgroundColor: selectedConfig.theme.badge }}>
                  {selectedConfig.coverLabel}
                </span>
              </div>

              <div className="focus-module-card kid-start-card" style={{ borderColor: selectedConfig.theme.secondary }}>
                <h3>{featuredModule?.title}</h3>
                <p className="subtle">{featuredModule?.description}</p>
                <div className="quick-chip-row">
                  {featuredModule?.skills.map((skill) => (
                    <span className="quick-chip" key={skill}>
                      {skill}
                    </span>
                  ))}
                </div>
                <div className="support-note">{featuredModule?.calmNote}</div>
                <div className="gallery-card-actions kid-gallery-actions">
                  <Link className="button kid-main-button" href={playHref}>
                    Start now
                  </Link>
                </div>
              </div>

              <div className="focus-module-list">
                {selectedConfig.modules.map((module) => (
                  <Link className="focus-module-link kid-focus-link" href={"/activities/" + selectedActivity.id + "/play?module=" + module.id} key={module.id}>
                    <div>
                      <strong>{module.title}</strong>
                      <div className="subtle">{module.description}</div>
                    </div>
                    <span className="soft-chip">{module.cards.length}</span>
                  </Link>
                ))}
              </div>
            </section>
          ) : null}
        </aside>
      </section>

      <section className="caregiver-callout kid-caregiver-callout">
        <div>
          <div className="eyebrow">For adults</div>
          <h2>Add or train new cards later</h2>
          <p className="subtle">Caregiver tools stay separate from the child play space.</p>
        </div>
        <Link className="ghost-button kid-secondary-button" href="/caregiver">
          Open caregiver studio
        </Link>
      </section>
    </main>
  );
}
