import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AsianPokerSession, SessionGameData } from '../../asian-poker-lobby.model';
import { AsianPokerGame } from '../../asian-poker-game.model';
import { AsianPokerService } from '@core/firebase/asian-poker.service';
import { Unsubscribe } from 'firebase/firestore';
import { BaseComponent } from '@shared/abstracts/base/base.component';
import { FirebaseUsersService } from '@core/firebase/firebase-users.service';
import { UserAppAccount } from '@store/auth/auth.state';

type UserPlayer = { status: 'ready' | 'invited' | 'disconnected' } & Partial<UserAppAccount>;

@Component({
  selector: 'app-waiting-room-page',
  templateUrl: './waiting-room-page.component.html',
  styleUrls: ['./waiting-room-page.component.scss'],
})
export class WaitingRoomPageComponent extends BaseComponent implements OnDestroy {
  slots: Record<'user', UserPlayer | undefined>[] = [
    { user: undefined },
    { user: undefined },
    { user: undefined },
    { user: undefined },
    { user: undefined },
    { user: { status: 'invited' } },
  ];
  private firebaseUnsubs = new Map<string, Unsubscribe>();

  usersDetails: UserAppAccount[] = [];

  set session(session: AsianPokerSession | undefined) {
    this._session = session;
    this.sessionOnSet();
  }

  get session(): AsianPokerSession | undefined {
    return this._session;
  }

  private _session: AsianPokerSession | undefined;

  private sessionOnSet() {
    if (this.session) {
      this.firebaseUsers.getUsersByIds(this.session.playersJoinedIds).then((users) => {
        this.usersDetails = users;
        users.forEach((user, index) => (this.slots[index].user = { ...user, status: 'ready' }));
      });
    }
  }

  // session: AsianPokerSession | undefined;
  game: AsianPokerGame | undefined;
  constructor(
    private route: ActivatedRoute,
    private ap: AsianPokerService,
    private firebaseUsers: FirebaseUsersService,
    private router: Router,
  ) {
    super('WaitingRoomPageComponent');

    this.route.data.subscribe((routeData) => {
      const data = routeData.data[0];
      this.session = data;
    });
  }

  override ngOnDestroy(): void {
    this.deleteFirebaseListeners();
  }

  private deleteFirebaseListeners() {
    this.firebaseUnsubs.forEach((unsub, key) => {
      if (unsub) {
        unsub();
      }
      this.firebaseUnsubs.delete(key);
    });
  }

  trackBySlots = this.__getTrackByFn('slots');

  listenToSessionChanges() {
    if (this.session) {
      this.ap.listenToSessionChanges(this.session.id, (data: AsianPokerSession[] | undefined, unsub: Unsubscribe | undefined) => {
        if (data && unsub) {
          console.log('new changes', data);

          this.firebaseUnsubs.set('listenToSessionChanges', unsub);
          if (data) {
            this.session = data[0];
          }
        }
      });
    }
  }

  startGame() {
    const session = this.session;
    if (session) {
      this.ap.startNewGame(session.id, session.playersJoinedIds).then(() => {
        // this.router.navigate(['/asian-poker/waiting-room/' + id]);
        this.router.navigate(['/asian-poker/game/' + session.id]);
      });
    }
  }

  listenToPlayersLeaveSession() {}
}
