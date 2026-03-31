"use client";

import { useEffect, useMemo, useState } from "react";

type PlayControlsProps = {
  soundText: string;
  title: string;
};

const preferredVoiceNames = [
  "Samantha",
  "Google UK English Female",
  "Google US English",
  "Microsoft Ava Online (Natural)",
  "Microsoft Aria Online (Natural)",
  "Microsoft Libby Online (Natural)",
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
  const naturalVoice = englishVoices.find((voice) => /natural|neural|enhanced|premium/i.test(voice.name));
  if (naturalVoice) {
    return naturalVoice;
  }

  const femaleVoice = englishVoices.find((voice) => /female|woman|girl/i.test(voice.name));
  if (femaleVoice) {
    return femaleVoice;
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
    utterance.rate = 0.88;
    utterance.pitch = 1;
    utterance.volume = 1;

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    utterance.onstart = () => setReading(true);
    utterance.onend = () => setReading(false);
    utterance.onerror = () => setReading(false);

    synth.cancel();
    window.setTimeout(() => synth.speak(utterance), 40);
  }

  return (
    <button aria-label={"Hear " + title} className="button play-sound-button" onClick={handlePlaySound} type="button">
      {reading ? "Playing..." : "Hear card"}
    </button>
  );
}
