import { SimpleRank, SimpleSuit } from './card.model';
import { HandName } from './hand.model';

// export
export type HandCategory = {
  topCategory: string;
  subCategories?: string[];
};

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

export type Proposition<N> = {
  name: N;
  key: number;
};

export type SelectionChoice =
  | 'poker'
  | 'color'
  | 'straight'
  | 'high-card'
  | 'pair'
  | 'three'
  | 'four'
  | 'double-pair'
  | 'full-house';

export type SelectionPokerVariantsChoice = 'royal-poker' | 'regular-poker' | 'queen-poker';
export type SelectionStraightVariantsChoice = 'high-straight' | 'regular-straight' | 'low-straight';

export type SelectionVariantChoice = SelectionPokerVariantsChoice | SelectionStraightVariantsChoice;

export const SelectionPropositions: Proposition<SelectionChoice>[] = [
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
export const PokerSubChoice: Proposition<SelectionPokerVariantsChoice>[] = [
  { key: 4, name: 'queen-poker' },
  { key: 5, name: 'regular-poker' },
  { key: 6, name: 'royal-poker' },
];

// straight
export const StraightSubChoice: Proposition<SelectionStraightVariantsChoice>[] = [
  { key: 4, name: 'low-straight' },
  { key: 5, name: 'regular-straight' },
  { key: 6, name: 'high-straight' },
];

// high-card, pair, three, four
export const RankBasedScheme = [{ key: 1, name: 'Figura składowa' }];

// double-pair, full-house
export const DoubleRankBasedScheme = [
  { key: 1, name: 'Figura składowa A' },
  { key: 2, name: 'Figura składowa B' },
];

// color, poker
export const SuitBasedScheme = [{ key: 1, name: 'Kolor składowy' }];

export const RanksPropositionsRecord = {
  '8': { key: 8, name: '8' },
  '9': { key: 9, name: '9' },

  '10': { key: 4, name: '10' },
  J: { key: 5, name: 'J' },
  Q: { key: 6, name: 'Q' },

  K: { key: 1, name: 'K' },
  A: { key: 2, name: 'A' },
};

export const SuitsPropositionsRecord = {
  SPADES: { key: 2, name: 'SPADES' },
  DIAMONDS: { key: 4, name: 'DIAMONDS' },
  HEARTS: { key: 6, name: 'HEARTS' },
  CLUBS: { key: 8, name: 'CLUBS' },
};
// poker: SelectionPropositions#poker > PokerSubChoice#*-poker > SuitBasedChoice#[wybór koloru] > Akceptacja
// straight: SelectionPropositions#straight > StraightSubChoice#*-straight > Akceptacja
// color: SelectionPropositions#color > SuitBasedChoice#[wybór koloru] > Akceptacja
// high-card/pair/three/four: SelectionPropositions#four > RankBasedChoice#[wybór figury] > Akceptacja
// double-pair/full-house: SelectionPropositions#full-house > DoubleRankBasedChoice#[wybór figury A] > DoubleRankBasedChoice#[wybór figury B] > Akceptacja

// * -> handleSelectionPropositions('poker') -> subChoices = PokerSubChoice
//   -> handleSubChoice('royal-poker') -> attributeChoices = SuitBasedChoice
//   -> handleSpecificationOption({type: 'suit', data: 'DIAMONDS'})
//   -> bettingCards = [...]
//   -> accept

// * -> handleSelectionPropositions('straight') -> subChoices = StraightSubChoice
//   -> handleSubChoice('high-straight')
//   -> bettingCards = [...]
//   -> accept

// * -> handleSelectionPropositions('color') -> attributeChoices = SuitBasedChoice
//   -> handleSpecificationOption({type: 'suit', data: 'DIAMONDS'})
//   -> bettingCards = [...]
//   -> accept

// * -> handleSelectionPropositions('four') -> attributeChoices = RankBasedChoice
//   -> handleSpecificationOption({type: 'rank', data: '9'})
//   -> bettingCards = [...]
//   -> accept

// * -> handleSelectionPropositions('full-house') -> attributeChoices = DoubleRankBasedChoice
//   -> handleSpecificationOption({type: 'double-rank', data: ['9','J']})
//   -> bettingCards = [...]
//   -> accept

export type AttributeSpecification = 'rank' | 'double-rank' | 'suit';
export type BettingSpecificationData =
  | { type: 'suit'; data: [BettingHand] }
  | { type: 'rank'; data: [BettingHand] }
  | { type: 'double-rank'; data: [BettingHand, BettingHand] };

export type BettingHand = {
  rank?: SimpleRank;
  suit?: SimpleSuit;
};

export type BettingChoices = {
  selection: {
    propositions: Proposition<SelectionChoice>[];
    picked: SelectionChoice | undefined;
  };
  variant: {
    propositions: Proposition<SelectionVariantChoice>[];
    picked: SelectionVariantChoice | undefined;
  };
  specification: {
    propositions: Proposition<string>[];
    picked: AttributeSpecification | undefined;
    pickedData: BettingHand[];
  };
  // finalization: {
  //   propositions: BettingHand[];
  //   picked: '' | `${string}-${HandName}` | undefined; // specification
  //   pickedData: BettingHand[];
  //   accepted: boolean;
  // };
};
