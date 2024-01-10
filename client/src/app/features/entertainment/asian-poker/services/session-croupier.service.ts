import { generateDocumentId, loop } from 'frotsi';

import { shuffleCollection } from '@shared/helpers/collections.utils';
import { AsianPokerGame, PlayAction, AsianPokerPlayerInfo } from '../asian-poker-game.model';
import {
  BaseCard,
  RanksWithHierarchyFinale,
  RanksWithHierarchyExtended,
  RanksWithHierarchyStandard,
  SuitsWithHierarchy,
} from '../models/card.model';
import { DeckAmountStandard, DeckVariant } from '../models/deck.model';

export class SessionCroupierService {
  private sessions = new Map<string, AsianPokerGame>();

  getSession(sessionId: string) {
    return this.sessions.get(sessionId);
  }

  startTurn(sessionId: string) {
    const session = this.getSession(sessionId);
    if (session) {
      session.gameState = 'running';
    }
  }

  play(sessionId: string, action: PlayAction) {
    const session = this.getSession(sessionId);
    if (session) {
      const { turnsCounter, turnCycleCounter, currentPlayerIndex, currentDealerIndex } = session;

      session.playersCalls.push(action);
      session.currentPlayerIndex = currentPlayerIndex + 1;

      if (session.currentPlayerIndex === session.turnPlayers.length) {
        session.currentPlayerIndex = 0;
        session.turnCycleCounter = turnCycleCounter + 1;
      }
      // session.turnsCounter = turnsCounter + 1;
      // session.currentDealerIndex = currentDealerIndex + 1;
    }
  }

  createNewSession(players: AsianPokerPlayerInfo[]) {
    const shuffledPlayers = shuffleCollection(players);

    const newSession: AsianPokerGame = {
      id: generateDocumentId(),
      sessionId: 'TODO',
      turnsCounter: 0,
      deckVariant: 'standard',
      turnCycleCounter: 0,
      currentPlayerIndex: 2,
      currentDealerIndex: 0,
      turnPlayers: [...shuffledPlayers],
      gameState: 'ready',
      publicCards: [],
      playersCalls: [],
    };

    const { cards, deckVariant } = this.createNewDeck(newSession.turnPlayers);
    const shuffledCards = shuffleCollection<BaseCard>(cards);
    const { playersCards, publicCards, undealt } = this.drawCards(shuffledCards, newSession.turnPlayers);

    newSession.deckVariant = deckVariant;
    newSession.turnPlayers.forEach((player) => (player.hand = playersCards[player.id]));
    newSession.publicCards = publicCards;
    this.sessions.set(newSession.id, newSession);

    return newSession.id;
  }

  private createNewDeck(players: AsianPokerPlayerInfo[]) {
    const publicCardsAmount = players.every((player) => player.handSize > 1) ? 1 : 2;
    const playersCardsAmount = players.reduce((acc, player) => acc + player.handSize, 0);
    const cardsNeeded = publicCardsAmount + playersCardsAmount;
    const deckToDealFrom =
      players.length === 2
        ? RanksWithHierarchyFinale
        : cardsNeeded > DeckAmountStandard
        ? RanksWithHierarchyExtended
        : RanksWithHierarchyStandard;

    const cards: BaseCard[] = [];

    deckToDealFrom.forEach((rank) => {
      SuitsWithHierarchy.forEach((suit) => cards.push({ suit, rank }));
    });

    const deckVariant: DeckVariant =
      deckToDealFrom.length === 5 ? 'finale' : deckToDealFrom.length === 6 ? 'standard' : 'extended';

    return { cards, deckVariant };
  }

  private drawCards(cards: BaseCard[], players: AsianPokerPlayerInfo[]) {
    const cardsCopied = [...cards];
    const hands = players.map(({ id, handSize }) => ({
      id,
      handSize,
    }));

    const biggestHand = Math.max(...hands.map((d) => d.handSize));
    const dealingStack: string[] = [];

    for (let i = 0; i < biggestHand; i++) {
      hands.forEach(({ id, handSize }, i) => {
        if (handSize > 0) {
          dealingStack.push(id);
          hands[i].handSize -= 1;
        }
      });
    }

    const playersCards: Record<string, BaseCard[]> = {};
    dealingStack.forEach((playerId) => {
      if (!playersCards[playerId]) {
        playersCards[playerId] = [];
      }

      const card = cardsCopied.popRandom();
      if (card) {
        playersCards[playerId].push(card);
      }
    });

    const cardsAmount = players.every((player) => player.handSize > 1) ? 1 : 2;
    const publicCards: BaseCard[] = [];

    loop(cardsAmount).forEach(() => {
      const card = cardsCopied.popRandom();
      if (card) {
        publicCards.push(card);
      }
    });

    return { playersCards, publicCards, undealt: [...cardsCopied] };
  }
}
