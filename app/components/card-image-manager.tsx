"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { getPlayConfigForActivity } from "@/lib/play-config";
import type { Activity } from "@/lib/types";

type CardState = {
  imageSrc: string;
  status: "idle" | "saving" | "saved" | "error";
  message: string;
};

type Props = {
  activities: Activity[];
};

export function CardImageManager({ activities }: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingCardId, setEditingCardId] = useState<string | null>(null);
  const [cardStates, setCardStates] = useState<Record<string, CardState>>({});
  const [urlInputs, setUrlInputs] = useState<Record<string, string>>({});
  const [altInputs, setAltInputs] = useState<Record<string, string>>({});
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});

  function getCardState(cardId: string, defaultSrc: string): CardState {
    return cardStates[cardId] ?? { imageSrc: defaultSrc, status: "idle", message: "" };
  }

  function setCard(cardId: string, update: Partial<CardState>) {
    setCardStates((prev) => ({ ...prev, [cardId]: { ...getCardState(cardId, ""), ...update } }));
  }

  async function handleSave(cardId: string, currentSrc: string) {
    const file = fileRefs.current[cardId]?.files?.[0] ?? null;
    const url = (urlInputs[cardId] ?? "").trim();
    const imageAlt = (altInputs[cardId] ?? "").trim() || cardId;

    if (!file && !url) {
      setCard(cardId, { status: "error", message: "Upload a photo or paste a URL." });
      return;
    }

    setCard(cardId, { status: "saving", message: "Saving…", imageSrc: currentSrc });

    const formData = new FormData();
    formData.append("cardId", cardId);
    formData.append("imageAlt", imageAlt);

    if (file) {
      formData.append("file", file);
    } else {
      formData.append("imageUrl", url);
    }

    try {
      const response = await fetch("/api/image-override", { method: "POST", body: formData });
      const payload = (await response.json()) as { ok?: boolean; imageSrc?: string; error?: string };

      if (response.ok && payload.imageSrc) {
        setCard(cardId, { status: "saved", message: "Image saved!", imageSrc: payload.imageSrc });
        setEditingCardId(null);
        setUrlInputs((prev) => ({ ...prev, [cardId]: "" }));

        if (fileRefs.current[cardId]) {
          fileRefs.current[cardId]!.value = "";
        }
      } else {
        setCard(cardId, {
          status: "error",
          message: payload.error ?? "Could not save. Try again.",
          imageSrc: currentSrc
        });
      }
    } catch {
      setCard(cardId, { status: "error", message: "Network error. Try again.", imageSrc: currentSrc });
    }
  }

  return (
    <section className="cim-shell">
      <div className="cim-header">
        <h2 className="cim-title">Card images</h2>
        <p className="cim-desc">
          Pick any card to upload a clearer photo. Changes save immediately and appear next time the child plays.
        </p>
      </div>

      {activities.map((activity) => {
        const config = getPlayConfigForActivity(activity);
        const isOpen = expandedId === activity.id;

        return (
          <div className="cim-activity" key={activity.id}>
            <button
              className={"cim-activity-toggle " + (isOpen ? "cim-activity-toggle-open" : "")}
              onClick={() => setExpandedId(isOpen ? null : activity.id)}
              type="button"
            >
              <strong>{activity.title}</strong>
              <span className="cim-toggle-icon">{isOpen ? "▲" : "▼"}</span>
            </button>

            {isOpen ? (
              <div className="cim-cards-grid">
                {config.modules.flatMap((module) =>
                  module.cards.map((card) => {
                    const state = getCardState(card.id, card.art.imageSrc ?? "");
                    const displaySrc = state.imageSrc || card.art.imageSrc;
                    const isEditing = editingCardId === card.id;

                    return (
                      <div className="cim-card" key={card.id}>
                        <div className="cim-card-thumb">
                          {displaySrc ? (
                            <Image
                              alt={card.title}
                              className="cim-card-img"
                              fill
                              sizes="120px"
                              src={displaySrc}
                              unoptimized={displaySrc.startsWith("http")}
                            />
                          ) : (
                            <div className="cim-card-no-img">
                              {card.art.trail ?? card.art.lead.slice(0, 2)}
                            </div>
                          )}
                        </div>

                        <div className="cim-card-info">
                          <span className="cim-card-name">{card.title}</span>

                          {state.status === "saved" ? (
                            <span className="cim-status-saved">✓ Saved</span>
                          ) : state.status === "error" ? (
                            <span className="cim-status-error">{state.message}</span>
                          ) : null}

                          {!isEditing ? (
                            <button
                              className="cim-change-btn"
                              onClick={() => {
                                setEditingCardId(card.id);
                                setCard(card.id, { status: "idle", message: "", imageSrc: displaySrc ?? "" });
                              }}
                              type="button"
                            >
                              Change photo
                            </button>
                          ) : (
                            <div className="cim-editor">
                              <label className="cim-label" htmlFor={"file-" + card.id}>
                                Upload photo
                              </label>
                              <input
                                accept="image/jpeg,image/png,image/webp"
                                className="cim-file-input"
                                id={"file-" + card.id}
                                onChange={() => {
                                  // Clear URL when a file is chosen so there's no ambiguity
                                  setUrlInputs((prev) => ({ ...prev, [card.id]: "" }));
                                }}
                                ref={(el) => {
                                  fileRefs.current[card.id] = el;
                                }}
                                type="file"
                              />

                              <label className="cim-label" htmlFor={"url-" + card.id}>
                                Or paste an image URL
                              </label>
                              <input
                                className="cim-url-input"
                                id={"url-" + card.id}
                                onChange={(e) =>
                                  setUrlInputs((prev) => ({ ...prev, [card.id]: e.target.value }))
                                }
                                placeholder="https://example.com/photo.jpg"
                                type="url"
                                value={urlInputs[card.id] ?? ""}
                              />

                              <label className="cim-label" htmlFor={"alt-" + card.id}>
                                Describe the photo (for screen readers)
                              </label>
                              <input
                                className="cim-url-input"
                                id={"alt-" + card.id}
                                onChange={(e) =>
                                  setAltInputs((prev) => ({ ...prev, [card.id]: e.target.value }))
                                }
                                placeholder={card.title + " photo"}
                                type="text"
                                value={altInputs[card.id] ?? ""}
                              />

                              <div className="cim-editor-actions">
                                <button
                                  className="cim-save-btn"
                                  disabled={state.status === "saving"}
                                  onClick={() => handleSave(card.id, displaySrc ?? "")}
                                  type="button"
                                >
                                  {state.status === "saving" ? "Saving…" : "Save photo"}
                                </button>
                                <button
                                  className="cim-cancel-btn"
                                  onClick={() => setEditingCardId(null)}
                                  type="button"
                                >
                                  Cancel
                                </button>
                              </div>

                              {state.status === "error" ? (
                                <p className="cim-status-error">{state.message}</p>
                              ) : null}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            ) : null}
          </div>
        );
      })}
    </section>
  );
}
