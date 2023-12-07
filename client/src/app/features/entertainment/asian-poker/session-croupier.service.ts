import { generateDocumentId, loop } from 'frotsi';
import {
  AsianPokerPlayerInfo,
  AsianPokerSession,
  StandardDeckAmount,
  RanksWithHierarchyExtended,
  RanksWithHierarchyStandard,
  BaseCard,
  SuitsWithHierarchy,
  PlayAction,
} from './asian-poker.model';
import { shuffleCollection } from '@shared/helpers/collections.utils';

export class SessionCroupierService {
  private sessions = new Map<string, AsianPokerSession>();

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

    const newSession: AsianPokerSession = {
      id: generateDocumentId(),
      turnsCounter: 0,
      turnCycleCounter: 0,
      currentPlayerIndex: 2,
      currentDealerIndex: 0,
      turnPlayers: [...shuffledPlayers],
      gameState: 'ready',
      publicCards: [],
      playersCalls: [],
    };

    const shuffledCards = shuffleCollection<BaseCard>(this.createNewDeck(newSession.turnPlayers));
    const { playersCards, publicCards, undealt } = this.drawCards(shuffledCards, newSession.turnPlayers);

    newSession.turnPlayers.forEach((player) => (player.hand = playersCards[player.id]));
    newSession.publicCards = publicCards;
    this.sessions.set(newSession.id, newSession);

    return newSession.id;
  }

  private createNewDeck(players: AsianPokerPlayerInfo[]) {
    const publicCardsAmount = players.every((player) => player.handSize > 1) ? 1 : 2;
    const playersCardsAmount = players.reduce((acc, player) => acc + player.handSize, 0);
    const cardsNeeded = publicCardsAmount + playersCardsAmount;
    const deckToDealFrom = cardsNeeded > StandardDeckAmount ? RanksWithHierarchyExtended : RanksWithHierarchyStandard;
    const cards: BaseCard[] = [];

    deckToDealFrom.forEach((rank) => {
      SuitsWithHierarchy.forEach((suit) => cards.push({ suit, rank }));
    });

    return cards;
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
