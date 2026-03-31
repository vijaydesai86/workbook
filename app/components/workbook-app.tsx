"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, useTransition } from "react";
import { getPlayConfigForActivity } from "@/lib/play-config";
import type { Activity, Catalog, TrainingProposal } from "@/lib/types";

type WorkbookAppProps = {
  initialCatalog: Catalog;
};

const suggestionPrompts = [
  "Add three home speech warm-ups for /s/ and /sh/ practice.",
  "Extend typing practice with more calm visual cue packs.",
  "Add more choice-making cards for social scenes."
];

function ActivityVisual({ activity }: { activity: Activity }) {
  const config = getPlayConfigForActivity(activity);
  const firstModule = config.modules[0];
  const firstCard = firstModule?.cards[0];

  return (
    <div
      className="activity-visual"
      style={{
        background: `linear-gradient(135deg, ${config.theme.secondary}, ${config.theme.surface})`,
        color: config.theme.ink
      }}
    >
      <div className="activity-visual-badge" style={{ backgroundColor: config.theme.badge }}>
        {config.coverLabel}
      </div>
      <div className="activity-visual-main" style={{ color: config.theme.primary }}>
        {firstCard?.art.lead ?? activity.title.slice(0, 2).toUpperCase()}
      </div>
      <div className="activity-visual-caption">{firstCard?.art.caption ?? config.supportLine}</div>
    </div>
  );
}

