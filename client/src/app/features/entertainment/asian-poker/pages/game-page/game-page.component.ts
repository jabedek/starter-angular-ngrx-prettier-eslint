import 'frotsi';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AsianPokerService } from '@features/entertainment/asian-poker/firebase/asian-poker.service';
import { GameAnalyzerService } from '../../services/game-analyzer.service';
import { GameManagerService } from '../../services/game-manager.service';
import { SessionGameDataPair } from '../../models/types/common.model';
import { FirebaseAuthService } from '@core/firebase/firebase-auth.service';
import { UserAppAccount } from '@store/auth/auth.state';
import { Observable, map, takeUntil, tap } from 'rxjs';
import { BaseComponent } from '@shared/abstracts/base/base.component';
import { PlayerWithHand } from '../../models/types/player-slot.model';
import { AsianPokerSessionService } from '../../firebase/asian-poker-session.service';
import { Unsubscribe } from 'firebase/firestore';
import { AsianPokerGameDTO, GameInternalData } from '../../models/types/session-game-chat/game.model';
import { AsianPokerSessionDTO } from '../../models/types/session-game-chat/session.model';
import { SessionGameListenerService } from '../../services/session-game-listener.service';

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

  session$ = this.sessionGameListener.session$;
  game$ = this.sessionGameListener.game$;

  gameInternalDataSnapshot$: Observable<GameInternalData> = this.manager.producedDataSnapshot$.pipe(takeUntil(this.__destroy));

  get ticksNumber$(): Observable<number> {
    return this.game$.pipe(map((game) => game?.ticks?.length || 0));
  }

  constructor(
    private analyzer: GameAnalyzerService,
    private manager: GameManagerService,
    private apSession: AsianPokerSessionService,
    private route: ActivatedRoute,
    private sessionGameListener: SessionGameListenerService,
    private auth: FirebaseAuthService,
  ) {
    super('GamePageComponent');

    this.appAccount$.subscribe((user) => (this.currentUser = user));
    this.route.data.subscribe(({ data }) => {
      if (data) {
        const dataPair = data as SessionGameDataPair;

        if (dataPair.session) {
          this.sessionGameListener.listenToSessionChanges(dataPair.session?.metadata.id);
          this.sessionGameListener.listenToGameChanges(dataPair.session?.metadata.gameId);

          if (dataPair.session.activity.status === 'game-created') {
            this.setupGame();
          }
        }
      }
    });
  }

  private async setupGame() {
    console.log('## GamePageComponent setupGame');
    await this.manager.setupGame();
  }
}
