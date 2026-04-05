/**
 * Pizza Pizza! — Pure game logic.
 *
 * Adapted from the Orchard Toys "Pizza, Pizza!" board game for
 * BrightPath Play as a single-player, autism-friendly activity.
 *
 * A pizza board has 8 slices. Each slice needs a topping that matches a
 * colour-shape combination.  The child spins two spinners (colour + shape),
 * then picks a face-down topping card.  Good toppings go on the pizza;
 * yucky toppings go in the bin.  Fill the whole pizza to win!
 */

// ---------------------------------------------------------------------------
// Colours & shapes
// ---------------------------------------------------------------------------

export const COLOURS = ["red", "yellow", "green", "blue"] as const;
export type Colour = (typeof COLOURS)[number];

export const SHAPES = ["circle", "star", "triangle", "square"] as const;
export type Shape = (typeof SHAPES)[number];

export const COLOUR_HEX: Record<Colour, string> = {
  red: "#e74c3c",
  yellow: "#f1c40f",
  green: "#27ae60",
  blue: "#3498db",
};

export const SHAPE_EMOJI: Record<Shape, string> = {
  circle: "⬤",
  star: "★",
  triangle: "▲",
  square: "■",
};

export const COLOUR_LABEL: Record<Colour, string> = {
  red: "Red",
  yellow: "Yellow",
  green: "Green",
  blue: "Blue",
};

export const SHAPE_LABEL: Record<Shape, string> = {
  circle: "Circle",
  star: "Star",
  triangle: "Triangle",
  square: "Square",
};

// ---------------------------------------------------------------------------
// Card back icons — each card gets a unique food icon on its back
// so face-down cards look distinct and picking feels meaningful.
// ---------------------------------------------------------------------------

export const CARD_BACK_ICONS = [
  "🍅", "🧀", "🫒", "🌶️", "🍄", "🌽",
  "🧅", "🫑", "🥦", "🥕", "🍍", "🥚",
] as const;

// ---------------------------------------------------------------------------
// Topping card
// ---------------------------------------------------------------------------

export type ToppingCard = {
  id: string;
  colour: Colour;
  shape: Shape;
  yucky: boolean;
  backIcon: string;
};

// ---------------------------------------------------------------------------
// Board slice
// ---------------------------------------------------------------------------

export type PizzaSlice = {
  colour: Colour;
  shape: Shape;
  filled: boolean;
};

// ---------------------------------------------------------------------------
// Game phase
// ---------------------------------------------------------------------------

export type GamePhase =
  | "ready"      // waiting for the child to tap Spin
  | "spinning"   // spinner animation playing
  | "picking"    // child picks a topping card
  | "reveal"     // card revealed — good or yucky
  | "complete";  // all slices filled — celebration!

// ---------------------------------------------------------------------------
// Game state
// ---------------------------------------------------------------------------

export type GameState = {
  phase: GamePhase;
  board: PizzaSlice[];
  spinColour: Colour | null;
  spinShape: Shape | null;
  faceDownCards: ToppingCard[];
  revealedCard: ToppingCard | null;
  binCount: number;
  message: string;
};

// ---------------------------------------------------------------------------
// Deterministic seeded RNG (mulberry32) — keeps work mode reproducible
// ---------------------------------------------------------------------------

