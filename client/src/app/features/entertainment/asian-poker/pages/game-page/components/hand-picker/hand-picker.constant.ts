import {
  HandCategory,
  Proposition,
  Selection,
  SelectionVariantPokerChoices,
  SelectionVariantStraightChoices,
} from './hand-picker.model';

export const SelectionPropositions: Proposition<Selection>[] = [
  { key: 7, name: 'high-card' },
  { key: 8, name: 'pair' },
  { key: 9, name: 'double-pair' },

  { key: 4, name: 'straight' },
  { key: 5, name: 'three' },
  { key: 6, name: 'full-house' },

  { key: 1, name: 'color' },
  { key: 2, name: 'four' },
  { key: 3, name: 'poker' },
];

// poker
export const VariantPropositionsPoker: Proposition<SelectionVariantPokerChoices>[] = [
  { key: 4, name: 'queen-poker' },
  { key: 5, name: 'regular-poker' },
  { key: 6, name: 'royal-poker' },
];

// straight
export const VariantPropositionsStraight: Proposition<SelectionVariantStraightChoices>[] = [
  { key: 4, name: 'low-straight' },
  { key: 5, name: 'regular-straight' },
  { key: 6, name: 'high-straight' },
];

// color, poker

export const RanksPropositions: Proposition<string>[] = [
  // top row
  { key: -1, name: 'filler _fillerA' },
  { key: 8, name: '8' },
  { key: 9, name: '9' },

  // mid row
  { key: 4, name: '10' },
  { key: 5, name: 'J' },
  { key: 6, name: 'Q' },

  // bottom row
  { key: 1, name: 'K' },
  { key: 2, name: 'A' },
  { key: -1, name: 'filler _fillerB' },
];

export const SuitsPropositions: Proposition<string>[] = [
  // top row
  { key: -1, name: 'filler _fillerA' },
  { key: 8, name: 'CLUBS' },
  { key: -1, name: 'filler _fillerB' },

  // mid row
  { key: 4, name: 'DIAMONDS' },
  { key: -1, name: 'filler _fillerC' },
  { key: 6, name: 'HEARTS' },

  // bottom row
  { key: -1, name: 'filler _fillerD' },
  { key: 2, name: 'SPADES' },
  { key: -1, name: 'filler _fillerE' },
];

export const HandsCategories: HandCategory[] = [
  { topCategory: 'high-card' },
  { topCategory: 'pair' },
  { topCategory: 'double-pair' },
  { topCategory: 'straight-root', subCategories: ['high-straight', 'regular-straight', 'low-straight'] },
  { topCategory: 'three' },
  { topCategory: 'full-house' },
  { topCategory: 'color' },
  { topCategory: 'four' },
  { topCategory: 'poker-root', subCategories: ['royal-poker', 'regular-poker', 'queen-poker'] },
];
