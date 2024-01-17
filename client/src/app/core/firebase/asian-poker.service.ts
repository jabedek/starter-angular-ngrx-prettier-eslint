import { Injectable, OnDestroy } from '@angular/core';
import { DbRes, FirebaseDbService, ListenerCallback } from './firebase-db.service';
import { generateDocumentId } from 'frotsi';
import {
  AsianPokerSession,
  AsianPokerSessionForm,
  SessionGameData,
} from '@features/entertainment/asian-poker/asian-poker-lobby.model';
import { consoleError, tryCatch } from '@shared/helpers/common.utils';
import { UserAppAccount } from '@store/auth/auth.state';
import { Unsubscribe, arrayUnion, increment, updateDoc } from 'firebase/firestore';
import { from, of } from 'rxjs';
import { AsianPokerGame } from '@features/entertainment/asian-poker/asian-poker-game.model';
import { BaseComponent } from '@shared/abstracts/base/base.component';

@Injectable({
  providedIn: 'root',
})
export class AsianPokerService {
  constructor(private fdb: FirebaseDbService) {}

  startNewSession(sessionData: AsianPokerSessionForm) {
    const session: AsianPokerSession = {
      ...sessionData,
      gameId: null,
      playersJoined: 0,
      playersJoinedIds: [],
      sessionState: 'lobby',
      finishResult: null,
    };

    return this.fdb.insertNew(DbRes.asianpoker_sessions, session);
  }

  async addPlayerToSession(playerId: string, sessionId: string) {
    await updateDoc(this.fdb.documentRef(DbRes.asianpoker_sessions, sessionId), {
      playersJoinedIds: arrayUnion(playerId),
      playersJoined: increment(1),
    });

    await updateDoc(this.fdb.documentRef(DbRes.users, playerId), {
      'appFeaturesData.asianPoker.currentSessionId': sessionId,
    });
  }

  async getSessions(sessionIds: string[] = []) {
    return this.fdb.getBy<AsianPokerSession>(DbRes.asianpoker_sessions, 'id', [...sessionIds]);
  }

  async getJoinableSessions() {
    return this.fdb.getBy<AsianPokerSession>(DbRes.asianpoker_sessions, 'sessionState', ['lobby']);
  }

  async getWatchableSessions() {
    return this.fdb.getBy<AsianPokerSession>(DbRes.asianpoker_sessions, 'sessionState', ['playing']);
  }

  async getSessionGame(sessionId: string): Promise<SessionGameData | undefined> {
    const sessions = await this.getSessions([sessionId]);
    const games = await this.fdb.getBy<AsianPokerGame>(DbRes.asianpoker_games, 'sessionId', [sessionId]);

    if (sessions && games) {
      return { session: sessions[0], game: games[0] };
    } else {
      return undefined;
    }
  }

  async listenToSessionChanges(sessionId: string, cb: ListenerCallback<AsianPokerSession[]>) {
    this.fdb.listenToChangesSnapshots<AsianPokerSession>(DbRes.asianpoker_sessions, 'id', [sessionId], cb);
  }
}
