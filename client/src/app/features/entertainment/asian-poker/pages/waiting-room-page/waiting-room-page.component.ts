import { AfterContentInit, Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AsianPokerService } from '@features/entertainment/asian-poker/firebase/asian-poker.service';
import { Unsubscribe } from 'firebase/firestore';
import { BaseComponent } from '@shared/abstracts/base/base.component';
import { FirebaseUsersService } from '@core/firebase/firebase-users.service';
import { PopupService } from '@core/modules/layout/components/popup/popup.service';
import { InvitePlayerPopupComponent } from './components/invite-player-popup/invite-player-popup.component';
import { AsianPokerSessionDTO } from '../../models/session-game-chat/session.model';
import { takeUntil } from 'rxjs';
import { FirebaseAuthService } from '@core/firebase/firebase-auth.service';
import { AsianPokerGameDTO } from '../../models/session-game-chat/game.model';
import { SessionSlot } from '../../models/session-game-chat/player-slot.model';
import { AsianPokerSessionService } from '../../firebase/asian-poker-session.service';

@Component({
  selector: 'app-waiting-room-page',
  templateUrl: './waiting-room-page.component.html',
  styleUrls: ['./waiting-room-page.component.scss'],
})
export class WaitingRoomPageComponent extends BaseComponent implements OnDestroy, AfterContentInit {
  currentUserId = '';
  slots: SessionSlot[] = [
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
    }
  }

  game: AsianPokerGameDTO | undefined;
  constructor(
    private route: ActivatedRoute,
    private apSession: AsianPokerSessionService,
    private auth: FirebaseAuthService,
    private firebaseUsers: FirebaseUsersService,
    private router: Router,
    private popup: PopupService,
  ) {
    super('WaitingRoomPageComponent');
    this.route.data.pipe(takeUntil(this.__destroy)).subscribe((routeData) => (this.session = routeData.data[0]));

    this.auth.appAccount$.pipe(takeUntil(this.__destroy)).subscribe((user) => (this.currentUserId = user?.id || ''));
  }

  ngAfterContentInit(): void {
    this.listenToSessionChanges();
  }

  trackBySlots = this.__getTrackByFn('slots');

  listenToSessionChanges() {
    if (this.session) {
      console.log('listenToSessionChanges');

      this.apSession.listenToSessionChanges(
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
      const slots: SessionSlot[] = [...this.session.sessionActivity.playersSlots];

      const playersIds = slots
        .filter((slot) => !!(slot.playerId || slot.invitedId))
        .map((p) => p.playerId || p.invitedId) as string[];

      const usersDetails = await this.firebaseUsers.getUsersByIds(playersIds);

      usersDetails.forEach((user, index) => {
        slots[index].user = user;
      });

      this.slots = slots;
    }
  }

  startGame() {
    const session = this.session;
    if (session) {
      this.apSession.startGame(session.id).then(() => this.router.navigate(['/asian-poker/game/' + session.id]));
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

            // const [newSession] = await this.apSession.getSessionsByIds([session.id]);
            // this.session = newSession;
            // console.log(newSession);
          },
        },
      });
    }
  }

  async leavePopup() {}

  async kick(playerId: string) {
    if (this.session) {
      await this.apSession.kickFromWaiting(this.session.id, playerId);
    }
  }

  async setSlotLock(userId: string, slot: SessionSlot) {
    console.log(userId, slot.order);

    if (this.session) {
      await this.apSession.setSlotLock(this.session.id, userId);
    }
  }

  // listenToPlayersLeaveSession() {}
}
