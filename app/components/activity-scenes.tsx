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
  | "backpack"
  | "ball"
  | "cat"
  | "cracker"
  | "dog"
  | "egg"
  | "fish"
  | "grapes"
  | "hello"
  | "house"
  | "icecream"
  | "juice"
  | "kite"
  | "leaf"
  | "moon"
  | "nest"
  | "orange"
  | "pear"
  | "quilt"
  | "rainbow"
  | "slide"
  | "sun"
  | "swing"
  | "teacher"
  | "tree"
  | "umbrella"
  | "van"
  | "whale"
  | "xylophone"
  | "yarn"
  | "zebra"
  | "chat"
  | "spark";

function pickIcon(value?: string): IconKind {
  const normalized = (value ?? "").toLowerCase();

  if (normalized.includes("apple")) return "apple";
  if (normalized.includes("backpack")) return "backpack";
  if (normalized.includes("ball")) return "ball";
  if (normalized.includes("cat")) return "cat";
  if (normalized.includes("cracker")) return "cracker";
  if (normalized.includes("dog")) return "dog";
  if (normalized.includes("egg")) return "egg";
  if (normalized.includes("fish")) return "fish";
  if (normalized.includes("grape")) return "grapes";
  if (normalized.includes("hello") || normalized.includes("goodbye") || normalized.includes("good morning")) return "hello";
  if (normalized.includes("house")) return "house";
  if (normalized.includes("ice cream")) return "icecream";
  if (normalized.includes("juice")) return "juice";
  if (normalized.includes("kite")) return "kite";
  if (normalized.includes("leaf")) return "leaf";
  if (normalized.includes("moon")) return "moon";
  if (normalized.includes("nest")) return "nest";
  if (normalized.includes("orange")) return "orange";
  if (normalized.includes("pear")) return "pear";
  if (normalized.includes("quilt")) return "quilt";
  if (normalized.includes("rainbow")) return "rainbow";
  if (normalized.includes("slide")) return "slide";
  if (normalized.includes("sun")) return "sun";
  if (normalized.includes("swing")) return "swing";
  if (normalized.includes("teacher")) return "teacher";
  if (normalized.includes("tree")) return "tree";
  if (normalized.includes("umbrella")) return "umbrella";
  if (normalized.includes("van")) return "van";
  if (normalized.includes("whale")) return "whale";
  if (normalized.includes("xylophone")) return "xylophone";
  if (normalized.includes("yarn")) return "yarn";
  if (normalized.includes("zebra")) return "zebra";
  if (normalized.includes("help") || normalized.includes("please") || normalized.includes("wait") || normalized.includes("turn")) return "chat";

  return "spark";
}

