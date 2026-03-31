import Link from "next/link";
import { notFound } from "next/navigation";
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
  return `/activities/${activityId}/play?module=${moduleId}&card=${cardIndex}`;
}

export default async function ActivityPlayPage({ params, searchParams }: PlayPageProps) {
  const { activityId } = await params;
  const resolvedSearchParams = await searchParams;
  const activity = await getActivityById(activityId);

  if (!activity) {
    notFound();
  }

  const playConfig = getPlayConfigForActivity(activity);
  const activeModule = getPlayModule(playConfig, resolvedSearchParams.module);

  if (!activeModule) {
    notFound();
  }

  const rawCardIndex = Number.parseInt(resolvedSearchParams.card ?? "0", 10);
  const cardIndex = Number.isNaN(rawCardIndex)
    ? 0
    : Math.min(Math.max(rawCardIndex, 0), activeModule.cards.length - 1);
  const currentCard = activeModule.cards[cardIndex];
  const previousHref = buildPlayHref(activity.id, activeModule.id, Math.max(cardIndex - 1, 0));
  const nextHref = buildPlayHref(
    activity.id,
    activeModule.id,
    Math.min(cardIndex + 1, activeModule.cards.length - 1)
  );

  return (
    <main className="page-shell">
      <div className="page-actions">
        <Link className="ghost-button" href={`/activities/${activity.id}`}>
          Back to activity
        </Link>
        <Link className="ghost-button" href="/">
          Activity hub
        </Link>
      </div>

      <section className="panel">
        <div className="detail-head">
          <div>
            <div className="meta-row">{activity.title} / Play</div>
            <h1 style={{ marginTop: 6, marginBottom: 10 }}>{activeModule.title}</h1>
            <p className="subtle" style={{ maxWidth: 760 }}>
              {activeModule.description}
            </p>
          </div>
          <div className="pill-row">
            <span className="pill">Card {cardIndex + 1} of {activeModule.cards.length}</span>
            <span className="pill">{activeModule.accent}</span>
          </div>
        </div>
      </section>

      <section className="panel" style={{ marginTop: 20 }}>
        <div className="module-grid">
          {playConfig.modules.map((module) => (
            <Link
              className={`module-card ${module.id === activeModule.id ? "module-card-active" : ""}`}
              href={buildPlayHref(activity.id, module.id, 0)}
              key={module.id}
            >
              <div className="meta-row">{module.accent}</div>
              <h3>{module.title}</h3>
              <div className="subtle">{module.description}</div>
            </Link>
          ))}
        </div>
      </section>

      <section className="play-stage" style={{ marginTop: 20 }}>
        <div className="stage-kicker">{activity.category}</div>
        <h2 className="stage-title">{currentCard.title}</h2>
        <p className="stage-prompt">{currentCard.prompt}</p>

        <div className="helper-grid" style={{ marginTop: 18 }}>
          <article className="helper-card">
            <div className="meta-row">Focus</div>
            <strong>{currentCard.focus}</strong>
          </article>
          <article className="helper-card">
            <div className="meta-row">Cue</div>
            <strong>{currentCard.cue}</strong>
          </article>
          <article className="helper-card">
            <div className="meta-row">Example</div>
            <strong>{currentCard.example}</strong>
          </article>
        </div>

        <div className="stage-nav">
          {cardIndex > 0 ? (
            <Link className="ghost-button" href={previousHref}>
              Previous
            </Link>
          ) : (
            <span className="ghost-button disabled-chip">Previous</span>
          )}
          <Link className="ghost-button" href={buildPlayHref(activity.id, activeModule.id, 0)}>
            Restart
          </Link>
          {cardIndex < activeModule.cards.length - 1 ? (
            <Link className="button" href={nextHref}>
              Next
            </Link>
          ) : (
            <Link className="button" href={`/activities/${activity.id}`}>
              Finish module
            </Link>
          )}
        </div>
      </section>
    </main>
  );
}
