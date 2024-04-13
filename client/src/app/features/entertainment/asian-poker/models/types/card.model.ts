import {
  Suits,
  SuitsSymbols,
  Ranks,
  SuitsWithHierarchy,
  RanksWithHierarchyStandard,
  RanksWithHierarchyExtended,
  RanksWithHierarchyFinale,
} from '../related-constants/card.constant';

type Suit = (typeof Suits)[number];
type SuitSymbol = (typeof SuitsSymbols)[number];

type SimpleSuit = (typeof Suits)[number];
type SimpleRank = (typeof Ranks)[number];

type Card = {
  suit: (typeof SuitsWithHierarchy)[number];
  rank: RanksWithHierarchy[number];
};

type RanksWithHierarchy = typeof RanksWithHierarchyStandard | typeof RanksWithHierarchyExtended | typeof RanksWithHierarchyFinale;

export { Suit, SuitSymbol, SimpleSuit, SimpleRank, Card, RanksWithHierarchy };
