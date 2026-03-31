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

function PhotoSurface({ art }: { art: ActivityArt }) {
  if (art.imageSrc == null) {
    return (
      <div className="scene-photo-fallback">
        <strong>{art.lead}</strong>
        {art.trail ? <span>{art.trail}</span> : null}
      </div>
    );
  }

  return (
    <div className="scene-photo-frame">
      <Image
        alt={art.imageAlt ?? art.caption}
        className="scene-photo-image"
        fill
        sizes="(max-width: 720px) 100vw, (max-width: 1100px) 70vw, 560px"
        src={art.imageSrc}
      />
    </div>
  );
}

function AlphabetCard({ art, primary, secondary, badge }: SharedSceneProps) {
  return (
    <div className="scene-stage scene-stage-photo">
      <div className="scene-photo-shell">
        <div className="scene-photo-head">
          <span className="scene-badge" style={{ backgroundColor: badge, color: primary }}>
            {art.caption}
          </span>
          <span className="scene-letter-pill" style={{ backgroundColor: secondary, color: primary }}>
            {art.trail}
          </span>
        </div>
        <PhotoSurface art={art} />
        <div className="alphabet-card-copy">
          <strong>{art.lead}</strong>
          <span>{art.trail} is for {art.lead}</span>
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
        <PhotoSurface art={art} />
        <div className="scene-choice-row">
          <span className="scene-choice-pill scene-choice-pill-light">{art.lead}</span>
          {art.trail ? <span className="scene-choice-pill">{art.trail}</span> : null}
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
        <PhotoSurface art={art} />
        <div className="scene-conversation-row">
          <div className="scene-talk-bubble">{art.lead}</div>
          {art.trail ? <div className="scene-talk-bubble scene-talk-bubble-alt">{art.trail}</div> : null}
        </div>
      </div>
    </div>
  );
}

function SceneCard({ art, primary, secondary, badge }: SharedSceneProps) {
  return (
    <div className="scene-stage scene-stage-photo">
      <div className="scene-photo-shell">
        <div className="scene-photo-head">
          <span className="scene-badge" style={{ backgroundColor: badge, color: primary }}>
            {art.caption}
          </span>
        </div>
        <PhotoSurface art={art} />
        <div className="scene-label-row">
          <span className="scene-label-chip scene-label-chip-light">{art.lead}</span>
          {art.trail ? (
            <span className="scene-label-chip" style={{ backgroundColor: secondary, color: primary }}>
              {art.trail}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function CardSurface(props: SharedSceneProps) {
  if (props.art.kind === "alphabet") {
    return <AlphabetCard {...props} />;
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
