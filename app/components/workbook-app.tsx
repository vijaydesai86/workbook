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

      <section className="landing-hero kid-hero-home">
        <div className="landing-copy kid-hero-copy">
          <div className="eyebrow">Choose a picture game</div>
          <h1>Big cards. Calm sound. Easy play.</h1>
          <p>
            Tap one picture game and move through it one card at a time. The words stay short,
            the layout stays steady, and every card has matching audio.
          </p>
          <div className="hero-actions kid-hero-actions">
            {selectedActivity ? (
              <Link className="button hero-button kid-main-button" href={playHref}>
                Play {selectedActivity.title}
              </Link>
            ) : null}
            <a className="ghost-button kid-secondary-button" href="#activity-gallery">
              See the cards
            </a>
          </div>
          <div className="kid-how-row" aria-label="How to play">
            <div className="kid-how-card">
              <strong>1</strong>
              <span>Pick a card set</span>
            </div>
            <div className="kid-how-card">
              <strong>2</strong>
              <span>Tap hear</span>
            </div>
            <div className="kid-how-card">
              <strong>3</strong>
              <span>Say it back</span>
            </div>
          </div>
        </div>

        <div className="hero-showcase kid-hero-showcase">
          {selectedActivity ? <ActivityVisual activity={selectedActivity} /> : null}
          {selectedActivity && selectedConfig ? (
            <div className="hero-helper-card kid-hero-helper kid-selected-helper">
              <div className="hero-helper-title">Ready now</div>
              <h2>{selectedActivity.title}</h2>
              <p className="subtle">{selectedConfig.supportLine}</p>
              <div className="quick-chip-row">
                <span className="quick-chip">{totalCards} cards</span>
                <span className="quick-chip">{selectedConfig.theme.mascot}</span>
                <span className="quick-chip">real photos</span>
              </div>
            </div>
          ) : null}
        </div>
      </section>

      <section className="hub-grid kid-hub-grid">
        <div className="hub-main">
          <div className="section-head kid-section-head" id="activity-gallery">
            <div>
              <div className="eyebrow">Pick one</div>
              <h2>Picture games</h2>
            </div>
          </div>

          <div className="activity-gallery kid-activity-gallery">
            {initialCatalog.activities.map((activity) => {
              const config = getPlayConfigForActivity(activity);
              const isActive = activity.id === selectedActivity?.id;
              const cardClassName = "gallery-card kid-gallery-card " + (isActive ? "gallery-card-active kid-gallery-card-active" : "");

              return (
                <article className={cardClassName} key={activity.id}>
                  <button className="gallery-card-top kid-gallery-top" onClick={() => setSelectedActivityId(activity.id)} type="button">
                    <ActivityVisual activity={activity} />
                    <div className="gallery-card-copy kid-gallery-copy">
                      <h3>{activity.title}</h3>
                      <p className="subtle">{config.supportLine}</p>
                    </div>
                  </button>
                  <div className="gallery-card-actions kid-gallery-actions">
                    <Link className="ghost-button kid-secondary-button" href={"/activities/" + activity.id}>
                      Look first
                    </Link>
                    <Link className="button kid-main-button" href={"/activities/" + activity.id + "/play"}>
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
            <section className="focus-panel kid-focus-panel" style={{ backgroundColor: selectedConfig.theme.surface }}>
              <div className="focus-top kid-focus-top">
                <div>
                  <div className="eyebrow">Play next</div>
                  <h2>{selectedActivity.title}</h2>
                </div>
                <span className="soft-chip" style={{ backgroundColor: selectedConfig.theme.badge }}>
                  {selectedConfig.coverLabel}
                </span>
              </div>

              <div className="focus-module-card kid-start-card" style={{ borderColor: selectedConfig.theme.secondary }}>
                <p className="kid-card-kicker">Start with</p>
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
                    Start here
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
                    <span className="soft-chip">{module.cards.length} cards</span>
                  </Link>
                ))}
              </div>
            </section>
          ) : null}
        </aside>
      </section>

      <section className="caregiver-callout kid-caregiver-callout">
        <div>
          <div className="eyebrow">Adult tools</div>
          <h2>Train or add new cards later</h2>
          <p className="subtle">The child play space stays simple. Caregiver controls stay separate.</p>
        </div>
        <Link className="ghost-button kid-secondary-button" href="/caregiver">
          Open adult tools
        </Link>
      </section>
    </main>
  );
}
