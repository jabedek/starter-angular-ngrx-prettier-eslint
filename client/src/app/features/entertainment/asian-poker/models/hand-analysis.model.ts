import { Card } from './card.model';
import { HandName } from './hand.model';

export type CycleAnalyticsA = {
  publicCards: Card[];
  currentPlayerHand: {
    playerId: string;
    cards: Card[];
  }[];
  cardsInPlay: {
    unsplitted: Card[];
    suit: {
      SPADES: Card[];
      HEARTS: Card[];
      DIAMONDS: Card[];
      CLUBS: Card[];
    };
    rank: {
      '8': Card[];
      '9': Card[];
      '10': Card[];
      J: Card[];
      Q: Card[];
      K: Card[];
      A: Card[];
    };
  };
};

export type CycleAnalyticsB = {
  pairs: Card[][];
  threes: Card[][];
  fours: Card[][];
  highestHand: HandInstance | undefined;
  hands: HandInstance[];
};

export type HandInstance = {
  name: HandName;
  specification: string;
  cards: Card[];
};
