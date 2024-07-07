import { Injectable } from '@angular/core';
import { Unsubscribe } from 'firebase/firestore';
import { AsianPokerSessionService } from '../firebase/asian-poker-session.service';
import { BaseComponent } from '@shared/abstracts/base/base.component';
import { BehaviorSubject, Observable, map, merge, mergeMap, takeUntil, tap, withLatestFrom } from 'rxjs';
import { Flatten } from 'frotsi';
import { SessionGameDataPair } from '../models/types/common.model';
import { AsianPokerGameDTO } from '../models/types/session-game-chat/game.model';
import { AsianPokerSessionDTO } from '../models/types/session-game-chat/session.model';

type UserPlayerCheckBase =
  | 'host'
  | 'dealer'
  | 'current-player'
  | 'joined-by-invite'
  | 'self-joined'
  | 'occupies-slot'
  | 'occupies-slot-locked';
export type UserPlayerCheck = Flatten<`not-${UserPlayerCheckBase}` | UserPlayerCheckBase>;

@Injectable({
  providedIn: 'root',
})
export class SessionGameListenerService extends BaseComponent {
  private readonly session_ = new BehaviorSubject<AsianPokerSessionDTO | undefined>(undefined);
  readonly session$ = this.session_.asObservable();
  private _session: AsianPokerSessionDTO | undefined;

  private readonly game_ = new BehaviorSubject<AsianPokerGameDTO | undefined>(undefined);
  readonly game$ = this.game_.asObservable();
  private _game: AsianPokerGameDTO | undefined;

  asDataPair: Observable<SessionGameDataPair> = this.session$.pipe(
    withLatestFrom(this.game$),
    map(([session, game]) => ({ session, game })),
  );

  constructor(private apSession: AsianPokerSessionService) {
    super('SessionGameListenerService');

    this.session_
      .asObservable()
      .pipe(
        tap((data) => {
          console.log(data);
          this._session = data;
        }),
        takeUntil(this.__destroy),
      )
      .subscribe();

    this.game_
      .asObservable()
      .pipe(
        tap((data) => (this._game = data)),
        takeUntil(this.__destroy),
      )
      .subscribe();
  }

  listenToSessionChanges(sessionId: string) {
    this.apSession.listenToSessionChanges(sessionId, (changes: AsianPokerSessionDTO[] = [], unsub: Unsubscribe | undefined) => {
      if (changes && unsub) {
        this.__addFirebaseListener('listenToSessionChanges', unsub);
        this.session_.next(changes[0]);
      }
    });
  }

  listenToGameChanges(gameId: string) {
    this.apSession.listenToGameChanges(gameId, (changes: AsianPokerGameDTO[] = [], unsub: Unsubscribe | undefined) => {
      if (changes && unsub) {
        this.__addFirebaseListener('listenToGameChanges', unsub);
        this.game_.next(changes[0]);
      }
    });
  }

  checkIfUser(playerId: string | undefined, args: UserPlayerCheck[]) {
    // console.log(playerId, args, this._session);

    if (!(playerId && args.length > 0 && this._session)) {
      return;
    }

    const results: boolean[] = [];

    args.forEach((is) => {
      switch (is) {
        case 'not-host':
        case 'host': {
          const hostId = this._session?.activity.hostId;
          const result = hostId === playerId;
          results.push(is.includes('not-') ? !result : result);
          break;
        }

        case 'not-dealer':
        case 'dealer': {
          if (!this._game) {
            break;
          }
          const dealerId = this._game.ticks.last()?.roundInfo.currentDealerIndex || '-1';
          const result = dealerId === playerId;
          results.push(is.includes('not-') ? !result : result);
          break;
        }

        case 'not-current-player':
        case 'current-player': {
          if (!this._game) {
            break;
          }
          const currentPlayerId = this._game.ticks.last()?.cycleInfo.currentPlayerIndex || '-1';
          const result = currentPlayerId === playerId;
          results.push(is.includes('not-') ? !result : result);
          break;
        }
        case 'not-occupies-slot':
        case 'occupies-slot': {
          const slot = this._session?.activity.playersSlots.find((slot) => slot.playerId === playerId);
          if (!slot) {
            break;
          }
          const result = slot.status === 'occupied';
          results.push(is.includes('not-') ? !result : result);
          break;
        }
        case 'not-occupies-slot-locked':
        case 'occupies-slot-locked': {
          const slot = this._session?.activity.playersSlots.find((slot) => slot.playerId === playerId);
          if (!slot) {
            break;
          }
          const result = slot.locked;
          results.push(is.includes('not-') ? !result : result);
          break;
        }
        default: {
          break;
        }
      }
    });

    return results.every((result) => !!result);
  }
}
