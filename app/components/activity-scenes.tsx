import type { ActivityArt } from "@/lib/play-config";

type SharedSceneProps = {
  art: ActivityArt;
  primary: string;
  secondary: string;
  surface: string;
  ink: string;
  badge: string;
};

type PosterSceneProps = SharedSceneProps & {
  title: string;
};

type PlaySceneProps = SharedSceneProps & {
  focus: string;
  cue: string;
  example: string;
};

type IconKind =
  | "apple"
  | "cracker"
  | "car"
  | "ball"
  | "cup"
  | "music"
  | "sun"
  | "keyboard"
  | "chat"
  | "spark";

function pickIcon(value?: string): IconKind {
  const normalized = (value ?? "").toLowerCase();

  if (normalized.includes("apple")) return "apple";
  if (normalized.includes("cracker")) return "cracker";
  if (normalized.includes("car")) return "car";
  if (normalized.includes("ball")) return "ball";
  if (normalized.includes("water") || normalized.includes("drink")) return "cup";
  if (normalized.includes("song") || normalized.includes("wheels") || normalized.includes("rainbow")) return "music";
  if (normalized.includes("morning") || normalized.includes("hello")) return "sun";
  if (normalized.includes("key") || normalized.includes("type") || normalized.includes("tap")) return "keyboard";
  if (normalized.includes("help") || normalized.includes("turn") || normalized.includes("need") || normalized.includes("hello")) return "chat";

  return "spark";
}

