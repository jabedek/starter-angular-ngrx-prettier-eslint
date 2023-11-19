import { Component } from '@angular/core';

type BaseCard = {
  color: string;
  figure: string;
};

const colors = ['WINO', 'CZERWO', 'ZOLEDZ', 'DZWONEK'];
const figures = ['9', '10', 'J', 'Q', 'K', 'A'];
@Component({
  selector: 'app-asian-poker',
  templateUrl: './asian-poker.component.html',
  styleUrls: ['./asian-poker.component.scss'],
})
export class AsianPokerComponent {
  baseCards: BaseCard[] = [];

  constructor() {
    this.setupCard();
  }

  setupCard() {
    const cards: BaseCard[] = [];

    figures.forEach((figure) => {
      colors.forEach((color) => {
        cards.push({ color, figure });
      });
    });

    this.baseCards = cards;
    console.log(cards);
  }
}
