import Image from "next/image";
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

function getCountColumns(count: number) {
  if (count <= 4) {
    return 2;
  }

  if (count <= 9) {
    return 3;
  }

  if (count <= 16) {
    return 4;
  }

  return 5;
}

function PhotoSurface({ art }: { art: ActivityArt }) {
  if (art.imageSrc == null) {
    return (
      <div className="scene-photo-fallback">
        <strong>{art.lead}</strong>
        {art.trail ? <span>{art.trail}</span> : null}
      </div>
    );
  }

  const className =
    art.kind === "scene"
      ? "scene-photo-image scene-photo-image-scene"
      : "scene-photo-image";
  const imageStyle =
    art.imagePosition || art.imageScale
      ? {
          objectPosition: art.imagePosition,
          transform: art.imageScale ? "scale(" + String(art.imageScale) + ")" : undefined
        }
      : undefined;

  return (
    <div className="scene-photo-frame">
      <Image
        alt={art.imageAlt ?? art.caption}
        className={className}
        fill
        sizes="(max-width: 720px) 100vw, (max-width: 1100px) 70vw, 560px"
        src={art.imageSrc}
        style={imageStyle}
      />
      <div className="scene-photo-sheen" />
    </div>
  );
}

function AlphabetCard({ art, primary, secondary, badge }: SharedSceneProps) {
  return (
    <div className="scene-stage scene-stage-photo">
      <div className="scene-photo-shell scene-photo-shell-alphabet">
        <div className="scene-photo-head">
          <span className="scene-badge" style={{ backgroundColor: badge, color: primary }}>
            {art.caption}
          </span>
        </div>
        <div className="scene-photo-stage">
          <PhotoSurface art={art} />
          <div className="scene-floating-letter" style={{ backgroundColor: secondary, color: primary }}>
            {art.trail}
          </div>
          <div className="scene-word-banner">
            <strong>{art.lead}</strong>
            <span>{art.trail} for {art.lead}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function CountCard({ art, primary, secondary, badge }: SharedSceneProps) {
  const count = art.count ?? 0;
  const columns = getCountColumns(count);
  const imageStyle =
    art.imagePosition || art.imageScale
      ? {
          objectPosition: art.imagePosition,
          transform: art.imageScale ? "scale(" + String(art.imageScale) + ")" : undefined
        }
      : undefined;

  return (
    <div className="scene-stage scene-stage-photo">
      <div className="scene-photo-shell scene-photo-shell-count">
        <div className="scene-photo-head">
          <span className="scene-badge" style={{ backgroundColor: badge, color: primary }}>
            {art.caption}
          </span>
        </div>
        <div className="scene-count-shell" style={{ background: "linear-gradient(180deg, white 0%, " + secondary + " 100%)" }}>
          <div className="scene-floating-letter scene-floating-number" style={{ backgroundColor: secondary, color: primary }}>
            {art.trail}
          </div>
          <div className="scene-count-grid" style={{ gridTemplateColumns: "repeat(" + String(columns) + ", minmax(0, 1fr))" }}>
            {Array.from({ length: count }).map((_, index) => (
              <div className="scene-count-tile" key={String(index)}>
                {art.imageSrc ? (
                  <Image
                    alt={(art.imageAlt ?? art.caption) + " " + String(index + 1)}
                    className="scene-count-tile-image"
                    fill
                    sizes="96px"
                    src={art.imageSrc}
                    style={imageStyle}
                  />
                ) : null}
              </div>
            ))}
          </div>
          <div className="scene-word-banner scene-word-banner-count">
            <strong>{art.lead}</strong>
            <span>Count each picture one time.</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChoiceCard({ art, primary, badge }: SharedSceneProps) {
  return (
    <div className="scene-stage scene-stage-photo">
      <div className="scene-photo-shell">
        <div className="scene-photo-head">
          <span className="scene-badge" style={{ backgroundColor: badge, color: primary }}>
            {art.caption}
          </span>
        </div>
        <div className="scene-photo-stage">
          <PhotoSurface art={art} />
          <div className="scene-choice-row scene-choice-row-overlay">
            <span className="scene-choice-pill scene-choice-pill-light">{art.lead}</span>
            {art.trail ? <span className="scene-choice-pill">{art.trail}</span> : null}
          </div>
        </div>
      </div>
    </div>
  );
}

function ConversationCard({ art, primary, badge }: SharedSceneProps) {
  return (
    <div className="scene-stage scene-stage-photo">
      <div className="scene-photo-shell">
        <div className="scene-photo-head">
          <span className="scene-badge" style={{ backgroundColor: badge, color: primary }}>
            {art.caption}
          </span>
        </div>
        <div className="scene-photo-stage">
          <PhotoSurface art={art} />
        </div>
        <div className="scene-conversation-row">
          <div className="scene-talk-bubble">{art.lead}</div>
          {art.trail ? <div className="scene-talk-bubble scene-talk-bubble-alt">{art.trail}</div> : null}
        </div>
      </div>
    </div>
  );
}

function SceneCard({ art, primary, badge }: SharedSceneProps) {
  return (
    <div className="scene-stage scene-stage-photo">
      <div className="scene-photo-shell">
        <div className="scene-photo-head">
          <span className="scene-badge" style={{ backgroundColor: badge, color: primary }}>
            {art.caption}
          </span>
        </div>
        <div className="scene-photo-stage">
          <PhotoSurface art={art} />
          <div className="scene-word-banner scene-word-banner-scene">
            <strong>{art.lead}</strong>
            {art.trail ? <span>{art.trail}</span> : null}
          </div>
        </div>
      </div>
    </div>
  );
}

function CardSurface(props: SharedSceneProps) {
  if (props.art.kind === "alphabet") {
    return <AlphabetCard {...props} />;
  }

  if (props.art.kind === "count") {
    return <CountCard {...props} />;
  }

  if (props.art.kind === "choice") {
    return <ChoiceCard {...props} />;
  }

  if (props.art.kind === "conversation") {
    return <ConversationCard {...props} />;
  }

  return <SceneCard {...props} />;
}

export function ActivityPosterScene({ art, primary, secondary, surface, ink, badge, title }: PosterSceneProps) {
  return (
    <div className="activity-poster-scene" style={{ color: ink }}>
      <div className="scene-stage-wrap" style={{ background: "linear-gradient(180deg, white 0%, " + surface + " 100%)" }}>
        <CardSurface art={art} badge={badge} ink={ink} primary={primary} secondary={secondary} surface={surface} />
      </div>
      <div className="activity-poster-label" style={{ backgroundColor: "rgba(255,255,255,0.94)", borderColor: primary, color: primary }}>
        {title}
      </div>
    </div>
  );
}

export function ActivityPlayScene({ art, primary, secondary, surface, ink, badge }: SharedSceneProps) {
  return (
    <div className="activity-play-scene" style={{ color: ink }}>
      <div className="scene-stage-wrap" style={{ background: "linear-gradient(180deg, white 0%, " + surface + " 100%)" }}>
        <CardSurface art={art} badge={badge} ink={ink} primary={primary} secondary={secondary} surface={surface} />
      </div>
    </div>
  );
}
