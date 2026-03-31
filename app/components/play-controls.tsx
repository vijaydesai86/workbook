"use client";

import { useEffect, useState } from "react";

type PlayControlsProps = {
  soundText: string;
  title: string;
};

function updateFlag(name: string, enabled: boolean) {
  if (typeof document === "undefined") {
    return;
  }

  document.documentElement.dataset[name] = enabled ? "on" : "off";
}

export function PlayControls({ soundText, title }: PlayControlsProps) {
  const [focusMode, setFocusMode] = useState(false);
  const [quietColors, setQuietColors] = useState(false);
  const [bigCards, setBigCards] = useState(false);
  const [reading, setReading] = useState(false);

  useEffect(() => {
    updateFlag("focusMode", focusMode);
  }, [focusMode]);

  useEffect(() => {
    updateFlag("quietColors", quietColors);
  }, [quietColors]);

  useEffect(() => {
    updateFlag("bigCards", bigCards);
  }, [bigCards]);

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined") {
        window.speechSynthesis?.cancel();
      }

      updateFlag("focusMode", false);
      updateFlag("quietColors", false);
      updateFlag("bigCards", false);
    };
  }, []);

  function handlePlaySound() {
    if (typeof window === "undefined" || typeof window.speechSynthesis === "undefined") {
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(soundText);
    utterance.rate = 0.8;
    utterance.pitch = 1.02;
    utterance.onstart = () => setReading(true);
    utterance.onend = () => setReading(false);
    utterance.onerror = () => setReading(false);
    window.speechSynthesis.speak(utterance);
  }

  return (
    <section className="calm-controls">
      <div>
        <div className="eyebrow">Calm controls</div>
        <h2>Adjust the play space</h2>
        <p className="subtle">The sound button uses the active card cue for {title}.</p>
      </div>
      <div className="calm-control-row">
        <button className="ghost-button" onClick={handlePlaySound} type="button">
          {reading ? "Playing..." : "Play sound"}
        </button>
        <button
          className={`ghost-button ${focusMode ? "toggle-on" : ""}`}
          onClick={() => setFocusMode((value) => !value)}
          type="button"
        >
          Focus view
        </button>
        <button
          className={`ghost-button ${quietColors ? "toggle-on" : ""}`}
          onClick={() => setQuietColors((value) => !value)}
          type="button"
        >
          Quiet colors
        </button>
        <button
          className={`ghost-button ${bigCards ? "toggle-on" : ""}`}
          onClick={() => setBigCards((value) => !value)}
          type="button"
        >
          Big cards
        </button>
      </div>
      <div className="support-note">Current card audio: {soundText}</div>
    </section>
  );
}
