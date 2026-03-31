import Link from "next/link";
import { notFound } from "next/navigation";
import { getActivityById } from "@/lib/catalog-store";
import { getPlayConfigForActivity, getPlayModule, type ActivityArt } from "@/lib/play-config";

type PlayPageProps = {
  params: Promise<{
    activityId: string;
  }>;
  searchParams: Promise<{
    module?: string;
    card?: string;
  }>;
};

function buildPlayHref(activityId: string, moduleId: string, cardIndex: number) {
  return `/activities/${activityId}/play?module=${moduleId}&card=${cardIndex}`;
}

function ArtBoard({ art, primary, secondary, ink }: { art: ActivityArt; primary: string; secondary: string; ink: string }) {
  const sharedStyle = {
    backgroundColor: secondary,
    color: primary,
    borderColor: primary
  };

  if (art.kind === "keyboard") {
    return (
      <div className="art-board art-board-keyboard" style={{ background: `linear-gradient(145deg, ${secondary}, white)`, color: ink }}>
        <div className="keyboard-row">
          <span className="key-cap">Q</span>
          <span className="key-cap">W</span>
          <span className="key-cap active-key" style={sharedStyle}>{art.lead}</span>
          <span className="key-cap">R</span>
          <span className="key-cap">T</span>
        </div>
        <div className="art-caption">{art.caption}</div>
      </div>
    );
  }

  if (art.kind === "pair") {
    return (
      <div className="art-board art-board-pair" style={{ background: `linear-gradient(145deg, ${secondary}, white)`, color: ink }}>
        <div className="pair-token" style={sharedStyle}>{art.lead}</div>
        <div className="pair-bridge" style={{ backgroundColor: primary }} />
        <div className="pair-token" style={sharedStyle}>{art.trail}</div>
        <div className="art-caption">{art.caption}</div>
      </div>
    );
  }

  if (art.kind === "conversation") {
    return (
      <div className="art-board art-board-conversation" style={{ background: `linear-gradient(145deg, ${secondary}, white)`, color: ink }}>
        <div className="speech-bubble left" style={sharedStyle}>{art.lead}</div>
        <div className="speech-bubble right" style={{ backgroundColor: "white", color: primary, borderColor: primary }}>{art.trail}</div>
        <div className="art-caption">{art.caption}</div>
      </div>
    );
  }

  if (art.kind === "choice") {
    return (
      <div className="art-board art-board-choice" style={{ background: `linear-gradient(145deg, ${secondary}, white)`, color: ink }}>
        <div className="choice-card" style={sharedStyle}>{art.lead}</div>
        <div className="choice-card" style={{ backgroundColor: "white", color: primary, borderColor: primary }}>{art.trail}</div>
        <div className="art-caption">{art.caption}</div>
      </div>
    );
  }

  return (
    <div className="art-board art-board-letter" style={{ background: `linear-gradient(145deg, ${secondary}, white)`, color: ink }}>
      <div className="letter-disk" style={sharedStyle}>{art.lead}</div>
      <div className="art-caption">{art.caption}</div>
    </div>
  );
}

export default async function ActivityPlayPage({ params, searchParams }: PlayPageProps) {
  const { activityId } = await params;
  const resolvedSearchParams = await searchParams;
  const activity = await getActivityById(activityId);

  if (!activity) {
    notFound();
  }

  const config = getPlayConfigForActivity(activity);
  const activeModule = getPlayModule(config, resolvedSearchParams.module);

  if (!activeModule) {
    notFound();
  }

  const rawCardIndex = Number.parseInt(resolvedSearchParams.card ?? "0", 10);
  const cardIndex = Number.isNaN(rawCardIndex)
    ? 0
    : Math.min(Math.max(rawCardIndex, 0), activeModule.cards.length - 1);

  const currentCard = activeModule.cards[cardIndex];
  const progress = `${((cardIndex + 1) / activeModule.cards.length) * 100}%`;

  return (
    <main className="app-shell">
      <div className="page-actions">
        <Link className="ghost-button" href={`/activities/${activity.id}`}>Back to activity</Link>
        <Link className="ghost-button" href="/">Activity hub</Link>
      </div>

      <section className="play-topbar" style={{ backgroundColor: config.theme.surface }}>
        <div>
          <div className="eyebrow">{activity.title}</div>
          <h1>{activeModule.title}</h1>
          <p className="subtle">{activeModule.description}</p>
        </div>
        <div className="play-status">
          <span className="soft-chip">Card {cardIndex + 1} of {activeModule.cards.length}</span>
          <span className="soft-chip">{config.theme.mascot}</span>
        </div>
      </section>

      <section className="module-rail">
        {config.modules.map((module) => (
          <Link
            className={`module-rail-card ${module.id === activeModule.id ? "module-rail-card-active" : ""}`}
            href={buildPlayHref(activity.id, module.id, 0)}
            key={module.id}
          >
            <strong>{module.title}</strong>
            <span className="subtle">{module.accent}</span>
          </Link>
        ))}
      </section>

      <div className="progress-track">
        <div className="progress-track-fill" style={{ width: progress, backgroundColor: config.theme.primary }} />
      </div>

      <section className="play-layout">
        <div className="play-board" style={{ backgroundColor: config.theme.surface }}>
          <ArtBoard art={currentCard.art} primary={config.theme.primary} secondary={config.theme.secondary} ink={config.theme.ink} />
        </div>

        <aside className="play-guide">
          <div className="guide-card">
            <div className="eyebrow">What to do</div>
            <h2>{currentCard.title}</h2>
            <p>{currentCard.prompt}</p>
          </div>
          <div className="guide-grid">
            <article className="guide-mini-card">
              <div className="meta-row">Focus</div>
              <strong>{currentCard.focus}</strong>
            </article>
            <article className="guide-mini-card">
              <div className="meta-row">Cue</div>
              <strong>{currentCard.cue}</strong>
            </article>
            <article className="guide-mini-card">
              <div className="meta-row">Example</div>
              <strong>{currentCard.example}</strong>
            </article>
          </div>
          <div className="support-note">{activeModule.calmNote}</div>
          <div className="play-actions">
            {cardIndex > 0 ? (
              <Link className="ghost-button" href={buildPlayHref(activity.id, activeModule.id, Math.max(cardIndex - 1, 0))}>Previous</Link>
            ) : (
              <span className="ghost-button disabled-chip">Previous</span>
            )}
            <Link className="ghost-button" href={buildPlayHref(activity.id, activeModule.id, 0)}>Restart</Link>
            {cardIndex < activeModule.cards.length - 1 ? (
              <Link className="button" href={buildPlayHref(activity.id, activeModule.id, Math.min(cardIndex + 1, activeModule.cards.length - 1))}>Next card</Link>
            ) : (
              <Link className="button" href={`/activities/${activity.id}`}>Finish</Link>
            )}
          </div>
        </aside>
      </section>
    </main>
  );
}
