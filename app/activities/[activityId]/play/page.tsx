import Link from "next/link";
import { notFound } from "next/navigation";
import { ActivityPlayScene } from "@/app/components/activity-scenes";
import { PlayControls } from "@/app/components/play-controls";
import { getActivityById } from "@/lib/catalog-store";
import { getCountingSetId, getPlayConfigForActivity, getPlayModule } from "@/lib/play-config";

type PlayPageProps = {
  params: Promise<{
    activityId: string;
  }>;
  searchParams: Promise<{
    module?: string;
    card?: string;
    set?: string;
  }>;
};

function buildPlayHref(activityId: string, moduleId: string, cardIndex: number, countingSet?: string) {
  const params = new URLSearchParams();
  params.set("module", moduleId);
  params.set("card", String(cardIndex));

  if (countingSet != null) {
    params.set("set", countingSet);
  }

  return "/activities/" + activityId + "/play?" + params.toString();
}

export default async function ActivityPlayPage({ params, searchParams }: PlayPageProps) {
  const { activityId } = await params;
  const resolvedSearchParams = await searchParams;
  const activity = await getActivityById(activityId);

  if (activity == null) {
    notFound();
  }

  const isAlphabet = activity.id === "alphabet-cards";
  const isCounting = activity.id === "counting-cards";
  const countingSet = isCounting ? getCountingSetId(resolvedSearchParams.set) : undefined;
  const config = getPlayConfigForActivity(activity, { countingSet });
  const activeModule = getPlayModule(config, resolvedSearchParams.module);

  if (activeModule == null) {
    notFound();
  }

  const rawCardIndex = Number.parseInt(resolvedSearchParams.card ?? "0", 10);
  const safeCardIndex = Number.isNaN(rawCardIndex) ? 0 : rawCardIndex;
  const cardIndex = Math.min(Math.max(safeCardIndex, 0), activeModule.cards.length - 1);
  const currentCard = activeModule.cards[cardIndex];
  const progress = String(Math.round(((cardIndex + 1) / activeModule.cards.length) * 100)) + "%";
  const isLastCard = cardIndex === activeModule.cards.length - 1;

  return (
    <main className="bp-play-shell">
      {/* ── TOP BAR ───────────────────────────────────────── */}
      <div className="bp-play-topbar" style={{ borderBottomColor: config.theme.primary + "33" }}>
        <Link className="bp-play-back-link" href="/">
          ← All games
        </Link>
        <div className="bp-play-counter">
          <span className="bp-counter-chip" style={{ backgroundColor: config.theme.badge, color: config.theme.primary }}>
            {cardIndex + 1} / {activeModule.cards.length}
          </span>
          {isLastCard ? <span className="bp-last-chip">🎉 Last one!</span> : null}
        </div>
      </div>

      {/* ── PROGRESS BAR ─────────────────────────────────── */}
      <div className="bp-progress-rail">
        <div
          className="bp-progress-fill"
          style={{ width: progress, backgroundColor: config.theme.primary }}
        />
      </div>

      {/* ── CARD TITLE ───────────────────────────────────── */}
      <div className="bp-card-title-row" style={{ backgroundColor: config.theme.surface }}>
        <div className="bp-card-title-badge" style={{ backgroundColor: config.theme.badge, color: config.theme.primary }}>
          {activeModule.accent}
        </div>
        <h1 className="bp-card-title">{currentCard.title}</h1>
      </div>

      {/* ── CARD PHOTO (fills most of screen) ────────────── */}
      <div className="bp-card-photo-zone" style={{ backgroundColor: config.theme.surface }}>
        <ActivityPlayScene
          art={currentCard.art}
          badge={config.theme.badge}
          ink={config.theme.ink}
          primary={config.theme.primary}
          secondary={config.theme.secondary}
          surface={config.theme.surface}
        />
      </div>

      {/* ── SAY IT STRIP ─────────────────────────────────── */}
      <div className="bp-say-strip" style={{ backgroundColor: config.theme.surface }}>
        <span className="bp-say-label">{isCounting ? "Count" : "Say"}</span>
        <strong className="bp-say-word">{currentCard.example}</strong>
      </div>

      {/* ── STICKY BOTTOM NAV BAR ────────────────────────── */}
      <nav className="bp-nav-bar" aria-label="Card navigation">
        {cardIndex > 0 ? (
          <Link
            className="bp-nav-btn bp-nav-back"
            href={buildPlayHref(activity.id, activeModule.id, cardIndex - 1, countingSet)}
            aria-label="Previous card"
          >
            ← Back
          </Link>
        ) : (
          <span className="bp-nav-btn bp-nav-back bp-nav-disabled">← Back</span>
        )}

        <PlayControls soundText={currentCard.example} title={currentCard.title} />

        {!isLastCard ? (
          <Link
            className="bp-nav-btn bp-nav-next"
            href={buildPlayHref(activity.id, activeModule.id, cardIndex + 1, countingSet)}
            style={{ backgroundColor: config.theme.primary }}
            aria-label="Next card"
          >
            Next →
          </Link>
        ) : (
          <Link
            className="bp-nav-btn bp-nav-next bp-nav-done"
            href={"/activities/" + activity.id}
            style={{ backgroundColor: config.theme.primary }}
          >
            ⭐ Done!
          </Link>
        )}
      </nav>

      {/* ── COMPLETION BANNER ────────────────────────────── */}
      {isLastCard ? (
        <div className="bp-celebrate">
          <span className="bp-celebrate-star">🌟</span>
          <strong>Amazing work!</strong>
          <p>You finished all {activeModule.cards.length} cards!</p>
          <div className="bp-celebrate-actions">
            <Link className="bp-cel-btn bp-cel-restart" href={buildPlayHref(activity.id, activeModule.id, 0, countingSet)}>
              ↺ Play again
            </Link>
            <Link className="bp-cel-btn bp-cel-home" href="/">
              🏠 All games
            </Link>
          </div>
        </div>
      ) : null}

      {/* ── SECONDARY: set switcher / chip grids ─────────── */}
      <section className="bp-secondary" aria-label="More options">
        {isCounting ? (
          <div className="bp-set-switch">
            <div className="bp-set-label">Choose a picture set</div>
            <div className="bp-set-row">
              <Link
                className={"bp-set-chip " + (countingSet === "apples" ? "bp-set-chip-on" : "")}
                href={buildPlayHref(activity.id, activeModule.id, cardIndex, "apples")}
                style={countingSet === "apples" ? { backgroundColor: config.theme.primary, color: "#fff" } : undefined}
              >
                <span className="bp-set-chip-icon">🍎</span>
                <strong>Apple set</strong>
                <span>Same picture every card</span>
              </Link>
              <Link
                className={"bp-set-chip " + (countingSet === "mixed" ? "bp-set-chip-on" : "")}
                href={buildPlayHref(activity.id, activeModule.id, cardIndex, "mixed")}
                style={countingSet === "mixed" ? { backgroundColor: config.theme.primary, color: "#fff" } : undefined}
              >
                <span className="bp-set-chip-icon">🎨</span>
                <strong>Mixed set</strong>
                <span>Different picture each time</span>
              </Link>
            </div>
          </div>
        ) : null}

        {isAlphabet ? (
          <div className="bp-letter-grid" aria-label="Jump to letter">
            {activeModule.cards.map((card, index) => (
              <Link
                className={"bp-letter-chip " + (index === cardIndex ? "bp-letter-chip-on" : "")}
                href={buildPlayHref(activity.id, activeModule.id, index)}
                key={card.id}
                style={index === cardIndex ? { backgroundColor: config.theme.primary, color: "#fff" } : undefined}
                aria-label={"Go to " + card.art.trail}
              >
                {card.art.trail}
              </Link>
            ))}
          </div>
        ) : isCounting ? (
          <div className="bp-count-grid" aria-label="Jump to number">
            {activeModule.cards.map((card, index) => (
              <Link
                className={"bp-count-chip " + (index === cardIndex ? "bp-count-chip-on" : "")}
                href={buildPlayHref(activity.id, activeModule.id, index, countingSet)}
                key={card.id}
                style={index === cardIndex ? { backgroundColor: config.theme.primary, color: "#fff" } : undefined}
                aria-label={"Go to " + card.art.trail}
              >
                <strong>{card.art.trail}</strong>
              </Link>
            ))}
          </div>
        ) : null}

        {config.modules.length > 1 ? (
          <div className="bp-module-row" aria-label="Choose part">
            {config.modules.map((module) => (
              <Link
                className={"bp-module-chip " + (module.id === activeModule.id ? "bp-module-chip-on" : "")}
                href={buildPlayHref(activity.id, module.id, 0, countingSet)}
                key={module.id}
                style={module.id === activeModule.id ? { backgroundColor: config.theme.primary, color: "#fff" } : undefined}
              >
                <strong>{module.title}</strong>
                <span>{module.cards.length} cards</span>
              </Link>
            ))}
          </div>
        ) : null}

        <div className="bp-calm-note">{activeModule.calmNote}</div>
      </section>
    </main>
  );
}


