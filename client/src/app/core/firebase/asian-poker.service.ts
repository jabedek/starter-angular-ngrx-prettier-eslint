import { Injectable } from '@angular/core';
import { DbRes, FirebaseDbService } from './firebase-db.service';
import { generateDocumentId } from 'frotsi';
import {
  AsianPokerSession,
  AsianPokerSessionForm,
  SessionGameData,
} from '@features/entertainment/asian-poker/asian-poker-lobby.model';
import { consoleError, tryCatch } from '@shared/helpers/common.utils';
import { UserAppAccount } from '@store/auth/auth.state';
import { arrayUnion, increment, updateDoc } from 'firebase/firestore';
import { from, of } from 'rxjs';
import { AsianPokerGame } from '@features/entertainment/asian-poker/asian-poker-game.model';

@Injectable({
  providedIn: 'root',
})
export class AsianPokerService {
  constructor(private fdb: FirebaseDbService) {}

  startNewSession(sessionData: AsianPokerSessionForm) {
    const session: AsianPokerSession = {
      ...sessionData,
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

  async getSessions(sessionId: string) {
    return this.fdb.getBy<AsianPokerSession>(DbRes.asianpoker_sessions, 'id', [sessionId]);
  }

  async getSessionGame(sessionId: string): Promise<SessionGameData | undefined> {
    const sessions = await this.getSessions(sessionId);
    const games = await this.fdb.getBy<AsianPokerGame>(DbRes.asianpoker_games, 'sessionId', [sessionId]);

    if (sessions && games) {
      return { session: sessions[0], game: games[0] };
    } else {
      return undefined;
    }
  }
}