export function mulberry32(seed: number): () => number {
  let s = seed | 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ---------------------------------------------------------------------------
// Shuffle helper
// ---------------------------------------------------------------------------

export function shuffle<T>(array: T[], rand: () => number): T[] {
  const out = [...array];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

// ---------------------------------------------------------------------------
// Board generation
// ---------------------------------------------------------------------------

const BOARD_SIZE = 8;

/**
 * Create 8 unique colour-shape slice targets for the pizza board.
 * We pick 8 out of the 16 possible combos so each slice is distinct.
 */
export function createBoard(rand: () => number): PizzaSlice[] {
  const all: PizzaSlice[] = [];
  for (const colour of COLOURS) {
    for (const shape of SHAPES) {
      all.push({ colour, shape, filled: false });
    }
  }
  return shuffle(all, rand).slice(0, BOARD_SIZE);
}

// ---------------------------------------------------------------------------
// Topping deck generation
// ---------------------------------------------------------------------------

/**
 * Build the face-down topping deck.
 * Includes one card for every board slot plus 4 yucky cards.
 * Each card gets a unique back icon so the face-down side is distinct.
 */
export function createDeck(board: PizzaSlice[], rand: () => number): ToppingCard[] {
  let id = 0;
  const cards: ToppingCard[] = board.map((slice, index) => ({
    id: "topping-" + String(++id),
    colour: slice.colour,
    shape: slice.shape,
    yucky: false,
    backIcon: CARD_BACK_ICONS[index % CARD_BACK_ICONS.length],
  }));

  // Add yucky cards — random colour/shape, but marked yucky
  for (let i = 0; i < 4; i++) {
    cards.push({
      id: "topping-" + String(++id),
      colour: COLOURS[Math.floor(rand() * COLOURS.length)],
      shape: SHAPES[Math.floor(rand() * SHAPES.length)],
      yucky: true,
      backIcon: CARD_BACK_ICONS[(board.length + i) % CARD_BACK_ICONS.length],
    });
  }

  return shuffle(cards, rand);
}

// ---------------------------------------------------------------------------
// Initial state
// ---------------------------------------------------------------------------

export function createInitialState(seed?: number): GameState {
  const rand = mulberry32(seed ?? 42);
  const board = createBoard(rand);
  const faceDownCards = createDeck(board, rand);

  return {
    phase: "ready",
    board,
    spinColour: null,
    spinShape: null,
    faceDownCards,
    revealedCard: null,
    binCount: 0,
    message: "Tap Spin to start!",
  };
}

// ---------------------------------------------------------------------------
// Pick random from spinner
// ---------------------------------------------------------------------------

export function spinColour(rand: () => number): Colour {
  return COLOURS[Math.floor(rand() * COLOURS.length)];
}

export function spinShape(rand: () => number): Shape {
  return SHAPES[Math.floor(rand() * SHAPES.length)];
}

// ---------------------------------------------------------------------------
// Matching logic
// ---------------------------------------------------------------------------

/**
 * Check if a topping card matches the spin result AND an unfilled board slot.
 */
export function cardMatchesSpin(card: ToppingCard, colour: Colour, shape: Shape): boolean {
  return card.colour === colour && card.shape === shape;
}

/**
 * Find which board slot (index) a topping card fills, or -1 if none.
 */
export function findMatchingSlot(board: PizzaSlice[], card: ToppingCard): number {
  return board.findIndex(
    (slice) => !slice.filled && slice.colour === card.colour && slice.shape === card.shape
  );
}

/**
 * Check if the board is fully filled.
 */
export function isBoardComplete(board: PizzaSlice[]): boolean {
  return board.every((slice) => slice.filled);
}

// ---------------------------------------------------------------------------
// State transitions
// ---------------------------------------------------------------------------

/**
 * Transition: child taps Spin → spinners resolve.
 * Returns new state in "picking" phase.
 */
export function doSpin(state: GameState, rand: () => number): GameState {
  if (state.phase !== "ready") return state;

  const colour = spinColour(rand);
  const shape = spinShape(rand);

  return {
    ...state,
    phase: "picking",
    spinColour: colour,
    spinShape: shape,
    revealedCard: null,
    message: `Pick a ${COLOUR_LABEL[colour]} ${SHAPE_LABEL[shape]}!`,
  };
}

/**
 * Transition: child taps a face-down card → reveal it.
 */
export function doReveal(state: GameState, cardId: string, rand: () => number): GameState {
  if (state.phase !== "picking") return state;

  const card = state.faceDownCards.find((c) => c.id === cardId);
  if (card == null) return state;

  // Remove from face-down pile
  const remaining = state.faceDownCards.filter((c) => c.id !== cardId);

  if (card.yucky) {
    return {
      ...state,
      phase: "reveal",
      faceDownCards: shuffle(remaining, rand),
      revealedCard: card,
      binCount: state.binCount + 1,
      message: "Yucky! In the bin!",
    };
  }

  const slotIndex = findMatchingSlot(state.board, card);
  if (slotIndex === -1) {
    // Card doesn't match any unfilled slot — put it back and reshuffle
    // so the child sees a different spread next turn
    return {
      ...state,
      phase: "reveal",
      faceDownCards: shuffle(state.faceDownCards, rand),
      revealedCard: card,
      message: "That one doesn't fit. Try again!",
    };
  }

  // Place on board
  const newBoard = state.board.map((slice, i) =>
    i === slotIndex ? { ...slice, filled: true } : slice
  );

  const complete = isBoardComplete(newBoard);

  return {
    ...state,
    phase: complete ? "complete" : "reveal",
    board: newBoard,
    faceDownCards: shuffle(remaining, rand),
    revealedCard: card,
    binCount: state.binCount,
    message: complete ? "Pizza, Pizza! You did it!" : "Great match!",
  };
}

/**
 * Transition: after reveal, go back to ready for next spin.
 */
export function doContinue(state: GameState): GameState {
  if (state.phase !== "reveal") return state;

  return {
    ...state,
    phase: "ready",
    spinColour: null,
    spinShape: null,
    revealedCard: null,
    message: "Tap Spin to continue!",
  };
}

/**
 * Get face-down cards the child can pick from.
 * Shows up to 6 cards so the spread feels like a real table of cards.
 */
export function getPickableCards(state: GameState): ToppingCard[] {
  return state.faceDownCards.slice(0, Math.min(6, state.faceDownCards.length));
}

/**
 * Count filled slices.
 */
export function filledCount(board: PizzaSlice[]): number {
  return board.filter((s) => s.filled).length;
}
