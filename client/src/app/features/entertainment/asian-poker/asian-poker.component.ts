import { Component } from '@angular/core';
import 'frotsi';
import { loop } from 'frotsi';

type BaseCard = {
  color: string;
  figure: string;
};

type CardSet = {
  name: string;
  cards: BaseCard[];
};

const colors = ['WINO', 'CZERWO', 'ZOLEDZ', 'DZWONEK'];
const figures = ['9', '10', 'J', 'Q', 'K', 'A'];

interface Player {
  id: string;
  nickname: string;
  mandatoryDraws: number;
  hand: BaseCard[];
}

class PlayerInfo implements Player {
  id: string;
  nickname: string;
  mandatoryDraws = 1;
  hand: BaseCard[] = [];

  constructor(id: string, nickname: string, mandatoryDraws = 1) {
    this.id = id;
    this.nickname = nickname;
    this.mandatoryDraws = mandatoryDraws;
  }
}

const somePlayers = [
  new PlayerInfo('123', 'John', 1),
  new PlayerInfo('456', 'Simon', 3),
  new PlayerInfo('789', 'Mark', 2),
  new PlayerInfo('091', 'Pamela', 1),
];
@Component({
  selector: 'app-asian-poker',
  templateUrl: './asian-poker.component.html',
  styleUrls: ['./asian-poker.component.scss'],
})
export class AsianPokerComponent {
  session: {
    players: PlayerInfo[];
    publicCards: BaseCard[];
    currentTurn: number;
    currentPlayer: string;
  } = {
    players: [...somePlayers], // [],
    publicCards: [],
    currentTurn: 0,
    currentPlayer: '0',
  };
  cards: { highestAvailableSet: CardSet | undefined } = { highestAvailableSet: undefined };

  constructor() {
    const shuffledCards = this.shuffleNewDeck();
    const playersHands = this.drawCards(shuffledCards);
    const publicCards = this.drawPublicCards(shuffledCards);

    this.session.players.forEach((player) => (player.hand = playersHands[player.id]));
    this.session.publicCards = publicCards;
  }

  shuffleNewDeck() {
    const cards: BaseCard[] = [];
    figures.forEach((figure) => {
      colors.forEach((color) => cards.push({ color, figure }));
    });

    const shuffledCards = [];
    for (let i = 0; i < cards.length; i++) {
      const element = cards.popRandom();
      if (element) {
        shuffledCards[i] = element;
      }
    }

    return shuffledCards;
  }

  drawCards(cards: BaseCard[]) {
    // 'cards' has to be mutated directly.
    const draws = this.session.players.map(({ id, mandatoryDraws }) => ({
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

    const playerCards: Record<string, BaseCard[]> = {};
    drawsStack.forEach((playerId) => {
      if (!playerCards[playerId]) {
        playerCards[playerId] = [];
      }

      const card = cards.popRandom();
      if (card) {
        playerCards[playerId].push(card);
      }
    });

    return playerCards;
  }

  drawPublicCards(cards: BaseCard[]) {
    // 'cards' has to be mutated directly.

    const cardsAmount = this.session.players.every((player) => player.mandatoryDraws > 1) ? 1 : 2;
    const publicCards: BaseCard[] = [];

    loop(cardsAmount).forEach(() => {
      const card = cards.popRandom();
      if (card) {
        publicCards.push(card);
      }
    });

    return publicCards;
  }
}
