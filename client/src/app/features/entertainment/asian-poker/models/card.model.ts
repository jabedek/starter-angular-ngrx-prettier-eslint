import {
  Suits,
  SuitsSymbols,
  Ranks,
  SuitsWithHierarchy,
  RanksWithHierarchyStandard,
  RanksWithHierarchyExtended,
  RanksWithHierarchyFinale,
} from '../constants/card.constant';

export type Suit = (typeof Suits)[number];
export type SuitSymbol = (typeof SuitsSymbols)[number];

export type SimpleSuit = (typeof Suits)[number];
export type SimpleRank = (typeof Ranks)[number];

export type Card = {
  suit: (typeof SuitsWithHierarchy)[number];
  rank: RanksWithHierarchy[number];
};

export type RanksWithHierarchy =
  | typeof RanksWithHierarchyStandard
  | typeof RanksWithHierarchyExtended
  | typeof RanksWithHierarchyFinale;