function PictureIcon({ kind, primary, secondary }: { kind: IconKind; primary: string; secondary: string }) {
  if (kind === "apple") {
    return (
      <svg aria-hidden="true" className="scene-icon" viewBox="0 0 80 80">
        <circle cx="40" cy="42" fill={secondary} r="24" stroke={primary} strokeWidth="4" />
        <path d="M40 14 C44 20 44 28 40 32" fill="none" stroke={primary} strokeLinecap="round" strokeWidth="4" />
        <path d="M40 18 C52 10 60 14 62 22 C52 24 44 24 40 18" fill={primary} opacity="0.24" />
      </svg>
    );
  }

  if (kind === "cracker") {
    return (
      <svg aria-hidden="true" className="scene-icon" viewBox="0 0 80 80">
        <rect fill={secondary} height="40" rx="12" stroke={primary} strokeWidth="4" width="46" x="17" y="20" />
        <circle cx="30" cy="34" fill={primary} r="2.8" />
        <circle cx="40" cy="40" fill={primary} r="2.8" />
        <circle cx="50" cy="34" fill={primary} r="2.8" />
        <circle cx="34" cy="48" fill={primary} r="2.8" />
        <circle cx="46" cy="48" fill={primary} r="2.8" />
      </svg>
    );
  }

  if (kind === "car") {
    return (
      <svg aria-hidden="true" className="scene-icon" viewBox="0 0 80 80">
        <path d="M20 46 L28 32 H52 L60 46 V54 H20 Z" fill={secondary} stroke={primary} strokeLinejoin="round" strokeWidth="4" />
        <circle cx="28" cy="56" fill="white" r="6" stroke={primary} strokeWidth="4" />
        <circle cx="52" cy="56" fill="white" r="6" stroke={primary} strokeWidth="4" />
      </svg>
    );
  }

  if (kind === "ball") {
    return (
      <svg aria-hidden="true" className="scene-icon" viewBox="0 0 80 80">
        <circle cx="40" cy="40" fill={secondary} r="24" stroke={primary} strokeWidth="4" />
        <path d="M24 30 C34 40 34 40 24 50" fill="none" stroke={primary} strokeWidth="4" />
        <path d="M56 30 C46 40 46 40 56 50" fill="none" stroke={primary} strokeWidth="4" />
      </svg>
    );
  }

  if (kind === "cup") {
    return (
      <svg aria-hidden="true" className="scene-icon" viewBox="0 0 80 80">
        <path d="M26 24 H54 L50 58 H30 Z" fill={secondary} stroke={primary} strokeLinejoin="round" strokeWidth="4" />
        <path d="M46 18 L54 10" fill="none" stroke={primary} strokeLinecap="round" strokeWidth="4" />
      </svg>
    );
  }

  if (kind === "music") {
    return (
      <svg aria-hidden="true" className="scene-icon" viewBox="0 0 80 80">
        <path d="M34 20 V52 C34 58 28 62 22 62 C16 62 12 58 12 54 C12 48 18 44 24 44 C27 44 30 45 34 47 V28 L60 22 V44 C60 50 54 54 48 54 C42 54 38 50 38 46 C38 40 44 36 50 36 C53 36 56 37 60 39 V18 Z" fill={secondary} stroke={primary} strokeLinejoin="round" strokeWidth="4" />
      </svg>
    );
  }

  if (kind === "sun") {
    return (
      <svg aria-hidden="true" className="scene-icon" viewBox="0 0 80 80">
        <circle cx="40" cy="40" fill={secondary} r="18" stroke={primary} strokeWidth="4" />
        <path d="M40 10 V20 M40 60 V70 M10 40 H20 M60 40 H70 M19 19 L26 26 M54 54 L61 61 M19 61 L26 54 M54 26 L61 19" fill="none" stroke={primary} strokeLinecap="round" strokeWidth="4" />
      </svg>
    );
  }

  if (kind === "keyboard") {
    return (
      <svg aria-hidden="true" className="scene-icon" viewBox="0 0 80 80">
        <rect fill={secondary} height="42" rx="10" stroke={primary} strokeWidth="4" width="52" x="14" y="20" />
        <path d="M22 34 H58 M22 46 H58 M30 26 V54 M42 26 V54 M54 26 V54" fill="none" opacity="0.6" stroke={primary} strokeWidth="3" />
      </svg>
    );
  }

  if (kind === "chat") {
    return (
      <svg aria-hidden="true" className="scene-icon" viewBox="0 0 80 80">
        <path d="M16 18 H50 C58 18 64 24 64 32 V40 C64 48 58 54 50 54 H34 L22 64 V54 H16 C8 54 2 48 2 40 V32 C2 24 8 18 16 18 Z" fill={secondary} stroke={primary} strokeLinejoin="round" strokeWidth="4" />
        <circle cx="24" cy="36" fill={primary} r="3" />
        <circle cx="34" cy="36" fill={primary} r="3" />
        <circle cx="44" cy="36" fill={primary} r="3" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" className="scene-icon" viewBox="0 0 80 80">
      <path d="M40 10 L47 28 L66 28 L51 40 L56 58 L40 47 L24 58 L29 40 L14 28 L33 28 Z" fill={secondary} stroke={primary} strokeLinejoin="round" strokeWidth="4" />
    </svg>
  );
}

function SceneSticker({ label, icon, primary, secondary }: { label: string; icon: IconKind; primary: string; secondary: string }) {
  return (
    <div className="scene-sticker" style={{ backgroundColor: "white", borderColor: primary }}>
      <PictureIcon kind={icon} primary={primary} secondary={secondary} />
      <span>{label}</span>
    </div>
  );
}

function SceneCharacters({ primary, secondary }: { primary: string; secondary: string }) {
  return (
    <div className="scene-characters">
      <div className="scene-character-card" style={{ backgroundColor: "white", borderColor: primary }}>
        <div className="scene-face" style={{ backgroundColor: secondary }}>
          <span />
          <span />
          <div className="scene-smile" style={{ borderColor: primary }} />
        </div>
      </div>
      <div className="scene-character-card" style={{ backgroundColor: "white", borderColor: primary }}>
        <div className="scene-face" style={{ backgroundColor: secondary }}>
          <span />
          <span />
          <div className="scene-smile" style={{ borderColor: primary }} />
        </div>
      </div>
    </div>
  );
}

function SceneBoard({ art, primary, secondary, surface, badge, playMode }: SharedSceneProps & { playMode: boolean }) {
  const leadIcon = pickIcon(art.lead);
  const trailIcon = pickIcon(art.trail ?? art.caption);

  if (art.kind === "keyboard") {
    return (
      <div className={`scene-stage scene-stage-${playMode ? "play" : "cover"}`} style={{ background: `linear-gradient(160deg, ${surface}, white)` }}>
        <div className="scene-glow" style={{ backgroundColor: secondary }} />
        <div className="scene-device" style={{ borderColor: primary }}>
          <div className="scene-device-screen" style={{ background: `linear-gradient(160deg, ${secondary}, white)` }}>
            <div className="scene-device-badge" style={{ backgroundColor: badge, color: primary }}>{art.caption}</div>
            <div className="scene-device-target" style={{ color: primary }}>{art.lead}</div>
          </div>
          <div className="scene-device-keys">
            {"QWERTYUI".split("").map((key) => (
              <span className={`scene-key ${key === art.lead.slice(0, 1) ? "scene-key-active" : ""}`} key={key} style={key === art.lead.slice(0, 1) ? { backgroundColor: secondary, color: primary, borderColor: primary } : undefined}>
                {key}
              </span>
            ))}
          </div>
        </div>
        <div className="scene-sticker-row">
          <SceneSticker icon="keyboard" label={art.caption} primary={primary} secondary={secondary} />
          <SceneSticker icon="spark" label={art.lead} primary={primary} secondary={secondary} />
        </div>
      </div>
    );
  }

  if (art.kind === "conversation") {
    return (
      <div className={`scene-stage scene-stage-${playMode ? "play" : "cover"}`} style={{ background: `linear-gradient(160deg, ${surface}, white)` }}>
        <div className="scene-glow" style={{ backgroundColor: secondary }} />
        <SceneCharacters primary={primary} secondary={secondary} />
        <div className="scene-chat-row">
          <div className="scene-chat-bubble" style={{ backgroundColor: "white", borderColor: primary, color: primary }}>{art.lead}</div>
          <div className="scene-chat-bubble scene-chat-bubble-alt" style={{ backgroundColor: secondary, borderColor: primary, color: primary }}>{art.trail}</div>
        </div>
        <div className="scene-sticker-row">
          <SceneSticker icon="chat" label={art.caption} primary={primary} secondary={secondary} />
          <SceneSticker icon={trailIcon} label={art.trail ?? art.lead} primary={primary} secondary={secondary} />
        </div>
      </div>
    );
  }

  if (art.kind === "choice") {
    return (
      <div className={`scene-stage scene-stage-${playMode ? "play" : "cover"}`} style={{ background: `linear-gradient(160deg, ${surface}, white)` }}>
        <div className="scene-glow" style={{ backgroundColor: secondary }} />
        <div className="scene-choice-grid">
          <div className="scene-choice-option" style={{ backgroundColor: "white", borderColor: primary }}>
            <PictureIcon kind={leadIcon} primary={primary} secondary={secondary} />
            <strong>{art.lead}</strong>
          </div>
          <div className="scene-choice-option" style={{ backgroundColor: secondary, borderColor: primary }}>
            <PictureIcon kind={trailIcon} primary={primary} secondary="white" />
            <strong>{art.trail}</strong>
          </div>
        </div>
        <div className="scene-sticker-row">
          <SceneSticker icon={leadIcon} label={art.lead} primary={primary} secondary={secondary} />
          <SceneSticker icon={trailIcon} label={art.caption} primary={primary} secondary={secondary} />
        </div>
      </div>
    );
  }

  if (art.kind === "pair") {
    return (
      <div className={`scene-stage scene-stage-${playMode ? "play" : "cover"}`} style={{ background: `linear-gradient(160deg, ${surface}, white)` }}>
        <div className="scene-glow" style={{ backgroundColor: secondary }} />
        <div className="scene-pair-lane">
          <div className="scene-token-card" style={{ backgroundColor: "white", borderColor: primary, color: primary }}>{art.lead}</div>
          <div className="scene-slide-path" style={{ backgroundColor: primary }} />
          <div className="scene-token-card" style={{ backgroundColor: secondary, borderColor: primary, color: primary }}>{art.trail}</div>
        </div>
        <div className="scene-sound-wave-row">
          <span style={{ backgroundColor: badge }} />
          <span style={{ backgroundColor: secondary }} />
          <span style={{ backgroundColor: badge }} />
        </div>
        <div className="scene-sticker-row">
          <SceneSticker icon="spark" label={art.caption} primary={primary} secondary={secondary} />
          <SceneSticker icon={trailIcon} label={art.lead + (art.trail ? " + " + art.trail : "")} primary={primary} secondary={secondary} />
        </div>
      </div>
    );
  }

  return (
    <div className={`scene-stage scene-stage-${playMode ? "play" : "cover"}`} style={{ background: `linear-gradient(160deg, ${surface}, white)` }}>
      <div className="scene-glow" style={{ backgroundColor: secondary }} />
      <div className="scene-letter-world">
        <div className="scene-mouth-card" style={{ backgroundColor: "white", borderColor: primary }}>
          <div className="scene-mouth-top" style={{ backgroundColor: primary }} />
          <div className="scene-mouth-bottom" style={{ backgroundColor: secondary }} />
          <div className="scene-sound-wave-row">
            <span style={{ backgroundColor: badge }} />
            <span style={{ backgroundColor: secondary }} />
            <span style={{ backgroundColor: badge }} />
          </div>
        </div>
        <div className="scene-letter-card" style={{ backgroundColor: secondary, borderColor: primary, color: primary }}>
          {art.lead}
        </div>
      </div>
      <div className="scene-sticker-row">
        <SceneSticker icon={leadIcon} label={art.caption} primary={primary} secondary={secondary} />
        <SceneSticker icon="spark" label={art.lead} primary={primary} secondary={secondary} />
      </div>
    </div>
  );
}

export function ActivityPosterScene({ art, primary, secondary, surface, ink, badge, title }: PosterSceneProps) {
  return (
    <div className="activity-poster-scene" style={{ color: ink }}>
      <SceneBoard art={art} badge={badge} ink={ink} playMode={false} primary={primary} secondary={secondary} surface={surface} />
      <div className="activity-poster-label" style={{ backgroundColor: "rgba(255,255,255,0.92)", borderColor: primary, color: primary }}>
        {title}
      </div>
    </div>
  );
}

export function ActivityPlayScene({ art, primary, secondary, surface, ink, badge, focus, cue, example }: PlaySceneProps) {
  return (
    <div className="activity-play-scene" style={{ color: ink }}>
      <SceneBoard art={art} badge={badge} ink={ink} playMode primary={primary} secondary={secondary} surface={surface} />
      <div className="scene-cue-row">
        <div className="scene-cue-card" style={{ backgroundColor: "white", borderColor: primary }}>
          <div className="meta-row">Focus</div>
          <strong>{focus}</strong>
        </div>
        <div className="scene-cue-card" style={{ backgroundColor: secondary, borderColor: primary }}>
          <div className="meta-row">Cue</div>
          <strong>{cue}</strong>
        </div>
        <div className="scene-cue-card" style={{ backgroundColor: "white", borderColor: primary }}>
          <div className="meta-row">Example</div>
          <strong>{example}</strong>
        </div>
      </div>
    </div>
  );
}
