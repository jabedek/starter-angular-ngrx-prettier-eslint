import { Injectable } from '@angular/core';
import { Card } from '../models/types/card.model';
import { DeckVariant } from '../models/related-constants/deck.constant';
import { CycleAnalyticsA, CycleAnalyticsB, HandInstance } from '../models/types/in-game-analysis.model';
import { HighHandsNames, LowHandsNames } from '../models/related-constants/hand.constant';
import { AsianPokerGameDTO } from '../models/types/session-game-chat/game.model';

@Injectable({
  providedIn: 'root',
})
export class GameAnalyzerService {
  private game: AsianPokerGameDTO | undefined;

  get gameLastTick() {
    return this.game?.ticks.at(-1);
  }

  private analyticsA: CycleAnalyticsA = {
    currentPlayerHand: [],
    publicCards: [],
    cardsInPlay: {
      unsplitted: [],
      suit: {
        SPADES: [],
        HEARTS: [],
        DIAMONDS: [],
        CLUBS: [],
      },
      rank: {
        '8': [],
        '9': [],
        '10': [],
        J: [],
        Q: [],
        K: [],
        A: [],
      },
    },
  };

  private analyticsB: CycleAnalyticsB = {
    pairs: [],
    threes: [],
    fours: [],
    highestHand: undefined,
    hands: [],
  };

  getHighHandsFromDeck(deckVariant: DeckVariant | undefined | null) {
    if (!deckVariant) {
      return [];
    }
    const hands = [...HighHandsNames];
    if (deckVariant === 'finale') {
      hands.splice(1, 2);
      hands.splice(6, 2);
    }

    if (deckVariant === 'standard') {
      hands.splice(1, 1);
      hands.splice(6, 1);
    }

    // deckVariant === 'extended'
    return hands;
  }

  cycleAnalysis(game: AsianPokerGameDTO) {
    this.game = game;

    this.getAnalyticsA();
    this.getAnalyticsB();

    // console.log(this.analyticsA);
    // console.log(this.analyticsB);
  }

  private getAnalyticsA() {
    if (this.gameLastTick) {
      this.analyticsA.publicCards = [...this.gameLastTick.roundInfo.publicCards];
      this.analyticsA.currentPlayerHand = this.gameLastTick.cycleInfo.gameSlots.map((player) => ({
        playerId: player.playerWithHand.id,
        cards: [...player.playerWithHand.hand],
      }));

      // cards available to all
      const allHands = this.analyticsA.currentPlayerHand.map(({ cards }) => cards).flat();
      this.analyticsA.cardsInPlay.unsplitted = this.sortCards([...this.analyticsA.publicCards, ...allHands]);
      this.analyticsA.cardsInPlay.unsplitted.forEach((card) => {
        this.analyticsA.cardsInPlay.suit[card.suit.name].push(card);
        this.analyticsA.cardsInPlay.rank[card.rank.name].push(card);
      });
    }
  }

