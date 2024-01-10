export const SuitsBlack = ['SPADES', 'CLUBS'] as const;
export const SuitsRed = ['HEARTS', 'DIAMONDS'] as const;
export const Suits = ['SPADES', 'HEARTS', 'CLUBS', 'DIAMONDS'] as const; // best to worst
export const SuitsSymbols = ['♠', '♥', '♣', '♦'] as const; // best to worst
export const UnspecifiedSuit = '✽';
export const SuitsWithHierarchy = [
  { name: 'SPADES', symbol: '♠' },
  { name: 'HEARTS', symbol: '♥' },
  { name: 'CLUBS', symbol: '♣' },
  { name: 'DIAMONDS', symbol: '♦' },
] as const;

export type Suit = (typeof Suits)[number];
export type SuitSymbol = (typeof SuitsSymbols)[number];

export const CardTuples: [Suit, SuitSymbol][] = [
  ['SPADES', '♠'],
  ['HEARTS', '♥'],
  ['CLUBS', '♣'],
  ['DIAMONDS', '♦'],
];

export const RanksFull = ['ACE', 'KING', 'QUEEN', 'JACK', 'TEN', 'NINE', 'EIGHT'] as const; // best to worst
export const Ranks = ['A', 'K', 'Q', 'J', '10', '9', '8'] as const; // best to worst
export const RanksWithHierarchyStandard = [
  { name: '9', desc: 'NINE' },
  { name: '10', desc: 'TEN' },
  { name: 'J', desc: 'JACK' },
  { name: 'Q', desc: 'QUEEN' },
  { name: 'K', desc: 'KING' },
  { name: 'A', desc: 'ACE' },
] as const;

export const RanksWithHierarchyExtended = [
  { name: '8', desc: 'EIGHT' },
  { name: '9', desc: 'NINE' },
  { name: '10', desc: 'TEN' },
  { name: 'J', desc: 'JACK' },
  { name: 'Q', desc: 'QUEEN' },
  { name: 'K', desc: 'KING' },
  { name: 'A', desc: 'ACE' },
] as const;

export const RanksWithHierarchyFinale = [
  { name: '10', desc: 'TEN' },
  { name: 'J', desc: 'JACK' },
  { name: 'Q', desc: 'QUEEN' },
  { name: 'K', desc: 'KING' },
  { name: 'A', desc: 'ACE' },
] as const;

export type SimpleSuit = (typeof Suits)[number];
export type SimpleRank = (typeof Ranks)[number];

export type BaseCard = {
  suit: (typeof SuitsWithHierarchy)[number];
  rank: RanksWithHierarchy[number];
};

export type RanksWithHierarchy =
  | typeof RanksWithHierarchyStandard
  | typeof RanksWithHierarchyExtended
  | typeof RanksWithHierarchyFinale;
