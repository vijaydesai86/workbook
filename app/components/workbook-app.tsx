"use client";

import Link from "next/link";
import { useMemo } from "react";
import { ActivityPosterScene } from "@/app/components/activity-scenes";
import { getActivityMeta } from "@/lib/activity-meta";
import { getPlayConfigForActivity } from "@/lib/play-config";
import type { Activity, Catalog } from "@/lib/types";

type WorkbookAppProps = {
  initialCatalog: Catalog;
};

function GameCard({ activity }: { activity: Activity }) {
  const config = useMemo(() => getPlayConfigForActivity(activity), [activity]);
  const meta = getActivityMeta(activity.id);
  const firstModule = config.modules[0];
  const totalCards = config.modules.reduce((sum, m) => sum + m.cards.length, 0);
  const playHref = "/activities/" + activity.id + "/play?module=" + String(firstModule?.id ?? "");

  const fallbackArt = {
    kind: "letter" as const,
    lead: activity.title.slice(0, 1).toUpperCase(),
    caption: config.supportLine
  };

  return (
    <div className="bp-game-card" style={{ "--card-primary": config.theme.primary, "--card-surface": config.theme.surface } as React.CSSProperties}>
      <div className="bp-game-card-preview" style={{ backgroundColor: config.theme.surface }}>
        <ActivityPosterScene
          art={firstModule?.cards[0]?.art ?? fallbackArt}
          badge={config.theme.badge}
          ink={config.theme.ink}
          primary={config.theme.primary}
          secondary={config.theme.secondary}
          surface={config.theme.surface}
          title={config.coverLabel}
        />
      </div>
      <div className="bp-game-card-body">
        <div className="bp-game-card-emoji">{meta.emoji}</div>
        <h2 className="bp-game-card-title">{activity.title}</h2>
        <p className="bp-game-card-desc">{config.supportLine}</p>
        <div className="bp-game-card-chips">
          <span className="bp-chip">{totalCards} cards</span>
          <span className="bp-chip">{config.modules.length} {config.modules.length === 1 ? "part" : "parts"}</span>
        </div>
        <Link
          className="bp-play-btn"
          href={playHref}
          style={{ backgroundColor: config.theme.primary }}
        >
          ▶ Play
        </Link>
      </div>
    </div>
  );
}

export function WorkbookApp({ initialCatalog }: WorkbookAppProps) {
  return (
    <main className="bp-home-shell">
      <header className="bp-topbar">
        <Link className="bp-brand" href="/">
          BrightPath Play
        </Link>
        <Link className="bp-adult-link" href="/caregiver">
          Adult area
        </Link>
      </header>

      <section className="bp-hero">
        <h1 className="bp-hero-title">Let&rsquo;s learn! 🌟</h1>
        <p className="bp-hero-sub">Pick a game below to start</p>
      </section>

      <div className="bp-game-grid">
        {initialCatalog.activities.map((activity) => (
          <GameCard activity={activity} key={activity.id} />
        ))}
      </div>

      <footer className="bp-home-footer">
        <Link className="bp-caregiver-link" href="/caregiver">
          ⚙️ Adult / caregiver area
        </Link>
      </footer>
    </main>
  );
}
