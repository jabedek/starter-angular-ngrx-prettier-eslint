import { BaseCard } from './card.model';
import { HandName } from './hand.model';

export type CycleAnalyticsA = {
  publicCards: BaseCard[];
  currentPlayerHand: {
    playerId: string;
    cards: BaseCard[];
  }[];
  cardsInPlay: {
    unsplitted: BaseCard[];
    suit: {
      SPADES: BaseCard[];
      HEARTS: BaseCard[];
      DIAMONDS: BaseCard[];
      CLUBS: BaseCard[];
    };
    rank: {
      '8': BaseCard[];
      '9': BaseCard[];
      '10': BaseCard[];
      J: BaseCard[];
      Q: BaseCard[];
      K: BaseCard[];
      A: BaseCard[];
    };
  };
};

export type CycleAnalyticsB = {
  pairs: BaseCard[][];
  threes: BaseCard[][];
  fours: BaseCard[][];
  highestHand: HandInstance | undefined;
  hands: HandInstance[];
};

export type HandInstance = {
  name: HandName;
  specification: string;
  cards: BaseCard[];
};
