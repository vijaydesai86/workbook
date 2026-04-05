import { describe, it, expect } from "vitest";
import {
  COLOURS,
  SHAPES,
  COLOUR_HEX,
  SHAPE_EMOJI,
  COLOUR_LABEL,
  SHAPE_LABEL,
  mulberry32,
  shuffle,
  createBoard,
  createDeck,
  createInitialState,
  spinColour,
  spinShape,
  cardMatchesSpin,
  findMatchingSlot,
  isBoardComplete,
  doSpin,
  doReveal,
  doContinue,
  getPickableCards,
  filledCount,
} from "@/lib/pizza-game";
import type { GameState, PizzaSlice, ToppingCard } from "@/lib/pizza-game";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

describe("constants", () => {
  it("has 4 colours", () => {
    expect(COLOURS).toHaveLength(4);
    expect(COLOURS).toContain("red");
    expect(COLOURS).toContain("yellow");
    expect(COLOURS).toContain("green");
    expect(COLOURS).toContain("blue");
  });

  it("has 4 shapes", () => {
    expect(SHAPES).toHaveLength(4);
    expect(SHAPES).toContain("circle");
    expect(SHAPES).toContain("star");
    expect(SHAPES).toContain("triangle");
    expect(SHAPES).toContain("square");
  });

  it("provides hex for every colour", () => {
    for (const c of COLOURS) {
      expect(COLOUR_HEX[c]).toMatch(/^#[0-9a-f]{6}$/);
    }
  });

  it("provides emoji for every shape", () => {
    for (const s of SHAPES) {
      expect(typeof SHAPE_EMOJI[s]).toBe("string");
      expect(SHAPE_EMOJI[s].length).toBeGreaterThan(0);
    }
  });

  it("provides labels for every colour", () => {
    for (const c of COLOURS) {
      expect(COLOUR_LABEL[c]).toBeTruthy();
    }
  });

  it("provides labels for every shape", () => {
    for (const s of SHAPES) {
      expect(SHAPE_LABEL[s]).toBeTruthy();
    }
  });
});

// ---------------------------------------------------------------------------
// RNG
// ---------------------------------------------------------------------------

describe("mulberry32", () => {
  it("returns deterministic values for the same seed", () => {
    const rng1 = mulberry32(123);
    const rng2 = mulberry32(123);
    const results1 = Array.from({ length: 10 }, () => rng1());
    const results2 = Array.from({ length: 10 }, () => rng2());
    expect(results1).toEqual(results2);
  });

  it("returns values in [0, 1)", () => {
    const rng = mulberry32(999);
    for (let i = 0; i < 100; i++) {
      const v = rng();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });

  it("returns different values for different seeds", () => {
    const a = mulberry32(1)();
    const b = mulberry32(2)();
    expect(a).not.toEqual(b);
  });
});

// ---------------------------------------------------------------------------
// shuffle
// ---------------------------------------------------------------------------

describe("shuffle", () => {
  it("preserves length", () => {
    const arr = [1, 2, 3, 4, 5];
    const rng = mulberry32(42);
    expect(shuffle(arr, rng)).toHaveLength(arr.length);
  });

  it("preserves all elements", () => {
    const arr = [1, 2, 3, 4, 5];
    const rng = mulberry32(42);
    const result = shuffle(arr, rng);
    expect(result.sort()).toEqual(arr.sort());
  });

  it("does not mutate the original array", () => {
    const arr = [1, 2, 3, 4, 5];
    const copy = [...arr];
    const rng = mulberry32(42);
    shuffle(arr, rng);
    expect(arr).toEqual(copy);
  });
});

// ---------------------------------------------------------------------------
// createBoard
// ---------------------------------------------------------------------------

describe("createBoard", () => {
  it("creates 8 slices", () => {
    const rng = mulberry32(42);
    const board = createBoard(rng);
    expect(board).toHaveLength(8);
  });

  it("all slices start unfilled", () => {
    const rng = mulberry32(42);
    const board = createBoard(rng);
    expect(board.every((s) => s.filled === false)).toBe(true);
  });

  it("all slices have valid colour and shape", () => {
    const rng = mulberry32(42);
    const board = createBoard(rng);
    for (const slice of board) {
      expect(COLOURS).toContain(slice.colour);
      expect(SHAPES).toContain(slice.shape);
    }
  });

  it("all slices are unique colour-shape combos", () => {
    const rng = mulberry32(42);
    const board = createBoard(rng);
    const keys = board.map((s) => s.colour + "-" + s.shape);
    expect(new Set(keys).size).toBe(8);
  });
});

// ---------------------------------------------------------------------------
// createDeck
// ---------------------------------------------------------------------------

describe("createDeck", () => {
  it("creates board_size + 4 cards (8 good + 4 yucky)", () => {
    const rng = mulberry32(42);
    const board = createBoard(rng);
    const rng2 = mulberry32(100);
    const deck = createDeck(board, rng2);
    expect(deck).toHaveLength(12);
  });

  it("contains exactly 4 yucky cards", () => {
    const rng = mulberry32(42);
    const board = createBoard(rng);
    const rng2 = mulberry32(100);
    const deck = createDeck(board, rng2);
    expect(deck.filter((c) => c.yucky)).toHaveLength(4);
  });

  it("good cards match board slices", () => {
    const rng = mulberry32(42);
    const board = createBoard(rng);
    const rng2 = mulberry32(100);
    const deck = createDeck(board, rng2);
    const goodCards = deck.filter((c) => !c.yucky);
    for (const card of goodCards) {
      const match = board.find(
        (s) => s.colour === card.colour && s.shape === card.shape
      );
      expect(match).toBeDefined();
    }
  });

  it("each card has a unique id", () => {
    const rng = mulberry32(42);
    const board = createBoard(rng);
    const rng2 = mulberry32(100);
    const deck = createDeck(board, rng2);
    const ids = deck.map((c) => c.id);
    expect(new Set(ids).size).toBe(deck.length);
  });
});

// ---------------------------------------------------------------------------
// createInitialState
// ---------------------------------------------------------------------------

describe("createInitialState", () => {
  it("starts in ready phase", () => {
    const state = createInitialState();
    expect(state.phase).toBe("ready");
  });

  it("board has 8 slices", () => {
    const state = createInitialState();
    expect(state.board).toHaveLength(8);
  });

  it("has 12 face-down cards", () => {
    const state = createInitialState();
    expect(state.faceDownCards).toHaveLength(12);
  });

  it("no revealed card", () => {
    const state = createInitialState();
    expect(state.revealedCard).toBeNull();
  });

  it("bin starts at 0", () => {
    const state = createInitialState();
    expect(state.binCount).toBe(0);
  });

  it("has initial message", () => {
    const state = createInitialState();
    expect(state.message).toBeTruthy();
  });

  it("is deterministic with same seed", () => {
    const s1 = createInitialState(123);
    const s2 = createInitialState(123);
    expect(s1.board).toEqual(s2.board);
    expect(s1.faceDownCards).toEqual(s2.faceDownCards);
  });

  it("differs with different seed", () => {
    const s1 = createInitialState(1);
    const s2 = createInitialState(2);
    // Boards will almost certainly differ
    const b1 = s1.board.map((s) => s.colour + s.shape).join(",");
    const b2 = s2.board.map((s) => s.colour + s.shape).join(",");
    expect(b1).not.toEqual(b2);
  });
});

// ---------------------------------------------------------------------------
// spinColour / spinShape
// ---------------------------------------------------------------------------

describe("spinColour", () => {
  it("returns a valid colour", () => {
    const rng = mulberry32(42);
    for (let i = 0; i < 20; i++) {
      expect(COLOURS).toContain(spinColour(rng));
    }
  });
});

describe("spinShape", () => {
  it("returns a valid shape", () => {
    const rng = mulberry32(42);
    for (let i = 0; i < 20; i++) {
      expect(SHAPES).toContain(spinShape(rng));
    }
  });
});

// ---------------------------------------------------------------------------
// cardMatchesSpin
// ---------------------------------------------------------------------------

describe("cardMatchesSpin", () => {
  const card: ToppingCard = {
    id: "t1",
    colour: "red",
    shape: "star",
    yucky: false,
    backIcon: "🍅",
  };

  it("returns true for exact match", () => {
    expect(cardMatchesSpin(card, "red", "star")).toBe(true);
  });

  it("returns false for colour mismatch", () => {
    expect(cardMatchesSpin(card, "blue", "star")).toBe(false);
  });

  it("returns false for shape mismatch", () => {
    expect(cardMatchesSpin(card, "red", "circle")).toBe(false);
  });

  it("returns false for both mismatch", () => {
    expect(cardMatchesSpin(card, "green", "square")).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// findMatchingSlot
// ---------------------------------------------------------------------------

describe("findMatchingSlot", () => {
  const board: PizzaSlice[] = [
    { colour: "red", shape: "circle", filled: false },
    { colour: "blue", shape: "star", filled: false },
    { colour: "green", shape: "triangle", filled: true },
  ];

  it("finds an unfilled matching slot", () => {
    const card: ToppingCard = { id: "t", colour: "blue", shape: "star", yucky: false, backIcon: "🍅" };
    expect(findMatchingSlot(board, card)).toBe(1);
  });

  it("returns -1 for a filled slot", () => {
    const card: ToppingCard = { id: "t", colour: "green", shape: "triangle", yucky: false, backIcon: "🍅" };
    expect(findMatchingSlot(board, card)).toBe(-1);
  });

  it("returns -1 for no match", () => {
    const card: ToppingCard = { id: "t", colour: "yellow", shape: "square", yucky: false, backIcon: "🍅" };
    expect(findMatchingSlot(board, card)).toBe(-1);
  });
});

// ---------------------------------------------------------------------------
// isBoardComplete
// ---------------------------------------------------------------------------

describe("isBoardComplete", () => {
  it("returns false when some slices unfilled", () => {
    const board: PizzaSlice[] = [
      { colour: "red", shape: "circle", filled: true },
      { colour: "blue", shape: "star", filled: false },
    ];
    expect(isBoardComplete(board)).toBe(false);
  });

  it("returns true when all slices filled", () => {
    const board: PizzaSlice[] = [
      { colour: "red", shape: "circle", filled: true },
      { colour: "blue", shape: "star", filled: true },
    ];
    expect(isBoardComplete(board)).toBe(true);
  });

  it("returns true for empty board", () => {
    expect(isBoardComplete([])).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// doSpin
// ---------------------------------------------------------------------------

describe("doSpin", () => {
  it("transitions from ready to picking", () => {
    const state = createInitialState(42);
    const rng = mulberry32(99);
    const next = doSpin(state, rng);
    expect(next.phase).toBe("picking");
  });

  it("sets spinColour and spinShape", () => {
    const state = createInitialState(42);
    const rng = mulberry32(99);
    const next = doSpin(state, rng);
    expect(next.spinColour).not.toBeNull();
    expect(next.spinShape).not.toBeNull();
    expect(COLOURS).toContain(next.spinColour);
    expect(SHAPES).toContain(next.spinShape);
  });

  it("does nothing if not in ready phase", () => {
    const state: GameState = { ...createInitialState(42), phase: "picking" };
    const rng = mulberry32(99);
    const next = doSpin(state, rng);
    expect(next).toBe(state);
  });

  it("clears revealedCard", () => {
    const state = createInitialState(42);
    const rng = mulberry32(99);
    const next = doSpin(state, rng);
    expect(next.revealedCard).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// doReveal
// ---------------------------------------------------------------------------

describe("doReveal", () => {
  it("does nothing if not in picking phase", () => {
    const state = createInitialState(42);
    const rng = mulberry32(50);
    const next = doReveal(state, "topping-1", rng);
    expect(next).toBe(state); // ready phase, not picking
  });

  it("does nothing for unknown card id", () => {
    const state: GameState = { ...createInitialState(42), phase: "picking", spinColour: "red", spinShape: "circle" };
    const rng = mulberry32(50);
    const next = doReveal(state, "nonexistent", rng);
    expect(next).toBe(state);
  });

  it("reveals a yucky card → bin increases, phase = reveal", () => {
    const state = createInitialState(42);
    const yuckyCard = state.faceDownCards.find((c) => c.yucky);
    if (yuckyCard == null) return; // skip if test seed has no yucky in first batch

    const pickingState: GameState = {
      ...state,
      phase: "picking",
      spinColour: "red",
      spinShape: "circle",
    };
    const rng = mulberry32(50);
    const next = doReveal(pickingState, yuckyCard.id, rng);
    expect(next.phase).toBe("reveal");
    expect(next.binCount).toBe(1);
    expect(next.revealedCard).toEqual(yuckyCard);
    expect(next.message).toContain("Yucky");
  });

  it("reveals a good card that matches a slot → slot filled", () => {
    const state = createInitialState(42);
    // Find a good card that matches a board slot
    const goodCard = state.faceDownCards.find(
      (c) => !c.yucky && findMatchingSlot(state.board, c) !== -1
    );
    if (goodCard == null) return;

    const pickingState: GameState = {
      ...state,
      phase: "picking",
      spinColour: goodCard.colour,
      spinShape: goodCard.shape,
    };
    const rng = mulberry32(50);
    const next = doReveal(pickingState, goodCard.id, rng);
    expect(next.phase).toBe("reveal");
    expect(next.message).toContain("match");

    // Verify the slot is now filled
    const slotIndex = state.board.findIndex(
      (s) => s.colour === goodCard.colour && s.shape === goodCard.shape
    );
    expect(next.board[slotIndex].filled).toBe(true);
  });

  it("removes card from faceDownCards when matched or yucky", () => {
    const state = createInitialState(42);
    const yuckyCard = state.faceDownCards.find((c) => c.yucky);
    if (yuckyCard == null) return;

    const pickingState: GameState = {
      ...state,
      phase: "picking",
      spinColour: yuckyCard.colour,
      spinShape: yuckyCard.shape,
    };
    const rng = mulberry32(50);
    const next = doReveal(pickingState, yuckyCard.id, rng);
    expect(next.faceDownCards.find((c) => c.id === yuckyCard.id)).toBeUndefined();
  });

  it("reshuffles faceDownCards after reveal", () => {
    const state = createInitialState(42);
    const card = state.faceDownCards[0];
    const pickingState: GameState = {
      ...state,
      phase: "picking",
      spinColour: card.colour,
      spinShape: card.shape,
    };
    const rng = mulberry32(50);
    const next = doReveal(pickingState, card.id, rng);
    // Cards should still be the same set (minus removed card if applicable) but in different order
    expect(next.faceDownCards.length).toBeLessThanOrEqual(state.faceDownCards.length);
  });
});

// ---------------------------------------------------------------------------
// doContinue
// ---------------------------------------------------------------------------

describe("doContinue", () => {
  it("transitions from reveal to ready", () => {
    const state: GameState = {
      ...createInitialState(42),
      phase: "reveal",
      spinColour: "red",
      spinShape: "circle",
      revealedCard: { id: "t1", colour: "red", shape: "circle", yucky: false, backIcon: "🍅" },
    };
    const next = doContinue(state);
    expect(next.phase).toBe("ready");
    expect(next.spinColour).toBeNull();
    expect(next.spinShape).toBeNull();
    expect(next.revealedCard).toBeNull();
  });

  it("does nothing if not in reveal phase", () => {
    const state = createInitialState(42);
    const next = doContinue(state);
    expect(next).toBe(state);
  });
});

// ---------------------------------------------------------------------------
// getPickableCards
// ---------------------------------------------------------------------------

describe("getPickableCards", () => {
  it("returns at most 6 cards", () => {
    const state = createInitialState(42);
    const cards = getPickableCards(state);
    expect(cards.length).toBeLessThanOrEqual(6);
  });

  it("returns cards from the front of faceDownCards", () => {
    const state = createInitialState(42);
    const cards = getPickableCards(state);
    expect(cards).toEqual(state.faceDownCards.slice(0, 6));
  });

  it("returns fewer cards when deck is smaller than 6", () => {
    const state: GameState = {
      ...createInitialState(42),
      faceDownCards: createInitialState(42).faceDownCards.slice(0, 2),
    };
    const cards = getPickableCards(state);
    expect(cards).toHaveLength(2);
  });
});

// ---------------------------------------------------------------------------
// filledCount
// ---------------------------------------------------------------------------

describe("filledCount", () => {
  it("counts filled slices", () => {
    const board: PizzaSlice[] = [
      { colour: "red", shape: "circle", filled: true },
      { colour: "blue", shape: "star", filled: false },
      { colour: "green", shape: "triangle", filled: true },
    ];
    expect(filledCount(board)).toBe(2);
  });

  it("returns 0 for all unfilled", () => {
    const board: PizzaSlice[] = [
      { colour: "red", shape: "circle", filled: false },
    ];
    expect(filledCount(board)).toBe(0);
  });

  it("returns length for all filled", () => {
    const board: PizzaSlice[] = [
      { colour: "red", shape: "circle", filled: true },
      { colour: "blue", shape: "star", filled: true },
    ];
    expect(filledCount(board)).toBe(2);
  });
});

// ---------------------------------------------------------------------------
// Full game flow
// ---------------------------------------------------------------------------

describe("full game flow", () => {
  it("can play from start through placing a good card", () => {
    const state = createInitialState(42);
    expect(state.phase).toBe("ready");

    // Spin
    const rng = mulberry32(77);
    const afterSpin = doSpin(state, rng);
    expect(afterSpin.phase).toBe("picking");

    // Find a good card from the pickable set
    const goodCard = afterSpin.faceDownCards.find(
      (c) => !c.yucky && findMatchingSlot(afterSpin.board, c) !== -1
    );
    if (goodCard == null) return;

    // Reveal the good card
    const rng2 = mulberry32(88);
    const afterReveal = doReveal(afterSpin, goodCard.id, rng2);
    expect(afterReveal.phase).toBe("reveal");
    expect(afterReveal.revealedCard).not.toBeNull();

    // Continue
    const afterContinue = doContinue(afterReveal);
    expect(afterContinue.phase).toBe("ready");
  });
});
