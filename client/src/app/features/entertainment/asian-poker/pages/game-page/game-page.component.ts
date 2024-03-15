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
import { AsianPokerSessionService } from '../../firebase/asian-poker-session.service';
import { Unsubscribe } from 'firebase/firestore';
import { AsianPokerGameDTO, GameInternalData } from '../../models/session-game-chat/game.model';
import { AsianPokerSessionDTO } from '../../models/session-game-chat/session.model';

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

  gameInternalDataSnapshot$: Observable<GameInternalData> = this.manager.gameInternalDataSnapshot$.pipe(
    takeUntil(this.__destroy),
  );

  get ticksNumber() {
    return this.dataPair?.game.ticks.length || 0;
  }

  constructor(
    private analyzer: GameAnalyzerService,
    private manager: GameManagerService,
    private as: AsianPokerService,
    private apSession: AsianPokerSessionService,
    private route: ActivatedRoute,

    private auth: FirebaseAuthService,
  ) {
    super('GamePageComponent');

    this.appAccount$.subscribe((user) => (this.currentUser = user));
    this.route.data.subscribe(({ data }) => {
      if (data) {
        this.dataPair = data as SessionGameDataPair;
        this.listenToSessionChanges(data);
        this.listenToGameChanges(data);

        if (this.dataPair.session.sessionActivity.status === 'game-entered') {
          this.setupGame(this.dataPair);
        }
      }
    });
  }

  private listenToSessionChanges(data: SessionGameDataPair) {
    this.apSession.listenToSessionChanges(
      data.session.id,
      (changes: AsianPokerSessionDTO[] | undefined, unsub: Unsubscribe | undefined) => {
        if (changes && unsub) {
          this.__addFirebaseListener('listenToSessionChanges', unsub);
          if (this.dataPair?.session) {
            this.dataPair.session = changes[0];
          }
        }
      },
    );
  }

  private listenToGameChanges(data: SessionGameDataPair) {
    this.apSession.listenToGameChanges(
      data.game.id,
      (changes: AsianPokerGameDTO[] | undefined, unsub: Unsubscribe | undefined) => {
        if (changes && unsub) {
          this.__addFirebaseListener('listenToGameChanges', unsub);
          if (changes) {
            if (this.dataPair?.game) {
              this.dataPair.game = changes[0];
            }
          }
        }
      },
    );
  }

  private async setupGame(dataPair: SessionGameDataPair) {
    console.log('## setupGame');

    await this.manager.setupGame(dataPair);
  }
  // listenToPlayersLeaveGame() {}
}
