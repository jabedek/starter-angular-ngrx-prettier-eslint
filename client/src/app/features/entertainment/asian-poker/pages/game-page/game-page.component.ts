import { Component } from '@angular/core';
import 'frotsi';
import { AsianPokerPlayerInfo, AsianPokerGame } from '../../asian-poker-game.model';
import { SessionCroupierService } from '../../services/session-croupier.service';
import { SessionHandsAnalyzerService } from '../../services/session-hands-analyzer.service';
import { ActivatedRoute } from '@angular/router';
import { AsianPokerService } from '@core/firebase/asian-poker.service';
import { AsianPokerSession } from '../../asian-poker-lobby.model';

const somePlayers = [
  new AsianPokerPlayerInfo('456', 'Simon', 3),
  new AsianPokerPlayerInfo('45116', 'Kat', 4),
  new AsianPokerPlayerInfo('789', 'Mark', 2),
  new AsianPokerPlayerInfo('17891', 'Helga', 1),
  new AsianPokerPlayerInfo('091', 'Pamela', 1),
];

@Component({
  selector: 'app-game-page',
  templateUrl: './game-page.component.html',
  styleUrls: ['./game-page.component.scss'],
  providers: [SessionCroupierService],
})
export class GamePageComponent {
  currentUser = new AsianPokerPlayerInfo('123', 'John', 5);
  sessionId = '';

  session: AsianPokerGame | undefined;

  constructor(
    private croupier: SessionCroupierService,
    private handsAnalyzer: SessionHandsAnalyzerService,
    private as: AsianPokerService,
    private route: ActivatedRoute,
  ) {
    this.route.data.subscribe((data) => {
      console.log(data);
    });

    const startingPlayers = [this.currentUser, ...somePlayers];
    this.sessionId = this.croupier.createNewSession(startingPlayers);
    this.session = this.croupier.getSession(this.sessionId);
    if (this.session) {
      this.handsAnalyzer.loadCycleCards(this.session);
    }
  }
}
