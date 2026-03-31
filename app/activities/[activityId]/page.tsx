import Link from "next/link";
import { notFound } from "next/navigation";
import { ActivityPosterScene } from "@/app/components/activity-scenes";
import { getActivityById } from "@/lib/catalog-store";
import { getPlayConfigForActivity } from "@/lib/play-config";

type ActivityPageProps = {
  params: Promise<{
    activityId: string;
  }>;
};

export default async function ActivityPage({ params }: ActivityPageProps) {
  const { activityId } = await params;
  const activity = await getActivityById(activityId);

  if (activity == null) {
    notFound();
  }

  const config = getPlayConfigForActivity(activity);
  const firstCard = config.modules[0]?.cards[0];
  const playHref = "/activities/" + activity.id + "/play?module=" + config.defaultModuleId;

  return (
    <main className="app-shell kid-detail-shell">
      <div className="page-actions kid-page-actions">
        <Link className="ghost-button kid-secondary-button" href="/">
          All games
        </Link>
        <Link className="button kid-main-button" href={playHref}>
          Play now
        </Link>
      </div>

      <section className="detail-hero kid-detail-hero" style={{ backgroundColor: config.theme.surface }}>
        <div className="detail-hero-copy kid-detail-copy">
          <div className="eyebrow">Picture game</div>
          <h1>{activity.title}</h1>
          <p>{config.supportLine}</p>
          <div className="quick-chip-row">
            <span className="soft-chip">{config.modules.length} parts</span>
            <span className="soft-chip">{config.theme.mascot}</span>
            <span className="soft-chip">real photo cards</span>
          </div>
          <div className="hero-actions kid-hero-actions">
            <Link className="button kid-main-button" href={playHref}>
              Start this game
            </Link>
          </div>
        </div>
        <ActivityPosterScene
          art={firstCard?.art ?? { kind: "letter", lead: activity.title.slice(0, 1).toUpperCase(), caption: config.supportLine }}
          badge={config.theme.badge}
          ink={config.theme.ink}
          primary={config.theme.primary}
          secondary={config.theme.secondary}
          surface={config.theme.surface}
          title={config.coverLabel}
        />
      </section>

      <section className="detail-layout kid-detail-layout">
        {config.modules.map((module) => (
          <article className="detail-side-card kid-module-card" key={module.id}>
            <div className="eyebrow">{module.accent}</div>
            <h2>{module.title}</h2>
            <p className="subtle">{module.description}</p>
            <div className="quick-chip-row">
              {module.skills.map((skill) => (
                <span className="quick-chip" key={skill}>
                  {skill}
                </span>
              ))}
            </div>
            <div className="support-note">{module.calmNote}</div>
            <Link className="button kid-main-button" href={"/activities/" + activity.id + "/play?module=" + module.id}>
              Play {module.title}
            </Link>
          </article>
        ))}
      </section>
    </main>
  );
}
