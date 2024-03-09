import 'frotsi';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AsianPokerService } from '@features/entertainment/asian-poker/firebase/asian-poker.service';
import { GameAnalyzerService } from '../../services/game-analyzer.service';
import { GameManagerService } from '../../services/game-manager.service';
import { SessionGameDataPair } from '../../models/common.model';
import { FirebaseAuthService } from '@core/firebase/firebase-auth.service';
import { UserAppAccount } from '@store/auth/auth.state';
import { Observable, takeUntil, tap } from 'rxjs';
import { BaseComponent } from '@shared/abstracts/base/base.component';
import { PlayerWithHand } from '../../models/session-game-chat/player-slot.model';

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
export class GamePageComponent extends BaseComponent {
  appAccount$: Observable<UserAppAccount | undefined> = this.auth.appAccount$.pipe(takeUntil(this.__destroy));
  currentUser: UserAppAccount | undefined;
  dataPair: SessionGameDataPair | undefined;

  constructor(
    private analyzer: GameAnalyzerService,
    private manager: GameManagerService,
    private as: AsianPokerService,
    private route: ActivatedRoute,

    private auth: FirebaseAuthService,
  ) {
    super('GamePageComponent');

    this.appAccount$.subscribe((user) => (this.currentUser = user));
    this.route.data.subscribe(({ data }) => {
      if (data) {
        this.dataPair = data as SessionGameDataPair;
        this.setupGame(this.dataPair);
      }
    });

    // this.sessionId = this.manager.initSessionAndGame(startingPlayers);
    // this.session = this.manager.getSession(this.sessionId);
    // if (this.session) {
    //   this.analyzer.cycleAnalysis(this.session);
    // }
  }

  async setupGame(dataPair: SessionGameDataPair) {
    await this.manager.create(dataPair);
  }
  // listenToPlayersLeaveGame() {}
}
