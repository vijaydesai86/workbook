import Image from "next/image";
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
  const isAlphabet = activity.id === "alphabet-cards";
  const isCounting = activity.id === "counting-cards";
  const promptLabel = isCounting ? "Count" : "Say";

  return (
    <main className="app-shell app-shell-play kid-play-shell">
      <div className="page-actions kid-page-actions kid-play-actions">
        <Link className="ghost-button kid-secondary-button" href={"/activities/" + activity.id}>
          Back to game
        </Link>
        <Link className="ghost-button kid-secondary-button" href="/">
          All games
        </Link>
      </div>

      <section className="play-topbar play-topbar-kid" style={{ backgroundColor: config.theme.surface }}>
        <div>
          <div className="eyebrow">{activity.title}</div>
          <h1>{currentCard.title}</h1>
          <p className="subtle">{activeModule.title}</p>
        </div>
        <div className="play-status kid-play-status">
          <span className="soft-chip">Card {cardIndex + 1} of {activeModule.cards.length}</span>
          <span className="soft-chip">{config.theme.mascot}</span>
        </div>
      </section>

      <div className="progress-track play-progress-track">
        <div className="progress-track-fill" style={{ width: progress, backgroundColor: config.theme.primary }} />
      </div>

      {isAlphabet ? (
        <section className="play-letter-grid" aria-label="Alphabet cards">
          {activeModule.cards.map((card, index) => (
            <Link
              className={"play-letter-chip " + (index === cardIndex ? "play-letter-chip-active" : "")}
              href={buildPlayHref(activity.id, activeModule.id, index)}
              key={card.id}
            >
              {card.art.trail}
            </Link>
          ))}
        </section>
      ) : isCounting ? (
        <section className="play-count-grid" aria-label="Counting cards">
          {activeModule.cards.map((card, index) => (
            <Link
              className={"play-count-chip " + (index === cardIndex ? "play-count-chip-active" : "")}
              href={buildPlayHref(activity.id, activeModule.id, index)}
              key={card.id}
            >
              <strong>{card.art.trail}</strong>
              <span>{card.title}</span>
            </Link>
          ))}
        </section>
      ) : (
        <section className="play-scene-grid" aria-label="Scene cards">
          {activeModule.cards.map((card, index) => (
            <Link
              className={"play-scene-thumb " + (index === cardIndex ? "play-scene-thumb-active" : "")}
              href={buildPlayHref(activity.id, activeModule.id, index)}
              key={card.id}
            >
              <div className="play-scene-thumb-media">
                {card.art.imageSrc ? (
                  <Image
                    alt={card.art.imageAlt ?? card.title}
                    className="play-scene-thumb-image"
                    fill
                    sizes="(max-width: 720px) 45vw, 180px"
                    src={card.art.imageSrc}
                  />
                ) : null}
              </div>
              <span className="play-scene-thumb-label">{card.title}</span>
            </Link>
          ))}
        </section>
      )}

      <section className="play-stage-layout play-stage-layout-kid">
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

        <aside className="play-story-panel play-story-panel-kid" style={{ backgroundColor: config.theme.surface }}>
          <div className="play-say-card">
            <p className="play-say-label">{promptLabel}</p>
            <strong>{currentCard.example}</strong>
            <p className="subtle">{currentCard.prompt}</p>
          </div>

          <div className="play-helper-card">
            <div className="play-helper-row">
              <span className="play-helper-label">Listen, then try</span>
              <span className="soft-chip">{activeModule.accent}</span>
            </div>
            <div className="play-nav-dock">
              {cardIndex > 0 ? (
                <Link className="ghost-button play-nav-button" href={buildPlayHref(activity.id, activeModule.id, Math.max(cardIndex - 1, 0))}>
                  Back
                </Link>
              ) : (
                <span className="ghost-button disabled-chip play-nav-button">Back</span>
              )}

              <PlayControls soundText={currentCard.example} title={currentCard.title} />

              {cardIndex < activeModule.cards.length - 1 ? (
                <Link className="button play-nav-button" href={buildPlayHref(activity.id, activeModule.id, Math.min(cardIndex + 1, activeModule.cards.length - 1))}>
                  Next card
                </Link>
              ) : (
                <Link className="button play-nav-button" href={"/activities/" + activity.id}>
                  All done
                </Link>
              )}
            </div>
          </div>

          <Link className="play-restart-link" href={buildPlayHref(activity.id, activeModule.id, 0)}>
            Start this part again
          </Link>

          <div className="support-note play-support-note">{activeModule.calmNote}</div>
        </aside>
      </section>

      {config.modules.length > 1 ? (
        <section className="module-rail module-rail-secondary kid-module-rail">
          {config.modules.map((module) => (
            <Link
              className={"module-rail-card kid-module-rail-card " + (module.id === activeModule.id ? "module-rail-card-active" : "")}
              href={buildPlayHref(activity.id, module.id, 0)}
              key={module.id}
            >
              <strong>{module.title}</strong>
              <span className="subtle">{module.cards.length} cards</span>
            </Link>
          ))}
        </section>
      ) : null}
    </main>
  );
}