type PlayPageProps = {
  params: Promise<{
    activityId: string;
  }>;
  searchParams: Promise<{
    module?: string;
    card?: string;
    set?: string;
  }>;
};

function buildPlayHref(activityId: string, moduleId: string, cardIndex: number, countingSet?: string) {
  const params = new URLSearchParams();
  params.set("module", moduleId);
  params.set("card", String(cardIndex));

  if (countingSet != null) {
    params.set("set", countingSet);
  }

  return "/activities/" + activityId + "/play?" + params.toString();
}

export default async function ActivityPlayPage({ params, searchParams }: PlayPageProps) {
  const { activityId } = await params;
  const resolvedSearchParams = await searchParams;
  const activity = await getActivityById(activityId);

  if (activity == null) {
    notFound();
  }

  const isAlphabet = activity.id === "alphabet-cards";
  const isCounting = activity.id === "counting-cards";
  const countingSet = isCounting ? getCountingSetId(resolvedSearchParams.set) : undefined;
  const config = getPlayConfigForActivity(activity, { countingSet });
  const activeModule = getPlayModule(config, resolvedSearchParams.module);

  if (activeModule == null) {
    notFound();
  }

  const rawCardIndex = Number.parseInt(resolvedSearchParams.card ?? "0", 10);
  const safeCardIndex = Number.isNaN(rawCardIndex) ? 0 : rawCardIndex;
  const cardIndex = Math.min(Math.max(safeCardIndex, 0), activeModule.cards.length - 1);
  const currentCard = activeModule.cards[cardIndex];
  const progress = String(Math.round(((cardIndex + 1) / activeModule.cards.length) * 100)) + "%";
  const promptLabel = isCounting ? "Count" : "Say";

  const isLastCard = cardIndex === activeModule.cards.length - 1;

  return (
    <main className="app-shell app-shell-play kid-play-shell">
      <div className="page-actions kid-page-actions kid-play-actions">
        <Link className="ghost-button kid-secondary-button" href={"/activities/" + activity.id}>
          ← Back
        </Link>
        <Link className="ghost-button kid-secondary-button" href="/">
          🏠 All games
        </Link>
      </div>

      <section className="play-topbar play-topbar-kid" style={{ backgroundColor: config.theme.surface }}>
        <div>
          <div className="eyebrow">{activity.title}</div>
          <h1>{currentCard.title}</h1>
          <p className="subtle">{activeModule.title}</p>
        </div>
        <div className="play-status kid-play-status">
          <span className="soft-chip">{cardIndex + 1} / {activeModule.cards.length}</span>
          <span className="soft-chip">{activeModule.accent}</span>
          {isLastCard ? <span className="play-last-card-badge">🎉 Last card!</span> : null}
        </div>
      </section>

      <div className="progress-track play-progress-track">
        <div className="progress-track-fill" style={{ width: progress, backgroundColor: config.theme.primary }} />
      </div>

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
              <span className="play-helper-label">Hear and say</span>
              <span className="soft-chip">{activeModule.accent}</span>
            </div>
            <div className="play-nav-dock">
              {cardIndex > 0 ? (
                <Link
                  className="ghost-button play-nav-button"
                  href={buildPlayHref(activity.id, activeModule.id, Math.max(cardIndex - 1, 0), countingSet)}
                >
                  ← Back
                </Link>
              ) : (
                <span className="ghost-button disabled-chip play-nav-button">← Back</span>
              )}

              <PlayControls soundText={currentCard.example} title={currentCard.title} />

              {cardIndex < activeModule.cards.length - 1 ? (
                <Link
                  className="button play-nav-button"
                  href={buildPlayHref(activity.id, activeModule.id, Math.min(cardIndex + 1, activeModule.cards.length - 1), countingSet)}
                >
                  Next →
                </Link>
              ) : (
                <Link className="button play-nav-button" href={"/activities/" + activity.id}>
                  ⭐ All done
                </Link>
              )}
            </div>
          </div>

          <Link className="play-restart-link" href={buildPlayHref(activity.id, activeModule.id, 0, countingSet)}>
            ↺ Start over
          </Link>

          <div className="support-note play-support-note">{activeModule.calmNote}</div>
        </aside>
      </section>

      {isLastCard ? (
        <div className="play-complete-banner">
          <div className="play-complete-emoji">🌟</div>
          <strong>Amazing work!</strong>
          <p>You made it to the last card. Press {isCounting ? "Count" : "Say"} to finish, then tap ⭐ All done.</p>
        </div>
      ) : null}

      <section className="play-secondary-stack" aria-label="More options">
        {isCounting ? (
          <section className="count-set-switch" aria-label="Choose set">
            <div className="count-set-label">Choose set</div>
            <div className="count-set-row">
              <Link
                className={"count-set-chip " + (countingSet === "apples" ? "count-set-chip-active" : "")}
                href={buildPlayHref(activity.id, activeModule.id, cardIndex, "apples")}
              >
                <strong>Apple set</strong>
                <span>Same apple card</span>
              </Link>
              <Link
                className={"count-set-chip " + (countingSet === "mixed" ? "count-set-chip-active" : "")}
                href={buildPlayHref(activity.id, activeModule.id, cardIndex, "mixed")}
              >
                <strong>Mixed set</strong>
                <span>Different picture cards</span>
              </Link>
            </div>
          </section>
        ) : null}

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
                href={buildPlayHref(activity.id, activeModule.id, index, countingSet)}
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

        {config.modules.length > 1 ? (
          <section className="module-rail module-rail-secondary kid-module-rail">
            {config.modules.map((module) => (
              <Link
                className={"module-rail-card kid-module-rail-card " + (module.id === activeModule.id ? "module-rail-card-active" : "")}
                href={buildPlayHref(activity.id, module.id, 0, countingSet)}
                key={module.id}
              >
                <strong>{module.title}</strong>
                <span className="subtle">{module.cards.length} cards</span>
              </Link>
            ))}
          </section>
        ) : null}
      </section>
    </main>
  );
}