  private getAnalyticsB() {
    const { suit, rank } = this.analyticsA.cardsInPlay;
    const hands: HandInstance[] = [];

    const suits = Object.entries(suit);
    const ranks = Object.entries(rank);

    // poker, color
    suits.forEach((entry) => {
      const [key, value] = entry;
      const pokerHands: HandInstance[] = [];

      if (value.length > 4) {
        const _A = value[0]?.rank?.name === 'A'; // royal-poker

        const _K = value[1]?.rank?.name === 'K';
        const _Q = value[2]?.rank?.name === 'Q';
        const _J = value[3]?.rank?.name === 'J';
        const _10 = value[4]?.rank?.name === '10';

        const _9 = value[5]?.rank?.name === '9'; // regular-poker
        const _8 = value[6]?.rank?.name === '8'; // queen-poker

        if (_A && _K && _Q && _J && _10) {
          pokerHands.push({
            name: 'royal-poker',
            specification: `${key}-royal-poker`,
            cards: [value[0], value[1], value[2], value[3], value[4]],
          });
        }
        if (_K && _Q && _J && _10 && _9) {
          pokerHands.push({
            name: 'regular-poker',
            specification: `${key}-regular-poker`,
            cards: [value[1], value[2], value[3], value[4], value[5]],
          });
        }
        if (_Q && _J && _10 && _9 && _8) {
          pokerHands.push({
            name: 'queen-poker',
            specification: `${key}-queen-poker`,
            cards: [value[2], value[3], value[4], value[5], value[6]],
          });
        }
        {
          pokerHands.push({
            name: 'color',
            specification: `${key}-color`,
            cards: [...value.splice(5, 1)],
          });
        }
      }

      hands.push(...pokerHands);
    });

    // pair, three, four
    const pairs: Card[][] = [];
    const threes: Card[][] = [];
    const fours: Card[][] = [];
    ranks.forEach((entry) => {
      const [key, value] = entry;
      let hand: HandInstance | undefined;

      switch (value.length) {
        case 4:
          hand = { name: 'four', specification: `${key}-four`, cards: value };
          fours.push(value);
          break;
        case 3:
          hand = { name: 'three', specification: `${key}-three`, cards: value };
          threes.push(value);
          break;
        case 2:
          hand = { name: 'pair', specification: `${key}-pair`, cards: value };
          pairs.push(value);
          break;
        default:
          break;
      }

      if (hand) {
        hands.push(hand);
      }
    });

    // full-house
    ranks.forEach((entry) => {
      const [key, value] = entry;

      const repeatedRanksA = this.sortCards([...fours, ...threes].flat());
      const _A_0 = repeatedRanksA[0]?.rank?.name;
      const _A_1 = repeatedRanksA[1]?.rank?.name;
      const _A_2 = repeatedRanksA[2]?.rank?.name;

      const repeatedRanksB = this.sortCards([...fours, ...threes, ...pairs].flat().filter((card) => card.rank.name !== _A_0));
      const _B_0 = repeatedRanksB[0]?.rank?.name;
      const _B_1 = repeatedRanksB[1]?.rank?.name;

      if (_A_0 && _A_1 && _A_2 && _B_0 && _B_1) {
        const hand: HandInstance = {
          name: 'full-house',
          specification: `${_A_0}${_A_1}${_A_2}/${_B_0}${_B_1}-full-house`,
          cards: [repeatedRanksA[0], repeatedRanksA[1], repeatedRanksA[2], repeatedRanksB[0], repeatedRanksB[1]],
        };

        if (hand) {
          hands.push(hand);
        }
      }
    });

    const onlyHighHands: HandInstance[] = hands.filter(({ name }) => !LowHandsNames.includes(name as any));

    // sort hands by hierarchy
    const sortedHighHands = onlyHighHands.sort((a, b) => {
      const aSuitAt = (this.getHighHandsFromDeck(this.gameLastTick?.roundInfo.deckVariant) || []).indexOf(a.name as any);
      const bSuitAt = (this.getHighHandsFromDeck(this.gameLastTick?.roundInfo.deckVariant) || []).indexOf(b.name as any);

      if (aSuitAt < bSuitAt) {
        return -1;
      }

      if (aSuitAt > bSuitAt) {
        return 1;
      }

      return 0;
    });

    this.analyticsB = { pairs, threes, fours, highestHand: sortedHighHands[0], hands };
  }

  private sortCards(cards: Card[]) {
    const Suits = ['SPADES', 'HEARTS', 'CLUBS', 'DIAMONDS'] as const;
    const Ranks = ['A', 'K', 'Q', 'J', '10', '9', '8'] as const;

    let copied = [...cards];

    // Sort by suit
    copied = copied.sort((a, b) => {
      const aSuitAt = Suits.indexOf(a.suit.name);
      const bSuitAt = Suits.indexOf(b.suit.name);

      if (aSuitAt < bSuitAt) {
        return -1;
      }

      if (aSuitAt > bSuitAt) {
        return 1;
      }

      return 0;
    });

    // Sort by rank
    copied = copied.sort((a, b) => {
      const aRankAt = Ranks.indexOf(a.rank.name);
      const bRankAt = Ranks.indexOf(b.rank.name);

      if (aRankAt < bRankAt) {
        return -1;
      }

      if (aRankAt > bRankAt) {
        return 1;
      }

      return 0;
    });

    return copied;
  }
}
