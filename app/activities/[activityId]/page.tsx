import Link from "next/link";
import { notFound } from "next/navigation";
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

  if (!activity) {
    notFound();
  }

  const playConfig = getPlayConfigForActivity(activity);

  return (
    <main className="page-shell">
      <div className="page-actions">
        <Link className="ghost-button" href="/">
          Back to hub
        </Link>
        <Link className="button" href={`/activities/${activity.id}/play`}>
          Play activity
        </Link>
      </div>

      <section className="panel">
        <div className="detail-head">
          <div>
            <div className="meta-row">{activity.category}</div>
            <h1 style={{ marginTop: 6, marginBottom: 10 }}>{activity.title}</h1>
            <p className="subtle" style={{ maxWidth: 820 }}>
              {activity.summary}
            </p>
          </div>
          <div className="pill-row">
            <span className="pill">{activity.goal}</span>
            <span className="pill">{activity.sessionLength}</span>
          </div>
        </div>
      </section>

      <section className="panel" style={{ marginTop: 20 }}>
        <div className="detail-head">
          <div>
            <div className="meta-row">Play modules</div>
            <h2 style={{ marginTop: 6 }}>Choose a module</h2>
          </div>
          <div className="subtle">{playConfig.modules.length} clickable modules</div>
        </div>
        <div className="module-grid" style={{ marginTop: 18 }}>
          {playConfig.modules.map((module) => (
            <article className="module-card" key={module.id}>
              <div className="meta-row">{module.accent}</div>
              <h3>{module.title}</h3>
              <p className="subtle">{module.description}</p>
              <div className="pill-row" style={{ marginTop: 12 }}>
                <span className="pill">{module.cards.length} cards</span>
              </div>
              <div className="card-actions">
                <Link className="button" href={`/activities/${activity.id}/play?module=${module.id}`}>
                  Play module
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="panel" style={{ marginTop: 20 }}>
        <div className="meta-row">Saved content</div>
        <h2 style={{ marginTop: 6 }}>Practice items</h2>
        <div className="item-grid" style={{ marginTop: 18 }}>
          {activity.items.map((item) => (
            <article className="item-card" key={item.id}>
              <div className="meta-row">{item.kind}</div>
              <h3>{item.title}</h3>
              <div className="subtle">{item.summary}</div>
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
