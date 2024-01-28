import { loop } from 'frotsi';
import {
  RanksWithHierarchyFinale,
  RanksWithHierarchyExtended,
  RanksWithHierarchyStandard,
  SuitsWithHierarchy,
} from '../constants/card.constant';
import { DeckAmountStandard, DeckVariant } from '../constants/deck.constant';
import { Card } from '../models/card.model';
import { PlayerWithHand } from '../models/game.model';

export function createNewDeck(players: PlayerWithHand[]) {
  const publicCardsAmount = players.every((player) => player.fixedHandSize > 1) ? 1 : 2;
  const playersCardsAmount = players.reduce((acc, player) => acc + player.fixedHandSize, 0);
  const cardsNeeded = publicCardsAmount + playersCardsAmount;
  const deckToDealFrom =
    players.length === 2
      ? RanksWithHierarchyFinale
      : cardsNeeded > DeckAmountStandard
      ? RanksWithHierarchyExtended
      : RanksWithHierarchyStandard;

  const cards: Card[] = [];

  deckToDealFrom.forEach((rank) => {
    SuitsWithHierarchy.forEach((suit) => cards.push({ suit, rank }));
  });

  const deckVariant: DeckVariant = deckToDealFrom.length === 5 ? 'finale' : deckToDealFrom.length === 6 ? 'standard' : 'extended';

  return { cards, deckVariant };
}

export function drawCards(cards: Card[], players: PlayerWithHand[]) {
  const cardsCopied = [...cards];
  const hands = players.map(({ id, fixedHandSize }) => ({
    id,
    fixedHandSize,
  }));

  const biggestHand = Math.max(...hands.map((d) => d.fixedHandSize));
  const dealingStack: string[] = [];

  for (let i = 0; i < biggestHand; i++) {
    hands.forEach(({ id, fixedHandSize }, i) => {
      if (fixedHandSize > 0) {
        dealingStack.push(id);
        hands[i].fixedHandSize -= 1;
      }
    });
  }

  const playersCards: Record<string, Card[]> = {};
  dealingStack.forEach((playerId) => {
    if (!playersCards[playerId]) {
      playersCards[playerId] = [];
    }

    const card = cardsCopied.popRandom();
    if (card) {
      playersCards[playerId].push(card);
    }
  });

  const cardsAmount = players.every((player) => player.fixedHandSize > 1) ? 1 : 2;
  const publicCards: Card[] = [];

  loop(cardsAmount).forEach(() => {
    const card = cardsCopied.popRandom();
    if (card) {
      publicCards.push(card);
    }
  });

  return { playersCards, publicCards, undealt: [...cardsCopied] };
}
