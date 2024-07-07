import { AfterContentInit, Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from '@shared/abstracts/base/base.component';
import { FirebaseUsersService } from '@core/firebase/firebase-users.service';
import { PopupService } from '@core/modules/layout/components/popup/popup.service';
import { InvitePlayerPopupComponent } from './components/invite-player-popup/invite-player-popup.component';
import { AsianPokerSessionDTO } from '../../models/types/session-game-chat/session.model';
import { takeUntil } from 'rxjs';
import { FirebaseAuthService } from '@core/firebase/firebase-auth.service';
import { AsianPokerGameDTO } from '../../models/types/session-game-chat/game.model';
import { SessionSlot } from '../../models/types/player-slot.model';
import { AsianPokerSessionService } from '../../firebase/asian-poker-session.service';
import { SessionGameListenerService, UserPlayerCheck } from '../../services/session-game-listener.service';

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
      this.slots = this.session.activity.playersSlots || [];
      this.getPlayersDetails();
    }
  }

  game: AsianPokerGameDTO | undefined;
  constructor(
    private route: ActivatedRoute,
    private apSession: AsianPokerSessionService,
    protected listener: SessionGameListenerService,
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
    // this.listenToSessionChanges();
    if (this.session) {
      const { id, gameId } = this.session.metadata;

      if (id && gameId) {
        this.listener.listenToSessionChanges(id);
        // this.listener.listenToGameChanges(gameId);
      }
    }
  }

  trackBySlots = this.__getTrackByFn('slots');

  // listenToSessionChanges() {
  //   if (this.session) {
  //     this.apSession.listenToSessionChanges(
  //       this.session.metadata.id,
  //       (data: AsianPokerSessionDTO[] | undefined, unsub: Unsubscribe | undefined) => {
  //         console.log('WaitingRoomPageComponent new changes', data);
  //         if (data && unsub) {
  //           this.__addFirebaseListener('listenToSessionChanges', unsub);
  //           if (data) {
  //             this.session = data[0];
  //           }
  //         }
  //       },
  //     );
  //   }
  // }

  checkIfUser(userId: string, args: string[] = []) {
    return this.listener.checkIfUser(userId, args as UserPlayerCheck[]);
  }

  private async getPlayersDetails() {
    if (this.session) {
      const slots: SessionSlot[] = [...this.session.activity.playersSlots];

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
      this.apSession
        .startGame(session.metadata.id)
        .then(() => this.router.navigate(['/asian-poker/game/' + session.metadata.id]));
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
            sessionId: session.metadata.id,
            order,
          },
        },
        config: {
          showCloseButton: true,
          closeOnOutclick: true,
          callbackOnDestroy: async () => {
            // const [newSession] = await this.apSession.getSessionsByIds([session.metadata.id]);
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
      await this.apSession.kickFromWaiting(this.session.metadata.id, playerId);
    }
  }

  async setSlotLock(userId: string, slot: SessionSlot) {
    if (this.session) {
      await this.apSession.setSlotLock(this.session.metadata.id, userId);
    }
  }

  // listenToPlayersLeaveSession() {}
}
