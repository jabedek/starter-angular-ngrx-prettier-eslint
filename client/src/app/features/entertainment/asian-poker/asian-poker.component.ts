import { Component } from '@angular/core';
import 'frotsi';

import { SessionCroupierService } from './services/session-croupier.service';
import { AsianPokerPlayerInfo, AsianPokerGame } from './asian-poker-game.model';
import { SessionHandsAnalyzerService } from './services/session-hands-analyzer.service';

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
  sessionId = '';
  session: AsianPokerGame | undefined;

  constructor(
    private croupier: SessionCroupierService,
    private handsAnalyzer: SessionHandsAnalyzerService,
  ) {
    const startingPlayers = [this.currentUser, ...somePlayers];
    this.sessionId = this.croupier.createNewSession(startingPlayers);
    this.session = this.croupier.getSession(this.sessionId);
    if (this.session) {
      this.handsAnalyzer.loadCycleCards(this.session);
    }
  }
}
