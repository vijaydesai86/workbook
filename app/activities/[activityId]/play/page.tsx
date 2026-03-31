import Link from "next/link";
import { notFound } from "next/navigation";
import { ActivityPlayScene } from "@/app/components/activity-scenes";
import { PlayControls } from "@/app/components/play-controls";
import { getActivityById } from "@/lib/catalog-store";
import { getPlayConfigForActivity, getPlayModule } from "@/lib/play-config";

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
  return "/activities/" + activityId + "/play?module=" + moduleId + "&card=" + String(cardIndex);
}

export default async function ActivityPlayPage({ params, searchParams }: PlayPageProps) {
  const { activityId } = await params;
  const resolvedSearchParams = await searchParams;
  const activity = await getActivityById(activityId);

  if (activity == null) {
    notFound();
  }

  const config = getPlayConfigForActivity(activity);
  const activeModule = getPlayModule(config, resolvedSearchParams.module);

  if (activeModule == null) {
    notFound();
  }

  const rawCardIndex = Number.parseInt(resolvedSearchParams.card ?? "0", 10);
  const safeCardIndex = Number.isNaN(rawCardIndex) ? 0 : rawCardIndex;
  const cardIndex = Math.min(Math.max(safeCardIndex, 0), activeModule.cards.length - 1);
  const currentCard = activeModule.cards[cardIndex];
  const progress = String(((cardIndex + 1) / activeModule.cards.length) * 100) + "%";
  const showStepStrip = activeModule.cards.length <= 6;
  const phraseLabel = activity.id === "alphabet-cards" ? "Say this" : "Try saying";
  const helperLine = activity.id === "alphabet-cards"
    ? "Look at the picture and say the letter, then the word."
    : "Look at the picture and say the sentence one time.";

  return (
    <main className="app-shell app-shell-play">
      <div className="page-actions">
        <Link className="ghost-button" href={"/activities/" + activity.id}>
          Back to activity
        </Link>
        <Link className="ghost-button" href="/">
          Activity hub
        </Link>
      </div>

      <section className="play-topbar play-topbar-kid" style={{ backgroundColor: config.theme.surface }}>
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

      {showStepStrip ? (
        <section className="play-step-strip">
          {activeModule.cards.map((card, index) => (
            <Link
              className={"play-step-chip " + (index === cardIndex ? "play-step-chip-active" : "")}
              href={buildPlayHref(activity.id, activeModule.id, index)}
              key={card.id}
            >
              {card.title}
            </Link>
          ))}
        </section>
      ) : null}

      <div className="progress-track play-progress-track">
        <div className="progress-track-fill" style={{ width: progress, backgroundColor: config.theme.primary }} />
      </div>

      <section className="play-stage-layout">
        <div className="play-visual-panel" style={{ backgroundColor: config.theme.surface }}>
          <ActivityPlayScene
            art={currentCard.art}
            badge={config.theme.badge}
            ink={config.theme.ink}
            primary={config.theme.primary}
            secondary={config.theme.secondary}
            surface={config.theme.surface}
          />
        </div>

        <aside className="play-story-panel" style={{ backgroundColor: config.theme.surface }}>
          <div className="play-story-kicker">{activity.title}</div>
          <h2>{currentCard.title}</h2>
          <p className="subtle play-story-copy">{helperLine}</p>

          <div className="play-phrase-card">
            <span className="meta-row">{phraseLabel}</span>
            <strong>{currentCard.example}</strong>
          </div>

          <PlayControls soundText={currentCard.example} title={currentCard.title} />

          <div className="support-note">{activeModule.calmNote}</div>

          <div className="play-actions">
            {cardIndex > 0 ? (
              <Link className="ghost-button" href={buildPlayHref(activity.id, activeModule.id, Math.max(cardIndex - 1, 0))}>
                Previous
              </Link>
            ) : (
              <span className="ghost-button disabled-chip">Previous</span>
            )}
            <Link className="ghost-button" href={buildPlayHref(activity.id, activeModule.id, 0)}>
              Restart
            </Link>
            {cardIndex < activeModule.cards.length - 1 ? (
              <Link className="button" href={buildPlayHref(activity.id, activeModule.id, Math.min(cardIndex + 1, activeModule.cards.length - 1))}>
                Next card
              </Link>
            ) : (
              <Link className="button" href={"/activities/" + activity.id}>
                Finish
              </Link>
            )}
          </div>
        </aside>
      </section>

      {config.modules.length > 1 ? (
        <section className="module-rail module-rail-secondary">
          {config.modules.map((module) => (
            <Link
              className={"module-rail-card " + (module.id === activeModule.id ? "module-rail-card-active" : "")}
              href={buildPlayHref(activity.id, module.id, 0)}
              key={module.id}
            >
              <strong>{module.title}</strong>
              <span className="subtle">{module.accent}</span>
            </Link>
          ))}
        </section>
      ) : null}
    </main>
  );
}
