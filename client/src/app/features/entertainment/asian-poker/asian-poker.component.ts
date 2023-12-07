import { Component } from '@angular/core';
import 'frotsi';

import { SessionCroupierService } from './session-croupier.service';
import { AsianPokerPlayerInfo, CardSet } from './asian-poker.model';

const somePlayers = [
  new AsianPokerPlayerInfo('456', 'Simon', 3),
  new AsianPokerPlayerInfo('45116', 'Kat', 4),
  new AsianPokerPlayerInfo('789', 'Mark', 2),
  new AsianPokerPlayerInfo('17891', 'Helga', 1),
  new AsianPokerPlayerInfo('091', 'Pamela', 1),
];

@Component({
  selector: 'app-asian-poker',
  templateUrl: './asian-poker.component.html',
  styleUrls: ['./asian-poker.component.scss'],
  providers: [SessionCroupierService],
})
export class AsianPokerComponent {
  currentUser = new AsianPokerPlayerInfo('123', 'John', 5);
  cardsAnalyzer: { highestAvailableSet: CardSet | undefined } = { highestAvailableSet: undefined };
  sessionId = '';

  constructor(private croupier: SessionCroupierService) {
    const startingPlayers = [this.currentUser, ...somePlayers];
    const sessionId = this.croupier.createNewSession(startingPlayers);
    this.sessionId = sessionId;
  }
}
