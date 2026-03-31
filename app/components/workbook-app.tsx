"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, useTransition } from "react";
import { getPlayConfigForActivity } from "@/lib/play-config";
import type { Catalog, TrainingProposal } from "@/lib/types";

type WorkbookAppProps = {
  initialCatalog: Catalog;
};

const suggestionPrompts = [
  "Add three home speech warm-ups for /s/ and /sh/ practice.",
  "Extend typing practice with visual cue packs for early learners.",
  "Add a new activity for turn-taking during short conversations."
];

export function WorkbookApp({ initialCatalog }: WorkbookAppProps) {
  const [catalog, setCatalog] = useState(initialCatalog);
  const [mode, setMode] = useState<"work" | "train">("work");
  const [selectedActivityId, setSelectedActivityId] = useState(
    initialCatalog.activities[0]?.id ?? ""
  );
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
    () =>
      catalog.activities.find((activity) => activity.id === selectedActivityId) ??
      catalog.activities[0],
    [catalog.activities, selectedActivityId]
  );

  const selectedPlayConfig = selectedActivity ? getPlayConfigForActivity(selectedActivity) : null;

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
    <main className="page-shell">
      <section className="hero">
        <div className="hero-card hero">
          <div>
            <p className="eyebrow">Social Workbook</p>
            <h1>Clickable activities, dedicated detail pages, and a real play flow.</h1>
            <p style={{ marginTop: 18 }}>
              The homepage now acts like an activity hub: open an activity, launch its play screen,
              and keep train mode focused on adding structured content rather than inventing random
              new product behavior.
            </p>
            <div className="mode-row">
              <button
                className={`mode-chip ${mode === "work" ? "active" : ""}`}
                onClick={() => setMode("work")}
                type="button"
              >
                <strong>Work mode</strong>
                <small>Open fixed activities and run their play screens.</small>
              </button>
              <button
                className={`mode-chip ${mode === "train" ? "active" : ""}`}
                onClick={() => setMode("train")}
                type="button"
              >
                <strong>Train mode</strong>
                <small>Ask Copilot to extend existing activities and review the proposal.</small>
              </button>
            </div>
          </div>
        </div>

        <div className="hero-grid">
          <div className="hero-card hero-stat">
            <strong>{catalog.activities.length} activities</strong>
            <span className="tagline">Each activity now has its own detail page and play entry.</span>
          </div>
          <div className="hero-card hero-stat">
            <strong>{catalog.activities.reduce((sum, activity) => sum + getPlayConfigForActivity(activity).modules.length, 0)} modules</strong>
            <span className="tagline">Speech, typing, and social modules with card-by-card play.</span>
          </div>
          <div className="hero-card hero-stat">
            <strong>{mode === "train" ? "Editable" : "Stable"}</strong>
            <span className="tagline">
              {mode === "train"
                ? "Generate additions, review them, then save them into work mode."
                : "Use the activity library as a fixed, predictable tool."}
            </span>
          </div>
        </div>
      </section>

      <section className="workspace">
        <aside className="panel">
          <div className="sidebar-head">
            <h2 style={{ marginBottom: 6 }}>Activity library</h2>
            <div className="subtle">
              Choose an activity to preview it here, then open its dedicated page or jump straight
              into play.
            </div>
          </div>
          <div className="sidebar-list">
            {catalog.activities.map((activity) => {
              const playConfig = getPlayConfigForActivity(activity);

              return (
                <article
                  className={`activity-card ${activity.id === selectedActivity?.id ? "active" : ""}`}
                  key={activity.id}
                >
                  <button
                    className="card-surface"
                    onClick={() => setSelectedActivityId(activity.id)}
                    type="button"
                  >
                    <div className="meta-row">{activity.category}</div>
                    <h3>{activity.title}</h3>
                    <div className="subtle">{activity.summary}</div>
                    <div className="pill-row" style={{ marginTop: 12 }}>
                      <span className="pill">{activity.sessionLength}</span>
                      <span className="pill">{activity.items.length} items</span>
                      <span className="pill">{playConfig.modules.length} modules</span>
                    </div>
                  </button>
                  <div className="card-actions">
                    <Link className="ghost-button" href={`/activities/${activity.id}`}>
                      Open activity
                    </Link>
                    <Link className="button" href={`/activities/${activity.id}/play`}>
                      Play
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </aside>

        <div className="detail-grid">
          {selectedActivity ? (
            <>
              <section className="panel">
                <div className="detail-head">
                  <div>
                    <div className="meta-row">{selectedActivity.category}</div>
                    <h2>{selectedActivity.title}</h2>
                    <p className="subtle" style={{ maxWidth: 760 }}>
                      {selectedActivity.summary}
                    </p>
                  </div>
                  <div className="pill-row">
                    <span className="pill">{selectedActivity.goal}</span>
                    <span className="pill">{selectedActivity.sessionLength}</span>
                  </div>
                </div>

                <div className="page-actions" style={{ marginTop: 18 }}>
                  <Link className="ghost-button" href={`/activities/${selectedActivity.id}`}>
                    Open full activity page
                  </Link>
                  <Link className="button" href={`/activities/${selectedActivity.id}/play`}>
                    Play {selectedActivity.title}
                  </Link>
                </div>

                <div className="content-grid" style={{ marginTop: 20 }}>
                  <div>
                    <h3 style={{ marginTop: 0 }}>Available items</h3>
                    <div className="item-grid">
                      {selectedActivity.items.map((item) => (
                        <article className="item-card" key={item.id}>
                          <div className="meta-row">{item.kind}</div>
                          <h3>{item.title}</h3>
                          <div className="subtle">{item.summary}</div>
                          <ul>
                            {item.steps.map((step) => (
                              <li key={step}>{step}</li>
                            ))}
                          </ul>
                        </article>
                      ))}
                    </div>
                  </div>

                  <div className="session-card">
                    <div className="meta-row">Playable modules</div>
                    <h3>{selectedPlayConfig?.modules.length ?? 0} modules ready</h3>
                    <div className="callout">
                      {mode === "work" ? selectedActivity.workModeNote : selectedActivity.trainModeNote}
                    </div>
                    <ul className="module-list">
                      {selectedPlayConfig?.modules.map((module) => (
                        <li key={module.id}>
                          <Link href={`/activities/${selectedActivity.id}/play?module=${module.id}`}>
                            {module.title}
                          </Link>{" "}
                          <span className="subtle">{module.description}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </section>

              {mode === "train" ? (
                <section className="content-grid">
                  <div className="console">
                    <div className="meta-row">Train mode console</div>
                    <h3>Ask for structured additions</h3>
                    <p className="subtle">
                      Extend an existing activity, add more speech items, or create one more aligned
                      module without breaking the fixed work-mode flow.
                    </p>
                    <div className="suggestion-row" style={{ marginTop: 12 }}>
                      {suggestionPrompts.map((suggestion) => (
                        <button
                          className={`ghost-button ${prompt === suggestion ? "active" : ""}`}
                          key={suggestion}
                          onClick={() => setPrompt(suggestion)}
                          type="button"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                    <textarea
                      aria-label="Training prompt"
                      onChange={(event) => setPrompt(event.target.value)}
                      value={prompt}
                    />
                    <div className="button-row">
                      <button className="button" disabled={isGenerating} onClick={handleGenerate} type="button">
                        {isGenerating ? "Generating..." : "Generate proposal"}
                      </button>
                      <span className="subtle">{status}</span>
                    </div>
                  </div>

                  <div className="proposal-card">
                    <div className="meta-row">Proposal preview</div>
                    {proposal ? (
                      <>
                        <h3>{proposal.headline}</h3>
                        <p className="subtle">{proposal.reasoning}</p>
                        <div className="proposal-list">
                          {proposal.changes.map((change, index) => (
                            <div className="proposal-entry" key={`${change.type}-${index}`}>
                              {change.type === "add-activity" ? (
                                <>
                                  <strong>New activity: {change.activity.title}</strong>
                                  <div className="subtle">{change.activity.summary}</div>
                                </>
                              ) : (
                                <>
                                  <strong>Extend {change.activityTitle}</strong>
                                  <ul>
                                    {change.items.map((item) => (
                                      <li key={item.id}>{item.title}</li>
                                    ))}
                                  </ul>
                                </>
                              )}
                            </div>
                          ))}
                        </div>
                        <div className="button-row">
                          <button className="button" disabled={isApplying} onClick={handleApply} type="button">
                            {isApplying ? "Applying..." : "Apply to catalog"}
                          </button>
                          <span className="subtle">Source: {source}</span>
                        </div>
                      </>
                    ) : (
                      <div className="empty">
                        No proposal yet. Generate one from the console, review it here, then apply it.
                      </div>
                    )}
                  </div>
                </section>
              ) : null}
            </>
          ) : (
            <section className="panel">
              <div className="empty">No activities are available yet.</div>
            </section>
          )}
        </div>
      </section>
    </main>
  );
}
