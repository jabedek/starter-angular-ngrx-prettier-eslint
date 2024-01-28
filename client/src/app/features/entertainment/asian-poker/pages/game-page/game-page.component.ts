import 'frotsi';
import { Component, HostListener } from '@angular/core';
import { PlayerWithHand } from '../../models/game.model';
import { ActivatedRoute } from '@angular/router';
import { AsianPokerService } from '@features/entertainment/asian-poker/firebase/asian-poker.service';
import { GameAnalyzerService } from '../../services/game-analyzer.service';
import { GameManagerService } from '../../services/game-manager.service';
import { AsianPokerGameDTO } from '../../models/dto';

const somePlayers = [
  new PlayerWithHand('456', 'Simon', 3),
  new PlayerWithHand('45116', 'Kat', 4),
  new PlayerWithHand('789', 'Mark', 2),
  new PlayerWithHand('17891', 'Helga', 1),
  new PlayerWithHand('091', 'Pamela', 1),
];

@Component({
  selector: 'app-game-page',
  templateUrl: './game-page.component.html',
  styleUrls: ['./game-page.component.scss'],
})
export class GamePageComponent {
  currentUser = new PlayerWithHand('123', 'John', 5);
  sessionId = '';

  session: AsianPokerGameDTO | undefined;

  @HostListener('mousedown', ['$event'])
  test(event: MouseEvent) {
    console.log(event);
    // filter for only buttons 3 and 4
    if (event.button === 3 || event.button === 4) {
      console.log('event.button', event.button);
      // prevent default behaviour
      event.stopPropagation();
      event.stopImmediatePropagation();
      event.preventDefault();
    }
  }

  constructor(
    private analyzer: GameAnalyzerService,
    private manager: GameManagerService,
    private as: AsianPokerService,
    private route: ActivatedRoute,
  ) {
    this.route.data.subscribe(({ data }) => {
      const { session, game } = data;
      console.log(session, game);
    });

    const startingPlayers = [this.currentUser, ...somePlayers];
    // this.sessionId = this.croupier.initSessionAndGame(startingPlayers);
    // this.session = this.croupier.getSession(this.sessionId);
    if (this.session) {
      this.analyzer.cycleAnalysis(this.session);
    }
  }

  // listenToPlayersLeaveGame() {}
}
