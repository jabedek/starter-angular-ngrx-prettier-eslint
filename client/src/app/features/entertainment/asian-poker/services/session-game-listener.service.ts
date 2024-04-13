import { Injectable } from '@angular/core';
import { Unsubscribe } from 'firebase/firestore';
import { SessionGameDataPair, AsianPokerSessionDTO, AsianPokerGameDTO } from '../models';
import { AsianPokerSessionService } from '../firebase/asian-poker-session.service';
import { BaseComponent } from '@shared/abstracts/base/base.component';
import { ListenerCallback } from '@core/firebase/firebase-db.service';
import { BehaviorSubject, Observable, map, merge, mergeMap, withLatestFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SessionGameListenerService extends BaseComponent {
  private readonly session_ = new BehaviorSubject<AsianPokerSessionDTO | undefined>(undefined);
  readonly session$ = this.session_.asObservable();

  private readonly game_ = new BehaviorSubject<AsianPokerGameDTO | undefined>(undefined);
  readonly game$ = this.game_.asObservable();

  asDataPair: Observable<SessionGameDataPair> = this.session$.pipe(
    withLatestFrom(this.game$),
    map(([session, game]) => ({ session, game })),
  );

  constructor(private apSession: AsianPokerSessionService) {
    super('SessionGameListenerService');
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
}