export function WorkbookApp({ initialCatalog }: WorkbookAppProps) {
  const [catalog, setCatalog] = useState(initialCatalog);
  const [mode, setMode] = useState<"work" | "train">("work");
  const [selectedActivityId, setSelectedActivityId] = useState(initialCatalog.activities[0]?.id ?? "");
  const [prompt, setPrompt] = useState(suggestionPrompts[0]);
  const [proposal, setProposal] = useState<TrainingProposal | null>(null);
  const [status, setStatus] = useState<string>("");
  const [source, setSource] = useState<string>("");
  const [isGenerating, startGenerating] = useTransition();
  const [isApplying, startApplying] = useTransition();

  useEffect(() => {
    if (!catalog.activities.some((activity) => activity.id === selectedActivityId)) {
      setSelectedActivityId(catalog.activities[0]?.id ?? "");
    }
  }, [catalog.activities, selectedActivityId]);

  const selectedActivity = useMemo(
    () => catalog.activities.find((activity) => activity.id === selectedActivityId) ?? catalog.activities[0],
    [catalog.activities, selectedActivityId]
  );

  const selectedConfig = selectedActivity ? getPlayConfigForActivity(selectedActivity) : null;
  const featuredModule = selectedConfig?.modules[0] ?? null;

  async function refreshCatalog() {
    const response = await fetch("/api/catalog", { cache: "no-store" });

    if (!response.ok) {
      throw new Error("Unable to refresh catalog.");
    }

    const nextCatalog = (await response.json()) as Catalog;
    setCatalog(nextCatalog);
  }

  function handleGenerate() {
    startGenerating(async () => {
      setStatus("Generating a structured proposal...");
      setProposal(null);

      try {
        const response = await fetch("/api/train", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ prompt })
        });

        const payload = await response.json();

        if (!response.ok) {
          throw new Error(payload.error ?? "Training request failed.");
        }

        setProposal(payload.proposal as TrainingProposal);
        setSource(payload.source as string);
        setStatus("Proposal ready. Review and apply if it looks right.");
      } catch (error) {
        setStatus(error instanceof Error ? error.message : "Training request failed.");
      }
    });
  }

  function handleApply() {
    if (!proposal) {
      return;
    }

    startApplying(async () => {
      setStatus("Applying proposal to the local catalog...");

      try {
        const response = await fetch("/api/apply", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ proposal })
        });

        const payload = await response.json();

        if (!response.ok) {
          throw new Error(payload.error ?? "Apply request failed.");
        }

        await refreshCatalog();
        setProposal(null);
        setStatus("Catalog updated. Work mode now uses the new static content.");
      } catch (error) {
        setStatus(error instanceof Error ? error.message : "Apply request failed.");
      }
    });
  }

  return (
    <main className="app-shell">
      <section className="landing-hero">
        <div className="landing-copy">
          <div className="eyebrow">Calm Activity Hub</div>
          <h1>Play first. Keep it visual. Keep it predictable.</h1>
          <p>
            Choose a game, open one module, and move through large visual cards designed for children
            who need simple routines, low-pressure prompts, and sensory-friendly pacing.
          </p>
          <div className="hero-actions">
            <button
              className={`mode-pill ${mode === "work" ? "mode-pill-active" : ""}`}
              onClick={() => setMode("work")}
              type="button"
            >
              Work mode
            </button>
            <button
              className={`mode-pill ${mode === "train" ? "mode-pill-active" : ""}`}
              onClick={() => setMode("train")}
              type="button"
            >
              Train mode
            </button>
          </div>
          <div className="hero-stats">
            <div className="hero-stat-card">
              <strong>{catalog.activities.length}</strong>
              <span>clickable activities</span>
            </div>
            <div className="hero-stat-card">
              <strong>{catalog.activities.reduce((sum, activity) => sum + getPlayConfigForActivity(activity).modules.length, 0)}</strong>
              <span>play modules</span>
            </div>
            <div className="hero-stat-card">
              <strong>Calm</strong>
              <span>no timers, no failure walls</span>
            </div>
          </div>
        </div>

        <div className="hero-showcase">
          {selectedActivity ? <ActivityVisual activity={selectedActivity} /> : null}
          <div className="hero-helper-card">
            <div className="hero-helper-title">Kittu-style quick help</div>
            <div className="quick-chip-row">
              <span className="quick-chip">Speech home practice</span>
              <span className="quick-chip">Sensory-friendly routine</span>
              <span className="quick-chip">Choice making prompts</span>
              <span className="quick-chip">Keyboard warm-up</span>
            </div>
            <p className="subtle">Short, structured prompts instead of long walls of text.</p>
          </div>
        </div>
      </section>

      <section className="hub-grid">
        <div className="hub-main">
          <div className="section-head">
            <div>
              <div className="eyebrow">Activities</div>
              <h2>Choose a game</h2>
            </div>
            <p className="subtle">Large cards, simple routes, and a visible play button on each activity.</p>
          </div>

          <div className="activity-gallery">
            {catalog.activities.map((activity) => {
              const config = getPlayConfigForActivity(activity);
              const isActive = activity.id === selectedActivity?.id;

              return (
                <article className={`gallery-card ${isActive ? "gallery-card-active" : ""}`} key={activity.id}>
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
                    <Link className="ghost-button" href={`/activities/${activity.id}`}>
                      Open
                    </Link>
                    <Link className="button" href={`/activities/${activity.id}/play`}>
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
                    <span className="quick-chip" key={skill}>{skill}</span>
                  ))}
                </div>
                <div className="support-note">{featuredModule?.calmNote}</div>
                <div className="gallery-card-actions">
                  <Link className="button" href={`/activities/${selectedActivity.id}/play?module=${featuredModule?.id ?? ""}`}>
                    Start {featuredModule?.title}
                  </Link>
                </div>
              </div>

              <div className="focus-module-list">
                {selectedConfig.modules.map((module) => (
                  <Link className="focus-module-link" href={`/activities/${selectedActivity.id}/play?module=${module.id}`} key={module.id}>
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

          {mode === "train" ? (
            <section className="trainer-panel">
              <div className="section-head">
                <div>
                  <div className="eyebrow">Train mode</div>
                  <h2>Extend the saved content</h2>
                </div>
              </div>
              <p className="subtle">Use this only to add more items or modules. The child-facing product stays in work mode.</p>
              <div className="quick-chip-row">
                {suggestionPrompts.map((suggestion) => (
                  <button
                    className={`quick-chip-button ${prompt === suggestion ? "quick-chip-button-active" : ""}`}
                    key={suggestion}
                    onClick={() => setPrompt(suggestion)}
                    type="button"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
              <textarea aria-label="Training prompt" onChange={(event) => setPrompt(event.target.value)} value={prompt} />
              <div className="gallery-card-actions">
                <button className="button" disabled={isGenerating} onClick={handleGenerate} type="button">
                  {isGenerating ? "Generating..." : "Generate proposal"}
                </button>
                <span className="subtle">{status}</span>
              </div>
              <div className="proposal-box">
                {proposal ? (
                  <>
                    <h3>{proposal.headline}</h3>
                    <p className="subtle">{proposal.reasoning}</p>
                    <div className="proposal-change-list">
                      {proposal.changes.map((change, index) => (
                        <div className="proposal-change" key={`${change.type}-${index}`}>
                          {change.type === "add-activity" ? (
                            <>
                              <strong>New activity: {change.activity.title}</strong>
                              <div className="subtle">{change.activity.summary}</div>
                            </>
                          ) : (
                            <>
                              <strong>Extend {change.activityTitle}</strong>
                              <div className="subtle">{change.items.map((item) => item.title).join(", ")}</div>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="gallery-card-actions">
                      <button className="button" disabled={isApplying} onClick={handleApply} type="button">
                        {isApplying ? "Applying..." : "Apply to catalog"}
                      </button>
                      <span className="subtle">Source: {source}</span>
                    </div>
                  </>
                ) : (
                  <div className="empty-state">No proposal yet. Training stays separate from the child-facing play flow.</div>
                )}
              </div>
            </section>
          ) : null}
        </aside>
      </section>
    </main>
  );
}
