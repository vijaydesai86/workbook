"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
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
            <h1>Train new activity content, then lock it into a predictable work mode.</h1>
            <p style={{ marginTop: 18 }}>
              This prototype mirrors the activity-hub pattern from SocialDiverse: guided practice
              modules, a narrow communication support focus, and a train mode that adds structured
              content without turning the main tool into free-form chat.
            </p>
            <div className="mode-row">
              <button
                className={`mode-chip ${mode === "work" ? "active" : ""}`}
                onClick={() => setMode("work")}
                type="button"
              >
                <strong>Work mode</strong>
                <small>Browse and use the saved catalog as a static tool.</small>
              </button>
              <button
                className={`mode-chip ${mode === "train" ? "active" : ""}`}
                onClick={() => setMode("train")}
                type="button"
              >
                <strong>Train mode</strong>
                <small>Use Copilot to propose additions to activities and packs.</small>
              </button>
            </div>
          </div>
        </div>

        <div className="hero-grid">
          <div className="hero-card hero-stat">
            <strong>{catalog.activities.length} activities</strong>
            <span className="tagline">Typing, speech practice, and guided social scenes.</span>
          </div>
          <div className="hero-card hero-stat">
            <strong>{catalog.activities.reduce((sum, activity) => sum + activity.items.length, 0)} items</strong>
            <span className="tagline">Structured steps that carry into work mode after approval.</span>
          </div>
          <div className="hero-card hero-stat">
            <strong>{mode === "train" ? "Editable" : "Stable"}</strong>
            <span className="tagline">
              {mode === "train"
                ? "AI suggestions stay gated behind review and apply."
                : "No live LLM calls. The tool runs on the saved catalog only."}
            </span>
          </div>
        </div>
      </section>

      <section className="workspace">
        <aside className="panel">
          <div className="sidebar-head">
            <h2 style={{ marginBottom: 6 }}>Activity library</h2>
            <div className="subtle">
              Seeded from the same general space as SocialDiverse: practice-based, structured, and
              easy to extend in controlled ways.
            </div>
          </div>
          <div className="sidebar-list">
            {catalog.activities.map((activity) => (
              <button
                className={`activity-card ${activity.id === selectedActivity?.id ? "active" : ""}`}
                key={activity.id}
                onClick={() => setSelectedActivityId(activity.id)}
                type="button"
              >
                <div className="meta-row">{activity.category}</div>
                <h3>{activity.title}</h3>
                <div className="subtle">{activity.summary}</div>
                <div className="pill-row" style={{ marginTop: 12 }}>
                  <span className="pill">{activity.sessionLength}</span>
                  <span className="pill">{activity.items.length} items</span>
                </div>
              </button>
            ))}
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
                    <div className="meta-row">{mode === "work" ? "Current behavior" : "Mode behavior"}</div>
                    <h3>{mode === "work" ? "Static session sheet" : "Training boundaries"}</h3>
                    <div className="callout">
                      {mode === "work" ? selectedActivity.workModeNote : selectedActivity.trainModeNote}
                    </div>
                    <ol>
                      <li>Pick one item from the activity library.</li>
                      <li>Use the listed steps as written.</li>
                      <li>In train mode, review proposed additions before saving them.</li>
                    </ol>
                  </div>
                </div>
              </section>

              {mode === "train" ? (
                <section className="content-grid">
                  <div className="console">
                    <div className="meta-row">Train mode console</div>
                    <h3>Ask for structured additions</h3>
                    <p className="subtle">
                      Keep prompts narrow: add speech packs, extend typing supports, or create one
                      aligned new activity. The output is saved only after you apply it.
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
