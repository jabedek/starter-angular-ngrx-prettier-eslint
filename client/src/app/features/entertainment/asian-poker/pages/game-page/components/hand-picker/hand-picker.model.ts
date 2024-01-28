import { SimpleRank, SimpleSuit } from '@features/entertainment/asian-poker/models/card.model';

export type HandCategory = {
  topCategory: string;
  subCategories?: string[];
};

export type Proposition<N> = {
  name: N;
  key: number;
};

export type Selection = 'poker' | 'color' | 'straight' | 'high-card' | 'pair' | 'three' | 'four' | 'double-pair' | 'full-house';
export type SelectionVariantPokerChoices = 'royal-poker' | 'regular-poker' | 'queen-poker';
export type SelectionVariantStraightChoices = 'high-straight' | 'regular-straight' | 'low-straight';
export type SelectionVariant = SelectionVariantPokerChoices | SelectionVariantStraightChoices;
export type SpecificationAttribute = 'rank' | 'double-rank' | 'suit';

export type BettingHand = {
  rank?: SimpleRank;
  suit?: SimpleSuit;
};

export type BettingChoices = {
  selection: {
    propositions: Proposition<Selection>[];
    picked: Selection | undefined;
  };
  variant: {
    propositions: Proposition<SelectionVariant>[];
    picked: SelectionVariant | undefined;
  };
  specification: {
    propositions: Proposition<SpecificationAttribute>[];
    picked: SpecificationAttribute | undefined;
    pickedData: BettingHand[];
  };
};
