"use client";

import { useEffect, useState } from "react";

type PlayControlsProps = {
  soundText: string;
  title: string;
};

export function PlayControls({ soundText, title }: PlayControlsProps) {
  const [reading, setReading] = useState(false);

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined") {
        window.speechSynthesis?.cancel();
      }
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
    <div className="play-sound-panel">
      <button className="button play-sound-button" onClick={handlePlaySound} type="button">
        {reading ? "Playing..." : "Play sound"}
      </button>
      <p className="subtle">Audio for {title}: {soundText}</p>
    </div>
  );
}
