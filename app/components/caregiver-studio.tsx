"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, useTransition } from "react";
import { getPlayConfigForActivity } from "@/lib/play-config";
import type { Catalog, TrainingProposal } from "@/lib/types";

type CaregiverStudioProps = {
  initialCatalog: Catalog;
};

const suggestionPrompts = [
  "Add three more playground social scene cards for waiting and turn-taking.",
  "Add more alphabet picture cards that stay concrete and child-friendly.",
  "Extend snack time with more food and drink choice cards."
];

export function CaregiverStudio({ initialCatalog }: CaregiverStudioProps) {
  const [catalog, setCatalog] = useState(initialCatalog);
  const [prompt, setPrompt] = useState(suggestionPrompts[0]);
  const [lastPrompt, setLastPrompt] = useState("");
  const [proposal, setProposal] = useState<TrainingProposal | null>(null);
  const [status, setStatus] = useState("");
  const [source, setSource] = useState("");
  const [isGenerating, startGenerating] = useTransition();
  const [isApplying, startApplying] = useTransition();

  const activitySummaries = useMemo(
    () =>
      catalog.activities.map((activity) => ({
        id: activity.id,
        title: activity.title,
        modules: getPlayConfigForActivity(activity).modules.length,
        sessionLength: activity.sessionLength
      })),
    [catalog]
  );

  useEffect(() => {
    if (!proposal) {
      setSource("");
    }
  }, [proposal]);

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
      setLastPrompt(prompt);

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
        setStatus("Proposal ready. Review it, then apply only if it fits the child-facing product.");
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
      setStatus("Applying proposal to the saved catalog...");

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
        setStatus("Catalog updated. The child-facing activity hub will use the new static content.");
      } catch (error) {
        setStatus(error instanceof Error ? error.message : "Apply request failed.");
      }
    });
  }

  return (
    <main className="app-shell caregiver-shell">
      <header className="app-topbar">
        <Link className="brand-mark" href="/">
          BrightPath Play
        </Link>
        <Link className="ghost-button" href="/">
          Back to activity hub
        </Link>
      </header>

      <section className="caregiver-hero">
        <div className="caregiver-hero-copy">
          <div className="eyebrow">Caregiver studio</div>
          <h1>Add more content without changing the child flow.</h1>
          <p>
            Use AI here to extend the saved activity sets, add more cards, or create new modules.
            This area stays separate so the child only sees the play experience.
          </p>
        </div>
        <div className="caregiver-summary-card">
          <div className="meta-row">Current library</div>
          <strong>{catalog.activities.length} activities</strong>
          <span className="subtle">Each update becomes static content in work mode after you apply it.</span>
        </div>
      </section>

      <section className="caregiver-grid">
        <section className="trainer-panel caregiver-panel">
          <div className="section-head">
            <div>
              <div className="eyebrow">AI request</div>
              <h2>Ask for a structured addition</h2>
            </div>
          </div>
          <p className="subtle">Keep requests specific. Ask for more scene cards, more alphabet pictures, or more items inside an existing set.</p>
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

          <div className="trainer-thread">
            {lastPrompt ? (
              <article className="trainer-bubble trainer-bubble-user">
                <div className="meta-row">You asked</div>
                <p>{lastPrompt}</p>
              </article>
            ) : null}

            {proposal ? (
              <article className="trainer-bubble trainer-bubble-ai">
                <div className="meta-row">AI proposal</div>
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
              </article>
            ) : (
              <div className="empty-state">No proposal yet. This area is only for adult setup and content growth.</div>
            )}
          </div>
        </section>

        <aside className="caregiver-side-panel caregiver-panel">
          <div className="section-head">
            <div>
              <div className="eyebrow">Existing activities</div>
              <h2>Build onto what is already there</h2>
            </div>
          </div>
          <div className="caregiver-activity-list">
            {activitySummaries.map((activity) => (
              <article className="caregiver-activity-card" key={activity.id}>
                <strong>{activity.title}</strong>
                <div className="quick-chip-row">
                  <span className="soft-chip">{activity.sessionLength}</span>
                  <span className="soft-chip">{activity.modules} modules</span>
                </div>
              </article>
            ))}
          </div>
          <div className="support-note">
            Best results come from concrete requests such as adding more playground scenes, more
            snack choices, or more alphabet picture cards.
          </div>
        </aside>
      </section>
    </main>
  );
}
