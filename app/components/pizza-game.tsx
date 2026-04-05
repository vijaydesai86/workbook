"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  COLOURS,
  SHAPES,
  COLOUR_HEX,
  COLOUR_LABEL,
  SHAPE_EMOJI,
  SHAPE_LABEL,
  createInitialState,
  doSpin,
  doReveal,
  doContinue,
  getPickableCards,
  filledCount,
  mulberry32,
} from "@/lib/pizza-game";
import type { GameState, ToppingCard } from "@/lib/pizza-game";

// ---------------------------------------------------------------------------
// Spinner animation component
// ---------------------------------------------------------------------------

function SpinnerWheel({
  items,
  result,
  spinning,
  renderItem,
  label,
}: {
  items: readonly string[];
  result: string | null;
  spinning: boolean;
  renderItem: (item: string) => React.ReactNode;
  label: string;
}) {
  return (
    <div className="pizza-spinner-wheel" aria-label={label}>
      <div className="pizza-spinner-label">{label}</div>
      <div className={"pizza-spinner-disc" + (spinning ? " pizza-spinner-disc-spinning" : "")}>
        {result != null ? (
          <div className="pizza-spinner-result">{renderItem(result)}</div>
        ) : (
          <div className="pizza-spinner-placeholder">?</div>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Pizza board SVG
// ---------------------------------------------------------------------------

function PizzaBoard({ board }: { board: GameState["board"] }) {
  const sliceCount = board.length;
  const cx = 150;
  const cy = 150;
  const r = 130;

  function slicePath(index: number): string {
    const angle1 = (index / sliceCount) * 2 * Math.PI - Math.PI / 2;
    const angle2 = ((index + 1) / sliceCount) * 2 * Math.PI - Math.PI / 2;
    const x1 = cx + r * Math.cos(angle1);
    const y1 = cy + r * Math.sin(angle1);
    const x2 = cx + r * Math.cos(angle2);
    const y2 = cy + r * Math.sin(angle2);
    return `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2} Z`;
  }

  function sliceCenter(index: number): { x: number; y: number } {
    const midAngle = ((index + 0.5) / sliceCount) * 2 * Math.PI - Math.PI / 2;
    const dist = r * 0.6;
    return {
      x: cx + dist * Math.cos(midAngle),
      y: cy + dist * Math.sin(midAngle),
    };
  }

  return (
    <svg
      className="pizza-board-svg"
      viewBox="0 0 300 300"
      aria-label="Pizza board"
      role="img"
    >
      {/* Pizza base */}
      <circle cx={cx} cy={cy} r={r + 4} fill="#d4a057" />
      <circle cx={cx} cy={cy} r={r} fill="#f5d89a" />

      {/* Slices */}
      {board.map((slice, i) => {
        const center = sliceCenter(i);
        return (
          <g key={i}>
            <path
              d={slicePath(i)}
              fill={slice.filled ? COLOUR_HEX[slice.colour] : "#f5d89a"}
              stroke="#d4a057"
              strokeWidth="2"
              opacity={slice.filled ? 0.85 : 1}
            />
            {/* Shape target indicator */}
            <text
              x={center.x}
              y={center.y}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={slice.filled ? "28" : "22"}
              fill={slice.filled ? "#fff" : COLOUR_HEX[slice.colour]}
              opacity={slice.filled ? 1 : 0.5}
              aria-label={COLOUR_LABEL[slice.colour] + " " + SHAPE_LABEL[slice.shape]}
            >
              {SHAPE_EMOJI[slice.shape]}
            </text>
          </g>
        );
      })}

      {/* Center circle */}
      <circle cx={cx} cy={cy} r="28" fill="#e74c3c" />
      <text
        x={cx}
        y={cy}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="20"
        fill="#fff"
      >
        🍕
      </text>
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Topping card button
// ---------------------------------------------------------------------------

function ToppingCardButton({
  card,
  revealed,
  onClick,
  disabled,
}: {
  card: ToppingCard;
  revealed: boolean;
  onClick: () => void;
  disabled: boolean;
}) {
  if (revealed) {
    return (
      <div
        className={"pizza-topping-card pizza-topping-card-revealed" + (card.yucky ? " pizza-topping-card-yucky" : " pizza-topping-card-good")}
        aria-label={
          card.yucky
            ? "Yucky topping"
            : COLOUR_LABEL[card.colour] + " " + SHAPE_LABEL[card.shape] + " topping"
        }
      >
        {card.yucky ? (
          <span className="pizza-topping-yucky-icon">🤢</span>
        ) : (
          <>
            <span
              className="pizza-topping-shape"
              style={{ color: COLOUR_HEX[card.colour] }}
            >
              {SHAPE_EMOJI[card.shape]}
            </span>
            <span className="pizza-topping-name">
              {COLOUR_LABEL[card.colour]} {SHAPE_LABEL[card.shape]}
            </span>
          </>
        )}
      </div>
    );
  }

  return (
    <button
      className="pizza-topping-card pizza-topping-card-facedown"
      onClick={onClick}
      disabled={disabled}
      aria-label="Pick this topping card"
      type="button"
    >
      <span className="pizza-topping-back">🍕</span>
      <span className="pizza-topping-tap">Tap!</span>
    </button>
  );
}

// ---------------------------------------------------------------------------
// Main PizzaGame component
// ---------------------------------------------------------------------------

export default function PizzaGame() {
  const [gameState, setGameState] = useState<GameState>(() =>
    createInitialState(42)
  );
  const [spinning, setSpinning] = useState(false);
  const rngRef = useRef(mulberry32(Date.now()));

  const handleSpin = useCallback(() => {
    if (gameState.phase !== "ready") return;

    setSpinning(true);

    // Brief animation delay, then resolve
    setTimeout(() => {
      setSpinning(false);
      setGameState((prev) => doSpin(prev, rngRef.current));
    }, 800);
  }, [gameState.phase]);

  const handlePickCard = useCallback(
    (cardId: string) => {
      if (gameState.phase !== "picking") return;
      setGameState((prev) => doReveal(prev, cardId));
    },
    [gameState.phase]
  );

  const handleContinue = useCallback(() => {
    if (gameState.phase !== "reveal") return;
    setGameState((prev) => doContinue(prev));
  }, [gameState.phase]);

  const handleNewGame = useCallback(() => {
    rngRef.current = mulberry32(Date.now());
    setGameState(createInitialState(Math.floor(Math.random() * 100000)));
  }, []);

  const pickableCards = getPickableCards(gameState);
  const filled = filledCount(gameState.board);
  const total = gameState.board.length;
  const progress = Math.round((filled / total) * 100) + "%";

  return (
    <main className="app-shell app-shell-play kid-play-shell pizza-game-shell">
      {/* Top bar */}
      <div className="page-actions kid-page-actions kid-play-actions">
        <Link
          className="ghost-button kid-secondary-button"
          href="/activities/pizza-pizza"
        >
          ← Back
        </Link>
        <Link className="ghost-button kid-secondary-button" href="/">
          🏠 All games
        </Link>
      </div>

      {/* Header */}
      <section className="play-topbar play-topbar-kid pizza-topbar">
        <div>
          <div className="eyebrow">Pizza, Pizza!</div>
          <h1>Build your pizza</h1>
          <p className="subtle">Match the colour and shape</p>
        </div>
        <div className="play-status kid-play-status">
          <span className="soft-chip">
            {filled} / {total} slices
          </span>
          <span className="soft-chip">🗑️ {gameState.binCount} in bin</span>
        </div>
      </section>

      {/* Progress bar */}
      <div className="progress-track play-progress-track">
        <div
          className="progress-track-fill"
          style={{ width: progress, backgroundColor: "#e74c3c" }}
        />
      </div>

      {/* Game area */}
      <section className="pizza-game-area">
        {/* Pizza board */}
        <div className="pizza-board-container">
          <PizzaBoard board={gameState.board} />
          {gameState.phase === "complete" && (
            <div className="pizza-celebration">
              <div className="pizza-celebration-emoji">🎉</div>
              <strong>Pizza, Pizza!</strong>
              <p>You filled the whole pizza!</p>
            </div>
          )}
        </div>

        {/* Game controls */}
        <div className="pizza-controls">
          {/* Spinners */}
          <div className="pizza-spinners">
            <SpinnerWheel
              items={COLOURS as unknown as string[]}
              result={gameState.spinColour}
              spinning={spinning}
              label="Colour"
              renderItem={(c) => (
                <span
                  className="pizza-spinner-colour-dot"
                  style={{ backgroundColor: COLOUR_HEX[c as keyof typeof COLOUR_HEX] }}
                  aria-label={COLOUR_LABEL[c as keyof typeof COLOUR_LABEL]}
                />
              )}
            />
            <SpinnerWheel
              items={SHAPES as unknown as string[]}
              result={gameState.spinShape}
              spinning={spinning}
              label="Shape"
              renderItem={(s) => (
                <span className="pizza-spinner-shape-icon">
                  {SHAPE_EMOJI[s as keyof typeof SHAPE_EMOJI]}
                </span>
              )}
            />
          </div>

          {/* Message */}
          <div className="pizza-message" aria-live="polite">
            {gameState.message}
          </div>

          {/* Action buttons */}
          <div className="pizza-action-row">
            {gameState.phase === "ready" && (
              <button
                className="button pizza-spin-button"
                onClick={handleSpin}
                disabled={spinning}
                type="button"
              >
                {spinning ? "Spinning…" : "🎰 Spin!"}
              </button>
            )}

            {gameState.phase === "reveal" && (
              <button
                className="button pizza-continue-button"
                onClick={handleContinue}
                type="button"
              >
                Next turn →
              </button>
            )}

            {gameState.phase === "complete" && (
              <button
                className="button pizza-new-game-button"
                onClick={handleNewGame}
                type="button"
              >
                🍕 Play again!
              </button>
            )}
          </div>

          {/* Topping cards */}
          {gameState.phase === "picking" && (
            <div className="pizza-topping-row" aria-label="Pick a topping card">
              <div className="pizza-topping-prompt">Pick a card!</div>
              <div className="pizza-topping-cards">
                {pickableCards.map((card) => (
                  <ToppingCardButton
                    key={card.id}
                    card={card}
                    revealed={false}
                    onClick={() => handlePickCard(card.id)}
                    disabled={false}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Revealed card */}
          {gameState.phase === "reveal" && gameState.revealedCard != null && (
            <div className="pizza-reveal-area">
              <div className="pizza-reveal-label">You picked:</div>
              <ToppingCardButton
                card={gameState.revealedCard}
                revealed={true}
                onClick={() => {}}
                disabled={true}
              />
            </div>
          )}

          {/* Spinner result reminder */}
          {gameState.phase === "picking" &&
            gameState.spinColour != null &&
            gameState.spinShape != null && (
              <div className="pizza-spin-reminder">
                Find:
                <span
                  className="pizza-reminder-dot"
                  style={{
                    backgroundColor: COLOUR_HEX[gameState.spinColour],
                  }}
                />
                <span>{COLOUR_LABEL[gameState.spinColour]}</span>
                <span
                  style={{ color: COLOUR_HEX[gameState.spinColour] }}
                >
                  {SHAPE_EMOJI[gameState.spinShape]}
                </span>
                <span>{SHAPE_LABEL[gameState.spinShape]}</span>
              </div>
            )}
        </div>
      </section>

      {/* Board legend */}
      <section className="pizza-legend" aria-label="Board legend">
        <div className="pizza-legend-title">Your pizza needs:</div>
        <div className="pizza-legend-items">
          {gameState.board.map((slice, i) => (
            <span
              key={i}
              className={
                "pizza-legend-chip" +
                (slice.filled ? " pizza-legend-chip-filled" : "")
              }
            >
              <span style={{ color: COLOUR_HEX[slice.colour] }}>
                {SHAPE_EMOJI[slice.shape]}
              </span>
              <span>
                {COLOUR_LABEL[slice.colour]} {SHAPE_LABEL[slice.shape]}
              </span>
              {slice.filled && <span className="pizza-legend-check">✓</span>}
            </span>
          ))}
        </div>
      </section>
    </main>
  );
}
