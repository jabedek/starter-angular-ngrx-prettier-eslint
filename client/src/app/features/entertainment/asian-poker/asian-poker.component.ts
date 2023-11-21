import { Component } from '@angular/core';
import 'frotsi';
import { loop } from 'frotsi';
import {
  AsianPokerPlayerInfo,
  BaseCard,
  CardSet,
  SuitsWithHierarchy,
  StandardDeckAmount,
  RanksWithHierarchyExtended,
  RanksWithHierarchyStandard,
  AsianPokerSession,
} from './asian-poker.model';

const somePlayers = [
  new AsianPokerPlayerInfo('456', 'Simon', 3),
  new AsianPokerPlayerInfo('45116', 'Kat', 4),
  new AsianPokerPlayerInfo('789', 'Mark', 2),
  new AsianPokerPlayerInfo('17891', 'Helga', 5),
  new AsianPokerPlayerInfo('091', 'Pamela', 1),
];
@Component({
  selector: 'app-asian-poker',
  templateUrl: './asian-poker.component.html',
  styleUrls: ['./asian-poker.component.scss'],
})
export class AsianPokerComponent {
  currentUser = new AsianPokerPlayerInfo('123', 'John', 1);
  gameStarted = false;

  session: AsianPokerSession | undefined;
  cardsAnalyzer: { highestAvailableSet: CardSet | undefined } = { highestAvailableSet: undefined };

  constructor() {
    const startingPlayers = [this.currentUser, ...somePlayers];
    const session = this.createNewSession(startingPlayers);
    this.session = session;
  }

  createNewSession(players: AsianPokerPlayerInfo[]) {
    const newSession: AsianPokerSession = {
      turnsCounter: 0,
      turnCycleCounter: 0,
      turnPlayers: [...players],
      turnHasStarted: false,
      currentPlayerIndex: 0,
      currentDealerIndex: 0,
      publicCards: [],
      playerCalls: [],
    };

    const shuffledCards = this.shuffleDeck(this.createNewDeck(newSession.turnPlayers));
    const { playersCards, publicCards, undealt } = this.drawCards(shuffledCards, newSession.turnPlayers);

    newSession.turnPlayers.forEach((player) => (player.hand = playersCards[player.id]));
    newSession.publicCards = publicCards;

    return newSession;
  }

  createNewDeck(players: AsianPokerPlayerInfo[]) {
    const publicCardsAmount = players.every((player) => player.mandatoryDraws > 1) ? 1 : 2;
    const playersCardsAmount = players.reduce((acc, player) => acc + player.mandatoryDraws, 0);
    const cardsNeeded = publicCardsAmount + playersCardsAmount;
    const deckToDealFrom = cardsNeeded > StandardDeckAmount ? RanksWithHierarchyExtended : RanksWithHierarchyStandard;
    const cards: BaseCard[] = [];

    deckToDealFrom.forEach((rank) => {
      SuitsWithHierarchy.forEach((suit) => cards.push({ suit, rank }));
    });

    return cards;
  }

  shuffleDeck(cards: BaseCard[]) {
    const cardsCopied = [...cards];
    const shuffledCards = [];

    while (cardsCopied.length > 0) {
      const element = cardsCopied.popRandom();
      if (element) {
        shuffledCards.push(element);
      }
    }

    return shuffledCards;
  }

  drawCards(cards: BaseCard[], players: AsianPokerPlayerInfo[]) {
    const cardsCopied = [...cards];
    const draws = players.map(({ id, mandatoryDraws }) => ({
      id,
      mandatoryDraws,
    }));

    const highestDraws = Math.max(...draws.map((d) => d.mandatoryDraws));
    const drawsStack: string[] = [];

    for (let i = 0; i < highestDraws; i++) {
      draws.forEach(({ id, mandatoryDraws }, i) => {
        if (mandatoryDraws > 0) {
          drawsStack.push(id);
          draws[i].mandatoryDraws -= 1;
        }
      });
    }

    const playersCards: Record<string, BaseCard[]> = {};
    drawsStack.forEach((playerId) => {
      if (!playersCards[playerId]) {
        playersCards[playerId] = [];
      }

      const card = cardsCopied.popRandom();
      if (card) {
        playersCards[playerId].push(card);
      }
    });

    const cardsAmount = players.every((player) => player.mandatoryDraws > 1) ? 1 : 2;
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
