import { Component } from '@angular/core';
import { AsianPokerService } from '@features/entertainment/asian-poker/firebase/asian-poker.service';
import { PopupService } from '@core/modules/layout/components/popup/popup.service';
import { BaseComponent } from '@shared/abstracts/base/base.component';
import { FirebaseAuthService } from '@core/firebase/firebase-auth.service';
import { take } from 'rxjs';
import { JoinGamePopupComponent } from '../join-game-popup/join-game-popup.component';
import { AsianPokerSessionDTO } from '@features/entertainment/asian-poker/models/types/session-game-chat/session.model';
import { JoinableSessionStatuses } from '@features/entertainment/asian-poker/models/types/session-game-chat/session.status.model';

@Component({
  selector: 'app-games-list',
  templateUrl: './games-list.component.html',
  styleUrls: ['./games-list.component.scss'],
})
export class GamesListComponent extends BaseComponent {
  sessions: AsianPokerSessionDTO[] = [];
  selected = '';

  constructor(
    private ap: AsianPokerService,
    private auth: FirebaseAuthService,
    private popup: PopupService,
  ) {
    super('GamesListComponent');
    this.listFetchInterval();
  }

  trackBySessions = this.__getTrackByFn('sessions');

  listFetchInterval() {
    this.fetchJoinableSessions();
    const clear = setInterval(() => this.fetchJoinableSessions(), 1000 * 7);
    this.__registerTimer('listFetchInterval', clear);
  }

  async fetchJoinableSessions() {
    this.ap.getSessionsByStates(JoinableSessionStatuses).then((sessions) => {
      this.sessions = sessions;
    });
  }

  joinPopup(sessionId = '') {
    this.auth.appAccount$.pipe(take(1)).subscribe((userPlayer) => {
      if (userPlayer) {
        this.popup.showPopup({
          contentType: 'component',
          content: {
            component: JoinGamePopupComponent,
            inputs: {
              sessionId,
              disabled: !!sessionId,
              userPlayer,
            },
          },
          config: {
            showCloseButton: true,
            closeOnOutclick: true,
            callbackAfterClosing: () => this.popup.hidePopup(),
          },
        });
      }
    });
  }
}
