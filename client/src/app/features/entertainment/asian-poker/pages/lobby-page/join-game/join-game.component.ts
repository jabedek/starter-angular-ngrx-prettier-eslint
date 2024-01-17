import { Component } from '@angular/core';
import { AsianPokerService } from '@core/firebase/asian-poker.service';
import { PopupService } from '@core/modules/layout/components/popup/popup.service';
import { AsianPokerSession } from '@features/entertainment/asian-poker/asian-poker-lobby.model';
import { BaseComponent } from '@shared/abstracts/base/base.component';
import { FirebaseAuthService } from '@core/firebase/firebase-auth.service';
import { take } from 'rxjs';
import { JoinGamePopupComponent } from './components/join-game-popup/join-game-popup.component';

@Component({
  selector: 'app-join-game',
  templateUrl: './join-game.component.html',
  styleUrls: ['./join-game.component.scss'],
})
export class JoinGameComponent extends BaseComponent {
  sessions: AsianPokerSession[] = [];
  selected = '';

  constructor(
    private ap: AsianPokerService,
    private auth: FirebaseAuthService,
    private popup: PopupService,
  ) {
    super('JoinGameComponent');
    this.listFetchInterval();
  }

  trackBySessions = this.__getTrackByFn('sessions');

  listFetchInterval() {
    this.fetchJoinableSessions();
    const clear = setInterval(() => this.fetchJoinableSessions(), 1000 * 7);
    this.__registerTimer('listFetchInterval', clear);
  }

  async fetchJoinableSessions() {
    this.ap.getJoinableSessions().then((sessions) => (this.sessions = sessions));
  }

  join(sessionId = '') {
    console.log(sessionId);
    this.auth.appAccount$.pipe(take(1)).subscribe((userPlayer) => {
      if (userPlayer) {
        const inputs = {
          sessionId,
          disabled: !!sessionId,
          userPlayer,
        };

        this.popup.showPopup({
          contentType: 'component',
          content: { component: JoinGamePopupComponent, inputs: { ...inputs } },
          config: {
            showCloseButton: true,
            callbackAfterClosing: () => {
              console.log('callbackAfterClosing');
              this.popup.hidePopup();
            },
          },
        });
      }
    });
  }
}