function PictureIcon({ kind, primary, secondary }: { kind: IconKind; primary: string; secondary: string }) {
  if (kind === "apple") {
    return (
      <svg aria-hidden="true" className="scene-icon" viewBox="0 0 80 80">
        <circle cx="40" cy="44" fill={secondary} r="22" stroke={primary} strokeWidth="4" />
        <path d="M40 16 C44 22 44 28 40 32" fill="none" stroke={primary} strokeLinecap="round" strokeWidth="4" />
        <path d="M42 18 C52 10 60 14 62 24 C54 25 47 24 42 18" fill={primary} opacity="0.22" />
      </svg>
    );
  }

  if (kind === "backpack") {
    return (
      <svg aria-hidden="true" className="scene-icon" viewBox="0 0 80 80">
        <path d="M24 22 H56 C60 22 64 26 64 30 V58 H16 V30 C16 26 20 22 24 22 Z" fill={secondary} stroke={primary} strokeWidth="4" />
        <path d="M28 22 C28 14 34 10 40 10 C46 10 52 14 52 22" fill="none" stroke={primary} strokeWidth="4" />
        <rect fill="white" height="14" rx="6" stroke={primary} strokeWidth="3" width="22" x="29" y="36" />
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

  if (kind === "cat") {
    return (
      <svg aria-hidden="true" className="scene-icon" viewBox="0 0 80 80">
        <path d="M24 22 L34 12 L40 22 L46 12 L56 22 V54 C56 62 50 68 40 68 C30 68 24 62 24 54 Z" fill={secondary} stroke={primary} strokeLinejoin="round" strokeWidth="4" />
        <circle cx="33" cy="42" fill={primary} r="3" />
        <circle cx="47" cy="42" fill={primary} r="3" />
        <path d="M36 52 Q40 56 44 52" fill="none" stroke={primary} strokeLinecap="round" strokeWidth="4" />
      </svg>
    );
  }

  if (kind === "cracker") {
    return (
      <svg aria-hidden="true" className="scene-icon" viewBox="0 0 80 80">
        <rect fill={secondary} height="42" rx="12" stroke={primary} strokeWidth="4" width="46" x="17" y="19" />
        <circle cx="30" cy="34" fill={primary} r="2.5" />
        <circle cx="40" cy="40" fill={primary} r="2.5" />
        <circle cx="50" cy="34" fill={primary} r="2.5" />
        <circle cx="34" cy="48" fill={primary} r="2.5" />
        <circle cx="46" cy="48" fill={primary} r="2.5" />
      </svg>
    );
  }

  if (kind === "dog") {
    return (
      <svg aria-hidden="true" className="scene-icon" viewBox="0 0 80 80">
        <path d="M22 24 L14 34 L18 50 L62 50 L66 34 L58 24" fill={secondary} stroke={primary} strokeLinejoin="round" strokeWidth="4" />
        <circle cx="30" cy="40" fill={primary} r="3" />
        <circle cx="50" cy="40" fill={primary} r="3" />
        <circle cx="40" cy="46" fill={primary} r="4" />
      </svg>
    );
  }

  if (kind === "egg") {
    return (
      <svg aria-hidden="true" className="scene-icon" viewBox="0 0 80 80">
        <path d="M40 16 C52 16 60 34 60 48 C60 60 52 68 40 68 C28 68 20 60 20 48 C20 34 28 16 40 16 Z" fill={secondary} stroke={primary} strokeWidth="4" />
      </svg>
    );
  }

  if (kind === "fish") {
    return (
      <svg aria-hidden="true" className="scene-icon" viewBox="0 0 80 80">
        <path d="M18 40 C26 24 42 24 54 40 C42 56 26 56 18 40 Z" fill={secondary} stroke={primary} strokeWidth="4" />
        <path d="M54 40 L66 28 V52 Z" fill={secondary} stroke={primary} strokeLinejoin="round" strokeWidth="4" />
        <circle cx="30" cy="38" fill={primary} r="3" />
      </svg>
    );
  }

  if (kind === "grapes") {
    return (
      <svg aria-hidden="true" className="scene-icon" viewBox="0 0 80 80">
        <circle cx="40" cy="24" fill={secondary} r="8" stroke={primary} strokeWidth="3" />
        <circle cx="30" cy="36" fill={secondary} r="8" stroke={primary} strokeWidth="3" />
        <circle cx="40" cy="36" fill={secondary} r="8" stroke={primary} strokeWidth="3" />
        <circle cx="50" cy="36" fill={secondary} r="8" stroke={primary} strokeWidth="3" />
        <circle cx="34" cy="48" fill={secondary} r="8" stroke={primary} strokeWidth="3" />
        <circle cx="46" cy="48" fill={secondary} r="8" stroke={primary} strokeWidth="3" />
        <path d="M40 10 V18" fill="none" stroke={primary} strokeLinecap="round" strokeWidth="4" />
      </svg>
    );
  }

  if (kind === "hello") {
    return (
      <svg aria-hidden="true" className="scene-icon" viewBox="0 0 80 80">
        <circle cx="40" cy="28" fill={secondary} r="14" stroke={primary} strokeWidth="4" />
        <path d="M22 64 C24 50 30 44 40 44 C50 44 56 50 58 64" fill={secondary} stroke={primary} strokeLinecap="round" strokeWidth="4" />
        <path d="M56 26 L68 18 L70 28 L58 34" fill={secondary} stroke={primary} strokeLinejoin="round" strokeWidth="4" />
      </svg>
    );
  }

  if (kind === "house") {
    return (
      <svg aria-hidden="true" className="scene-icon" viewBox="0 0 80 80">
        <path d="M16 38 L40 18 L64 38 V62 H16 Z" fill={secondary} stroke={primary} strokeLinejoin="round" strokeWidth="4" />
        <rect fill="white" height="18" rx="4" stroke={primary} strokeWidth="3" width="14" x="33" y="44" />
      </svg>
    );
  }

  if (kind === "icecream") {
    return (
      <svg aria-hidden="true" className="scene-icon" viewBox="0 0 80 80">
        <circle cx="40" cy="28" fill={secondary} r="16" stroke={primary} strokeWidth="4" />
        <path d="M30 42 H50 L42 66 H38 Z" fill="#ffd59a" stroke={primary} strokeLinejoin="round" strokeWidth="4" />
      </svg>
    );
  }

  if (kind === "juice") {
    return (
      <svg aria-hidden="true" className="scene-icon" viewBox="0 0 80 80">
        <path d="M26 18 H54 L50 60 H30 Z" fill={secondary} stroke={primary} strokeLinejoin="round" strokeWidth="4" />
        <path d="M44 12 L56 22" fill="none" stroke={primary} strokeLinecap="round" strokeWidth="4" />
      </svg>
    );
  }

  if (kind === "kite") {
    return (
      <svg aria-hidden="true" className="scene-icon" viewBox="0 0 80 80">
        <path d="M40 14 L58 36 L40 58 L22 36 Z" fill={secondary} stroke={primary} strokeLinejoin="round" strokeWidth="4" />
        <path d="M40 58 C44 62 48 64 52 68 C56 64 58 62 62 66" fill="none" stroke={primary} strokeLinecap="round" strokeWidth="4" />
      </svg>
    );
  }

  if (kind === "leaf") {
    return (
      <svg aria-hidden="true" className="scene-icon" viewBox="0 0 80 80">
        <path d="M18 48 C18 24 42 14 60 18 C64 38 56 60 32 62 C24 62 18 56 18 48 Z" fill={secondary} stroke={primary} strokeWidth="4" />
        <path d="M26 54 C36 42 44 34 56 26" fill="none" stroke={primary} strokeLinecap="round" strokeWidth="4" />
      </svg>
    );
  }

  if (kind === "moon") {
    return (
      <svg aria-hidden="true" className="scene-icon" viewBox="0 0 80 80">
        <path d="M52 14 C34 18 26 34 30 48 C34 62 48 68 62 64 C48 58 42 44 46 28 C48 22 50 18 52 14 Z" fill={secondary} stroke={primary} strokeLinejoin="round" strokeWidth="4" />
      </svg>
    );
  }

  if (kind === "nest") {
    return (
      <svg aria-hidden="true" className="scene-icon" viewBox="0 0 80 80">
        <path d="M18 46 C24 34 56 34 62 46 C56 58 24 58 18 46 Z" fill={secondary} stroke={primary} strokeWidth="4" />
        <circle cx="34" cy="42" fill="white" r="5" stroke={primary} strokeWidth="3" />
        <circle cx="46" cy="42" fill="white" r="5" stroke={primary} strokeWidth="3" />
      </svg>
    );
  }

  if (kind === "orange") {
    return (
      <svg aria-hidden="true" className="scene-icon" viewBox="0 0 80 80">
        <circle cx="40" cy="42" fill={secondary} r="22" stroke={primary} strokeWidth="4" />
        <path d="M40 18 C48 12 56 16 58 22" fill="none" stroke={primary} strokeLinecap="round" strokeWidth="4" />
      </svg>
    );
  }

  if (kind === "pear") {
    return (
      <svg aria-hidden="true" className="scene-icon" viewBox="0 0 80 80">
        <path d="M40 16 C48 20 50 28 46 34 C58 38 60 50 54 58 C48 66 32 66 26 58 C20 50 22 38 34 34 C30 28 32 20 40 16 Z" fill={secondary} stroke={primary} strokeWidth="4" />
      </svg>
    );
  }

  if (kind === "quilt") {
    return (
      <svg aria-hidden="true" className="scene-icon" viewBox="0 0 80 80">
        <rect fill={secondary} height="44" rx="8" stroke={primary} strokeWidth="4" width="44" x="18" y="18" />
        <path d="M18 32 H62 M18 46 H62 M32 18 V62 M46 18 V62" fill="none" stroke={primary} strokeWidth="3" />
      </svg>
    );
  }

  if (kind === "rainbow") {
    return (
      <svg aria-hidden="true" className="scene-icon" viewBox="0 0 80 80">
        <path d="M18 54 C18 34 28 22 40 22 C52 22 62 34 62 54" fill="none" stroke={primary} strokeWidth="4" />
        <path d="M26 54 C26 40 32 30 40 30 C48 30 54 40 54 54" fill="none" opacity="0.6" stroke={primary} strokeWidth="4" />
        <path d="M34 54 C34 46 37 38 40 38 C43 38 46 46 46 54" fill="none" opacity="0.3" stroke={primary} strokeWidth="4" />
      </svg>
    );
  }

  if (kind === "slide") {
    return (
      <svg aria-hidden="true" className="scene-icon" viewBox="0 0 80 80">
        <path d="M22 58 H30 L52 34 H60" fill="none" stroke={primary} strokeLinecap="round" strokeWidth="5" />
        <path d="M26 58 V24 H42" fill="none" stroke={primary} strokeLinecap="round" strokeWidth="5" />
        <path d="M32 30 V22" fill="none" stroke={primary} strokeLinecap="round" strokeWidth="4" />
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

  if (kind === "swing") {
    return (
      <svg aria-hidden="true" className="scene-icon" viewBox="0 0 80 80">
        <path d="M18 62 L28 18 H52 L62 62" fill="none" stroke={primary} strokeLinecap="round" strokeWidth="4" />
        <path d="M30 18 H50" fill="none" stroke={primary} strokeLinecap="round" strokeWidth="4" />
        <path d="M34 28 V48 M46 28 V48" fill="none" stroke={primary} strokeLinecap="round" strokeWidth="4" />
        <rect fill={secondary} height="8" rx="4" stroke={primary} strokeWidth="3" width="20" x="30" y="48" />
      </svg>
    );
  }

  if (kind === "teacher") {
    return (
      <svg aria-hidden="true" className="scene-icon" viewBox="0 0 80 80">
        <circle cx="30" cy="26" fill={secondary} r="12" stroke={primary} strokeWidth="4" />
        <path d="M18 58 C20 44 24 38 30 38 C36 38 40 44 42 58" fill={secondary} stroke={primary} strokeLinecap="round" strokeWidth="4" />
        <rect fill="white" height="24" rx="4" stroke={primary} strokeWidth="4" width="24" x="46" y="26" />
        <path d="M52 34 H64 M52 42 H62" fill="none" stroke={primary} strokeLinecap="round" strokeWidth="3" />
      </svg>
    );
  }

  if (kind === "tree") {
    return (
      <svg aria-hidden="true" className="scene-icon" viewBox="0 0 80 80">
        <circle cx="40" cy="28" fill={secondary} r="18" stroke={primary} strokeWidth="4" />
        <rect fill={primary} height="22" rx="4" width="10" x="35" y="40" />
      </svg>
    );
  }

  if (kind === "umbrella") {
    return (
      <svg aria-hidden="true" className="scene-icon" viewBox="0 0 80 80">
        <path d="M16 40 C20 24 32 18 40 18 C48 18 60 24 64 40 Z" fill={secondary} stroke={primary} strokeLinejoin="round" strokeWidth="4" />
        <path d="M40 40 V60 C40 64 44 66 48 64" fill="none" stroke={primary} strokeLinecap="round" strokeWidth="4" />
      </svg>
    );
  }

  if (kind === "van") {
    return (
      <svg aria-hidden="true" className="scene-icon" viewBox="0 0 80 80">
        <path d="M18 30 H48 L60 42 V56 H18 Z" fill={secondary} stroke={primary} strokeLinejoin="round" strokeWidth="4" />
        <circle cx="28" cy="58" fill="white" r="6" stroke={primary} strokeWidth="4" />
        <circle cx="52" cy="58" fill="white" r="6" stroke={primary} strokeWidth="4" />
      </svg>
    );
  }

  if (kind === "whale") {
    return (
      <svg aria-hidden="true" className="scene-icon" viewBox="0 0 80 80">
        <path d="M18 44 C24 28 52 24 62 40 C58 52 44 60 28 58 C20 56 16 50 18 44 Z" fill={secondary} stroke={primary} strokeWidth="4" />
        <path d="M62 40 L70 34 L68 46 Z" fill={secondary} stroke={primary} strokeLinejoin="round" strokeWidth="4" />
        <circle cx="30" cy="40" fill={primary} r="3" />
      </svg>
    );
  }

  if (kind === "xylophone") {
    return (
      <svg aria-hidden="true" className="scene-icon" viewBox="0 0 80 80">
        <path d="M20 54 L60 54" fill="none" stroke={primary} strokeLinecap="round" strokeWidth="4" />
        <rect fill={secondary} height="8" rx="4" stroke={primary} strokeWidth="3" width="12" x="22" y="38" />
        <rect fill={secondary} height="10" rx="4" stroke={primary} strokeWidth="3" width="12" x="34" y="34" />
        <rect fill={secondary} height="12" rx="4" stroke={primary} strokeWidth="3" width="12" x="46" y="30" />
        <path d="M20 24 L30 34" fill="none" stroke={primary} strokeLinecap="round" strokeWidth="4" />
      </svg>
    );
  }

  if (kind === "yarn") {
    return (
      <svg aria-hidden="true" className="scene-icon" viewBox="0 0 80 80">
        <circle cx="40" cy="40" fill={secondary} r="22" stroke={primary} strokeWidth="4" />
        <path d="M26 34 C34 30 46 30 54 34 M24 42 C34 38 46 38 56 42 M28 50 C36 46 44 46 52 50" fill="none" stroke={primary} strokeWidth="3" />
      </svg>
    );
  }

  if (kind === "zebra") {
    return (
      <svg aria-hidden="true" className="scene-icon" viewBox="0 0 80 80">
        <path d="M26 22 H54 V56 C54 62 48 66 40 66 C32 66 26 62 26 56 Z" fill={secondary} stroke={primary} strokeWidth="4" />
        <path d="M30 22 L26 14 M50 22 L54 14 M32 30 L32 54 M40 28 L40 56 M48 30 L48 54" fill="none" stroke={primary} strokeLinecap="round" strokeWidth="3" />
      </svg>
    );
  }

  if (kind === "chat") {
    return (
      <svg aria-hidden="true" className="scene-icon" viewBox="0 0 80 80">
        <path d="M14 18 H54 C62 18 68 24 68 32 V42 C68 50 62 56 54 56 H34 L22 66 V56 H14 C6 56 0 50 0 42 V32 C0 24 6 18 14 18 Z" fill={secondary} stroke={primary} strokeLinejoin="round" strokeWidth="4" />
        <circle cx="24" cy="37" fill={primary} r="3" />
        <circle cx="34" cy="37" fill={primary} r="3" />
        <circle cx="44" cy="37" fill={primary} r="3" />
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

function ConversationBoard({ art, primary, secondary, surface }: SharedSceneProps) {
  return (
    <div className="scene-stage scene-stage-play" style={{ background: "linear-gradient(160deg, " + surface + ", white)" }}>
      <div className="scene-glow" style={{ backgroundColor: secondary }} />
      <div className="scene-characters">
        <div className="scene-character-card" style={{ backgroundColor: "white", borderColor: primary }}>
          <PictureIcon kind="hello" primary={primary} secondary={secondary} />
          <strong>{art.caption}</strong>
        </div>
        <div className="scene-character-card" style={{ backgroundColor: secondary, borderColor: primary }}>
          <PictureIcon kind="chat" primary={primary} secondary="white" />
          <strong>{art.trail ?? art.lead}</strong>
        </div>
      </div>
      <div className="scene-chat-row">
        <div className="scene-chat-bubble" style={{ backgroundColor: "white", borderColor: primary, color: primary }}>{art.lead}</div>
        <div className="scene-chat-bubble scene-chat-bubble-alt" style={{ backgroundColor: secondary, borderColor: primary, color: primary }}>{art.trail}</div>
      </div>
    </div>
  );
}

function ChoiceBoard({ art, primary, secondary, surface }: SharedSceneProps) {
  const leadIcon = pickIcon(art.lead);
  const trailIcon = pickIcon(art.trail);

  return (
    <div className="scene-stage scene-stage-play" style={{ background: "linear-gradient(160deg, " + surface + ", white)" }}>
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
        <SceneSticker icon={trailIcon} label={art.trail ?? art.lead} primary={primary} secondary={secondary} />
      </div>
    </div>
  );
}

function AlphabetBoard({ art, primary, secondary, surface, badge }: SharedSceneProps) {
  const leadIcon = pickIcon(art.lead);

  return (
    <div className="scene-stage scene-stage-play" style={{ background: "linear-gradient(160deg, " + surface + ", white)" }}>
      <div className="scene-glow" style={{ backgroundColor: secondary }} />
      <div className="scene-alpha-layout">
        <div className="scene-alpha-object" style={{ backgroundColor: "white", borderColor: primary }}>
          <PictureIcon kind={leadIcon} primary={primary} secondary={secondary} />
          <strong>{art.lead}</strong>
          <span className="scene-alpha-caption">{art.caption}</span>
        </div>
        <div className="scene-letter-card" style={{ backgroundColor: secondary, borderColor: primary, color: primary }}>
          {art.trail}
        </div>
      </div>
      <div className="scene-sticker-row">
        <SceneSticker icon={leadIcon} label={art.lead} primary={primary} secondary={secondary} />
        <div className="scene-sticker" style={{ backgroundColor: "white", borderColor: primary }}>
          <div className="scene-alpha-chip" style={{ backgroundColor: badge, color: primary }}>{art.trail}</div>
          <span>{art.caption}</span>
        </div>
      </div>
    </div>
  );
}

function SceneBoard({ art, primary, secondary, surface, badge }: SharedSceneProps) {
  const leadIcon = pickIcon(art.lead);
  const trailIcon = pickIcon(art.trail ?? art.caption);

  if (art.kind === "conversation") {
    return <ConversationBoard art={art} badge={badge} ink={primary} primary={primary} secondary={secondary} surface={surface} />;
  }

  if (art.kind === "choice") {
    return <ChoiceBoard art={art} badge={badge} ink={primary} primary={primary} secondary={secondary} surface={surface} />;
  }

  if (art.kind === "alphabet") {
    return <AlphabetBoard art={art} badge={badge} ink={primary} primary={primary} secondary={secondary} surface={surface} />;
  }

  return (
    <div className="scene-stage scene-stage-play" style={{ background: "linear-gradient(160deg, " + surface + ", white)" }}>
      <div className="scene-glow" style={{ backgroundColor: secondary }} />
      <div className="scene-scene-layout">
        <div className="scene-scene-card" style={{ backgroundColor: "white", borderColor: primary }}>
          <PictureIcon kind={leadIcon} primary={primary} secondary={secondary} />
          <strong>{art.lead}</strong>
          <span className="scene-alpha-caption">{art.caption}</span>
        </div>
        <div className="scene-action-card" style={{ backgroundColor: secondary, borderColor: primary, color: primary }}>
          <PictureIcon kind={trailIcon} primary={primary} secondary="white" />
          <strong>{art.trail ?? art.caption}</strong>
        </div>
      </div>
      <div className="scene-sticker-row">
        <SceneSticker icon={leadIcon} label={art.caption} primary={primary} secondary={secondary} />
        <SceneSticker icon={trailIcon} label={art.trail ?? art.lead} primary={primary} secondary={secondary} />
      </div>
    </div>
  );
}

export function ActivityPosterScene({ art, primary, secondary, surface, ink, badge, title }: PosterSceneProps) {
  return (
    <div className="activity-poster-scene" style={{ color: ink }}>
      <SceneBoard art={art} badge={badge} ink={ink} primary={primary} secondary={secondary} surface={surface} />
      <div className="activity-poster-label" style={{ backgroundColor: "rgba(255,255,255,0.92)", borderColor: primary, color: primary }}>
        {title}
      </div>
    </div>
  );
}

export function ActivityPlayScene({ art, primary, secondary, surface, ink, badge, focus, cue, example }: PlaySceneProps) {
  return (
    <div className="activity-play-scene" style={{ color: ink }}>
      <SceneBoard art={art} badge={badge} ink={ink} primary={primary} secondary={secondary} surface={surface} />
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
          <div className="meta-row">Sound</div>
          <strong>{example}</strong>
        </div>
      </div>
    </div>
  );
}
