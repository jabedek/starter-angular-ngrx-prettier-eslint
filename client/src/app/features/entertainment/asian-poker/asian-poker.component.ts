import { Component } from '@angular/core';
import 'frotsi';

import { AsianPokerGameDTO } from './models/session-game-chat/game.model';
import { PlayerWithHand } from './models/session-game-chat/player-slot.model';

const somePlayers = [
  new PlayerWithHand('456', 'Simon', 3),
  new PlayerWithHand('45116', 'Kat', 4),
  new PlayerWithHand('789', 'Mark', 2),
  new PlayerWithHand('17891', 'Helga', 1),
  new PlayerWithHand('091', 'Pamela', 1),
];

@Component({
  selector: 'app-asian-poker',
  templateUrl: './asian-poker.component.html',
  styleUrls: ['./asian-poker.component.scss'],
})
export class AsianPokerComponent {
  currentUser = new PlayerWithHand('123', 'John', 5);
  sessionId = '';
  session: AsianPokerGameDTO | undefined;

  constructor() {
    // private handsAnalyzer: SessionHandsAnalyzerService
    // const startingPlayers = [this.currentUser, ...somePlayers];
    // this.sessionId = this.croupier.initSessionAndGame(startingPlayers);
    // this.session = this.croupier.getSession(this.sessionId);
    // if (this.session) {
    //   this.handsAnalyzer.cycleAnalysis(this.session);
    // }
  }
}
