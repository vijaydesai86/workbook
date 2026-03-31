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
    <main className="app-shell">
      <header className="app-topbar">
        <Link className="brand-mark" href="/">
          BrightPath Play
        </Link>
        <Link className="caregiver-link" href="/caregiver">
          Caregiver tools
        </Link>
      </header>

      <section className="landing-hero kid-hero">
        <div className="landing-copy">
          <div className="eyebrow">Kid-first activity space</div>
          <h1>Choose a visual activity and start playing right away.</h1>
          <p>
            Illustrated cards, calm sound cues, and clear play routes designed to feel safe,
            predictable, and inviting for children who need extra support.
          </p>
          <div className="hero-actions">
            {selectedActivity ? (
              <Link className="button hero-button" href={playHref}>
                Play {selectedActivity.title}
              </Link>
            ) : null}
            <a className="ghost-button" href="#activity-gallery">
              See activities
            </a>
          </div>
          <div className="hero-stats">
            <div className="hero-stat-card">
              <strong>{initialCatalog.activities.length}</strong>
              <span>clickable activities</span>
            </div>
            <div className="hero-stat-card">
              <strong>{totalModules}</strong>
              <span>play modules</span>
            </div>
            <div className="hero-stat-card">
              <strong>Sound</strong>
              <span>audio cue on every card</span>
            </div>
          </div>
        </div>

        <div className="hero-showcase">
          {selectedActivity ? <ActivityVisual activity={selectedActivity} /> : null}
          <div className="hero-helper-card">
            <div className="hero-helper-title">Friendly play routine</div>
            <div className="quick-chip-row">
              <span className="quick-chip">Pick one game</span>
              <span className="quick-chip">Tap play sound</span>
              <span className="quick-chip">Finish one card at a time</span>
            </div>
            <p className="subtle">The child flow stays focused on play. Caregiver setup lives separately.</p>
          </div>
        </div>
      </section>

      <section className="hub-grid">
        <div className="hub-main">
          <div className="section-head" id="activity-gallery">
            <div>
              <div className="eyebrow">Activities</div>
              <h2>Choose a game</h2>
            </div>
            <p className="subtle">Every activity has a visual cover, a clear open path, and a direct play button.</p>
          </div>

          <div className="activity-gallery">
            {initialCatalog.activities.map((activity) => {
              const config = getPlayConfigForActivity(activity);
              const isActive = activity.id === selectedActivity?.id;
              const cardClassName = "gallery-card " + (isActive ? "gallery-card-active" : "");

              return (
                <article className={cardClassName} key={activity.id}>
                  <button className="gallery-card-top" onClick={() => setSelectedActivityId(activity.id)} type="button">
                    <ActivityVisual activity={activity} />
                    <div className="gallery-card-copy">
                      <div className="meta-row">{activity.category}</div>
                      <h3>{activity.title}</h3>
                      <p className="subtle">{config.supportLine}</p>
                    </div>
                  </button>
                  <div className="gallery-card-meta">
                    <span className="soft-chip">{activity.sessionLength}</span>
                    <span className="soft-chip">{config.modules.length} modes</span>
                    <span className="soft-chip">{config.theme.mascot}</span>
                  </div>
                  <div className="gallery-card-actions">
                    <Link className="ghost-button" href={"/activities/" + activity.id}>
                      Open
                    </Link>
                    <Link className="button" href={"/activities/" + activity.id + "/play"}>
                      Play now
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <aside className="hub-side">
          {selectedActivity && selectedConfig ? (
            <section className="focus-panel" style={{ backgroundColor: selectedConfig.theme.surface }}>
              <div className="focus-top">
                <div>
                  <div className="eyebrow">Selected activity</div>
                  <h2>{selectedActivity.title}</h2>
                </div>
                <span className="soft-chip" style={{ backgroundColor: selectedConfig.theme.badge }}>
                  {selectedConfig.coverLabel}
                </span>
              </div>
              <p className="subtle">{selectedConfig.audience}</p>

              <div className="focus-module-card" style={{ borderColor: selectedConfig.theme.secondary }}>
                <div className="meta-row">Start here</div>
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
                <div className="gallery-card-actions">
                  <Link className="button" href={playHref}>
                    Start {featuredModule?.title}
                  </Link>
                </div>
              </div>

              <div className="focus-module-list">
                {selectedConfig.modules.map((module) => (
                  <Link className="focus-module-link" href={"/activities/" + selectedActivity.id + "/play?module=" + module.id} key={module.id}>
                    <div>
                      <strong>{module.title}</strong>
                      <div className="subtle">{module.description}</div>
                    </div>
                    <span className="soft-chip">{module.cards.length} cards</span>
                  </Link>
                ))}
              </div>
            </section>
          ) : null}
        </aside>
      </section>

      <section className="caregiver-callout">
        <div>
          <div className="eyebrow">For adults only</div>
          <h2>Need to add more cards or modules later?</h2>
          <p className="subtle">
            Open the caregiver area to request new content with AI. It stays outside the child-facing
            play flow.
          </p>
        </div>
        <Link className="ghost-button" href="/caregiver">
          Open caregiver studio
        </Link>
      </section>
    </main>
  );
}
