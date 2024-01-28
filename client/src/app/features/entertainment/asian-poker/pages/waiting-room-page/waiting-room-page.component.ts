import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AsianPokerService } from '@features/entertainment/asian-poker/firebase/asian-poker.service';
import { Unsubscribe } from 'firebase/firestore';
import { BaseComponent } from '@shared/abstracts/base/base.component';
import { FirebaseUsersService } from '@core/firebase/firebase-users.service';
import { UserAppAccount } from '@store/auth/auth.state';
import { AsianPokerSessionDTO, AsianPokerGameDTO } from '../../models/dto';

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

  set session(session: AsianPokerSessionDTO | undefined) {
    this._session = session;
    this.sessionOnSet();
  }

  get session(): AsianPokerSessionDTO | undefined {
    return this._session;
  }

  private _session: AsianPokerSessionDTO | undefined;

  private sessionOnSet() {
    if (this.session) {
      this.firebaseUsers.getUsersByIds(this.session.sessionActivity.playersJoinedIds).then((users) => {
        this.usersDetails = users;
        users.forEach((user, index) => (this.slots[index].user = { ...user, status: 'ready' }));
      });
    }
  }

  game: AsianPokerGameDTO | undefined;
  constructor(
    private route: ActivatedRoute,
    private ap: AsianPokerService,
    private firebaseUsers: FirebaseUsersService,
    private router: Router,
  ) {
    super('WaitingRoomPageComponent');

    this.route.data.subscribe((routeData) => (this.session = routeData.data[0]));
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
      this.ap.listenToSessionChanges(
        this.session.id,
        (data: AsianPokerSessionDTO[] | undefined, unsub: Unsubscribe | undefined) => {
          if (data && unsub) {
            console.log('new changes', data);

            this.firebaseUnsubs.set('listenToSessionChanges', unsub);
            if (data) {
              this.session = data[0];
            }
          }
        },
      );
    }
  }

  startGame() {
    const session = this.session;
    if (session) {
      this.ap
        .startNewGame(session.id, session.sessionActivity.playersJoinedIds)
        .then(() => this.router.navigate(['/asian-poker/game/' + session.id]));
    }
  }

  // listenToPlayersLeaveSession() {}
}
