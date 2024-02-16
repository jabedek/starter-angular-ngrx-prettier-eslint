import { AfterContentInit, Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AsianPokerService } from '@features/entertainment/asian-poker/firebase/asian-poker.service';
import { Unsubscribe } from 'firebase/firestore';
import { BaseComponent } from '@shared/abstracts/base/base.component';
import { FirebaseUsersService } from '@core/firebase/firebase-users.service';
import { AsianPokerSessionDTO, AsianPokerGameDTO } from '../../models/dto';
import { PopupService } from '@core/modules/layout/components/popup/popup.service';
import { InvitePlayerPopupComponent } from './components/invite-player-popup/invite-player-popup.component';
import { WaitingSlot } from '../../models/session.model';

@Component({
  selector: 'app-waiting-room-page',
  templateUrl: './waiting-room-page.component.html',
  styleUrls: ['./waiting-room-page.component.scss'],
})
export class WaitingRoomPageComponent extends BaseComponent implements OnDestroy, AfterContentInit {
  slots: WaitingSlot[] = [
    // { user: undefined },
    // { user: undefined },
    // { user: undefined },
    // { user: { status: 'invited' } },
    // { user: undefined },
    // { user: undefined },
  ];

  set session(session: AsianPokerSessionDTO | undefined) {
    this._session = session;
    console.log(session);

    this.sessionOnSet();
  }

  get session(): AsianPokerSessionDTO | undefined {
    return this._session;
  }

  private _session: AsianPokerSessionDTO | undefined;

  private sessionOnSet() {
    if (this.session) {
      this.slots = this.session.sessionActivity.playersSlots || [];
      this.getPlayersDetails();

      // this.firebaseUsers.getUsersByIds(this.session.sessionActivity.playersJoinedIds).then((users) => {
      //   this.usersDetails = users;
      //   users.forEach((user, index) => (this.slots[index].user = { ...user, status: 'ready' }));
      // });
    }
  }

  game: AsianPokerGameDTO | undefined;
  constructor(
    private route: ActivatedRoute,
    private ap: AsianPokerService,
    private firebaseUsers: FirebaseUsersService,
    private router: Router,
    private popup: PopupService,
  ) {
    super('WaitingRoomPageComponent');
    this.route.data.subscribe((routeData) => (this.session = routeData.data[0]));
  }

  ngAfterContentInit(): void {
    this.listenToSessionChanges();
  }

  trackBySlots = this.__getTrackByFn('slots');

  listenToSessionChanges() {
    if (this.session) {
      console.log('listenToSessionChanges');

      this.ap.listenToSessionChanges(
        this.session.id,
        (data: AsianPokerSessionDTO[] | undefined, unsub: Unsubscribe | undefined) => {
          console.log('new changes', data);
          if (data && unsub) {
            this.__addFirebaseListener('listenToSessionChanges', unsub);
            if (data) {
              this.session = data[0];
            }
          }
        },
      );
    }
  }

  private async getPlayersDetails() {
    if (this.session) {
      const slots: WaitingSlot[] = [...this.session.sessionActivity.playersSlots];

      const usersDetails = await Promise.allSettled([
        ...slots.map(({ playerId }) => (!!playerId ? this.firebaseUsers.getUserById(playerId) : null)),
      ]);

      usersDetails.forEach((result, index) => {
        slots[index].user = result.status === 'fulfilled' && result.value ? result.value : null;
      });

      this.slots = slots;
    }
  }

  startGame() {
    const session = this.session;
    if (session) {
      this.ap.startGame(session.id).then(() => this.router.navigate(['/asian-poker/game/' + session.id]));
    }
  }

  // TODO - NIE DZIAŁA
  async invitePopup(order: number) {
    const session = this.session;
    if (session) {
      this.popup.showPopup({
        contentType: 'component',
        content: {
          component: InvitePlayerPopupComponent,
          inputs: {
            sessionId: session.id,
            order,
          },
        },
        config: {
          showCloseButton: true,
          closeOnOutclick: true,
          callbackOnDestroy: async () => {
            console.log('callbackOnDestroy');

            // const [newSession] = await this.ap.getSessionsByIds([session.id]);
            // this.session = newSession;
            // console.log(newSession);
          },
        },
      });
    }
  }

  // listenToPlayersLeaveSession() {}
}
