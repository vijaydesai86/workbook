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
    <main className="app-shell">
      <div className="page-actions">
        <Link className="ghost-button" href="/">
          Back to hub
        </Link>
        <Link className="button" href={playHref}>
          Play now
        </Link>
      </div>

      <section className="detail-hero" style={{ backgroundColor: config.theme.surface }}>
        <div className="detail-hero-copy">
          <div className="eyebrow">{config.coverLabel}</div>
          <h1>{activity.title}</h1>
          <p>{config.supportLine}</p>
          <div className="quick-chip-row">
            <span className="soft-chip">{activity.sessionLength}</span>
            <span className="soft-chip">{config.theme.mascot}</span>
            <span className="soft-chip">{config.modules.length} modes</span>
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

      <section className="detail-layout">
        <div className="detail-main-card">
          <div className="section-head">
            <div>
              <div className="eyebrow">Why this helps</div>
              <h2>Made for real use</h2>
            </div>
          </div>
          <div className="benefit-grid">
            <article className="benefit-card">
              <strong>Visual first</strong>
              <p className="subtle">Large cards, strong picture cues, and clear structure.</p>
            </article>
            <article className="benefit-card">
              <strong>Calm pacing</strong>
              <p className="subtle">No forced timer and no failure-heavy feedback loop.</p>
            </article>
            <article className="benefit-card">
              <strong>Card-matched audio</strong>
              <p className="subtle">Each play card uses its own saved cue instead of a generic sound.</p>
            </article>
          </div>
          <div className="support-note">{config.audience}</div>
        </div>

        <aside className="detail-side-card">
          <div className="section-head">
            <div>
              <div className="eyebrow">Start point</div>
              <h2>Play modules</h2>
            </div>
          </div>
          <div className="module-stack">
            {config.modules.map((module) => (
              <article className="module-stack-card" key={module.id}>
                <div className="meta-row">{module.accent}</div>
                <h3>{module.title}</h3>
                <p className="subtle">{module.description}</p>
                <div className="quick-chip-row">
                  {module.skills.map((skill) => (
                    <span className="quick-chip" key={skill}>
                      {skill}
                    </span>
                  ))}
                </div>
                <div className="support-note">{module.calmNote}</div>
                <Link className="button" href={"/activities/" + activity.id + "/play?module=" + module.id}>
                  Play module
                </Link>
              </article>
            ))}
          </div>
        </aside>
      </section>

      <section className="practice-strip">
        <div className="section-head">
          <div>
            <div className="eyebrow">Practice cards</div>
            <h2>Saved support content</h2>
          </div>
        </div>
        <div className="practice-grid">
          {activity.items.map((item) => (
            <article className="practice-card" key={item.id}>
              <div className="meta-row">{item.kind}</div>
              <h3>{item.title}</h3>
              <p className="subtle">{item.summary}</p>
              <ul>
                {item.steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
