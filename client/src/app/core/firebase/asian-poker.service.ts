import { Injectable, OnDestroy } from '@angular/core';
import { DbRes, FirebaseDbService, ListenerCallback } from './firebase-db.service';
import { generateDocumentId } from 'frotsi';
import {
  AsianPokerSession,
  AsianPokerSessionForm,
  SessionGameData,
} from '@features/entertainment/asian-poker/asian-poker-lobby.model';
import { consoleError, tryCatch } from '@shared/helpers/common.utils';
import { updateDoc } from 'firebase/firestore';
import { AsianPokerGame } from '@features/entertainment/asian-poker/asian-poker-game.model';

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
      sessionState: 'setup',
      finishResult: null,
    };

    return this.fdb.insertNew(DbRes.asianpoker_sessions, session);
  }

  async startNewGame(sessionId: string, playersIDs: string[]) {
    const gameId = generateDocumentId('asianpoker_game');
    // Update session player data
    const [session]: AsianPokerSession[] = await this.fdb.getBy(DbRes.asianpoker_sessions, 'id', [sessionId]);

    const sessionUpdate: AsianPokerSession = {
      ...session,
      playersJoinedIds: playersIDs,
      playersJoined: playersIDs.length,
      sessionState: 'in-game',
      gameId,
    };

    // // Update each player data
    //         Promise.all([...playersIDs.map((task) => TasksAPI.deleteTask(task, schedule.projectId))])
    //           .then(() => {
    //             if (deleteScheduleAlso) {
    //               deleteDoc(doc(FirebaseDB, 'schedules', scheduleId)).catch((e) => console.error('deleteDoc schedules', e));
    //             }
    //           })
    //           .catch((e) => console.error('deleteTask(s)', e));

    // playersIDs.forEach((playerId) => {
    //   const playerRef = this.fdb.documentRef(DbRes.users, playerId);

    //   this.fdb.update(playerRef, {
    //     'appFeaturesData.asianPoker.currentSessionId': sessionId,
    //   });
    // });

    // Create game
    const game: AsianPokerGame = {
      id: gameId,
      sessionId,
      gameState: 'started',
      deckVariant: 'standard',
      turnsCounter: 0,
      turnCycleCounter: 0,
      turnPlayers: [],
      currentPlayerIndex: 0,
      currentDealerIndex: 0,
      publicCards: [],
      playersCalls: [],
    };

    console.log('startNewGame', sessionId, playersIDs, gameId);

    const [result, error] = await tryCatch(
      Promise.all([
        this.fdb.insertNew(DbRes.asianpoker_games, game),
        this.fdb.updateFullOverwrite(DbRes.asianpoker_sessions, sessionUpdate),
      ]),
    );

    if (result) {
      return result;
    }
    if (error) {
      consoleError(error, 'startNewGame ' + sessionId);
    }
    return;
  }

  async addPlayerToSession(playerId: string, sessionId: string) {
    const [session] = await this.getSessions([sessionId]);
    if (!session) {
      consoleError(`Session ${sessionId} not found`);
      return;
    }

    const players = new Set([...session.playersJoinedIds, playerId]);
    session.playersJoinedIds = [...players];
    session.playersJoined = players.size;

    await updateDoc(this.fdb.documentRef(DbRes.asianpoker_sessions, sessionId), session);

    await updateDoc(this.fdb.documentRef(DbRes.users, playerId), {
      'appFeaturesData.asianPoker.currentSessionId': sessionId,
    });
  }

  async getSessions(sessionIds: string[] = []) {
    return this.fdb.getBy<AsianPokerSession>(DbRes.asianpoker_sessions, 'id', [...sessionIds]);
  }

  async getJoinableSessions() {
    return this.fdb.getBy<AsianPokerSession>(DbRes.asianpoker_sessions, 'sessionState', ['setup']);
  }

  async getWatchableSessions() {
    return this.fdb.getBy<AsianPokerSession>(DbRes.asianpoker_sessions, 'sessionState', ['in-game']);
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
