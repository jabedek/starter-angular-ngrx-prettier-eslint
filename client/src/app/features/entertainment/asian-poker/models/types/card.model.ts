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
  suit: SuitsWithHierarchyType;
  rank: RanksWithHierarchyType;
};

type SuitsWithHierarchyType = (typeof SuitsWithHierarchy)[number];
type RanksWithHierarchyType = (
  | typeof RanksWithHierarchyStandard
  | typeof RanksWithHierarchyExtended
  | typeof RanksWithHierarchyFinale
)[number];

export { Suit, SuitSymbol, SimpleSuit, SimpleRank, Card, SuitsWithHierarchyType, RanksWithHierarchyType };
