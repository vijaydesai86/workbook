"use client";

import { useEffect, useMemo, useState } from "react";

type PlayControlsProps = {
  soundText: string;
  title: string;
};

const preferredVoiceNames = [
  "Samantha",
  "Google US English",
  "Google UK English Female",
  "Microsoft Ava Online (Natural)",
  "Microsoft Aria Online (Natural)",
  "Microsoft Sonia Online (Natural)",
  "Karen",
  "Moira"
];

function chooseVoice(voices: SpeechSynthesisVoice[]) {
  if (voices.length === 0) {
    return null;
  }

  for (const name of preferredVoiceNames) {
    const exact = voices.find((voice) => voice.name === name);
    if (exact) {
      return exact;
    }
  }

  const englishVoices = voices.filter((voice) => voice.lang.toLowerCase().startsWith("en"));
  const naturalVoice = englishVoices.find((voice) => /natural|neural|enhanced/i.test(voice.name));
  if (naturalVoice) {
    return naturalVoice;
  }

  return englishVoices[0] ?? voices[0] ?? null;
}

export function PlayControls({ soundText, title }: PlayControlsProps) {
  const [reading, setReading] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const selectedVoice = useMemo(() => chooseVoice(voices), [voices]);

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.speechSynthesis === "undefined") {
      return;
    }

    const synth = window.speechSynthesis;
    const updateVoices = () => setVoices(synth.getVoices());

    updateVoices();
    synth.addEventListener?.("voiceschanged", updateVoices);

    return () => {
      synth.cancel();
      synth.removeEventListener?.("voiceschanged", updateVoices);
    };
  }, []);

  function handlePlaySound() {
    if (typeof window === "undefined" || typeof window.speechSynthesis === "undefined") {
      return;
    }

    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(soundText.trim());
    utterance.lang = selectedVoice?.lang ?? "en-US";
    utterance.rate = 0.92;
    utterance.pitch = 1.03;
    utterance.volume = 1;

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    utterance.onstart = () => setReading(true);
    utterance.onend = () => setReading(false);
    utterance.onerror = () => setReading(false);

    synth.cancel();
    synth.speak(utterance);
  }

  return (
    <button aria-label={"Hear " + title} className="button play-sound-button" onClick={handlePlaySound} type="button">
      {reading ? "Playing..." : "Hear it"}
    </button>
  );
}
