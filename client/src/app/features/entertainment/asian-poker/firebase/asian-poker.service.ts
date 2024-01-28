import { Injectable, OnDestroy } from '@angular/core';
import { DbRes, FirebaseDbService, ListenerCallback } from '../../../../core/firebase/firebase-db.service';
import { generateDocumentId } from 'frotsi';
import { consoleError, tryCatch } from '@shared/helpers/common.utils';
import { updateDoc } from 'firebase/firestore';
import { SessionGameData } from '@features/entertainment/asian-poker/pages/game-page/game-session.resolver';
import { AsianPokerSessionSettings, SessionState } from '@features/entertainment/asian-poker/models/lobby.model';
import { AsianPokerGameDTO, AsianPokerSessionDTO } from '../models/dto';

@Injectable({
  providedIn: 'root',
})
export class AsianPokerService {
  constructor(private fdb: FirebaseDbService) {}

  startNewSession(id: string, sessionSettings: AsianPokerSessionSettings) {
    const session: AsianPokerSessionDTO = {
      id,
      gameId: null,
      sessionSettings: { ...sessionSettings },
      sessionActivity: {
        playersJoined: 0,
        playersJoinedIds: [],
        sessionState: 'setup',
        finishResult: null,
      },
    };

    return this.fdb.insertNew(DbRes.asianpoker_sessions, session);
  }

  async startNewGame(sessionId: string, playersIDs: string[]) {
    const gameId = generateDocumentId('asianpoker_game');
    // Update session player data
    const [session]: AsianPokerSessionDTO[] = await this.fdb.getBy(DbRes.asianpoker_sessions, 'id', [sessionId]);

    const sessionUpdate: AsianPokerSessionDTO = {
      ...session,
      gameId,
      sessionActivity: {
        ...session.sessionActivity,
        playersJoinedIds: playersIDs,
        playersJoined: playersIDs.length,
        sessionState: 'in-game',
      },
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
    const game: AsianPokerGameDTO = {
      id: gameId,
      sessionId,

      gameState: 'just-started',

      roundCounter: 0,
      cycleCounter: 0,

      currentPlayerIndex: 0,
      currentDealerIndex: 0,

      deckVariant: 'standard',
      pausesInfo: [],

      publicCards: [],
      playersWithHands: [],
      playersActions: [],
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
    const [session] = await this.getSessionsByIds([sessionId]);
    if (!session) {
      consoleError(`Session ${sessionId} not found`);
      return;
    }

    const players = new Set([...session.sessionActivity.playersJoinedIds, playerId]);
    session.sessionActivity.playersJoinedIds = [...players];
    session.sessionActivity.playersJoined = players.size;

    await updateDoc(this.fdb.documentRef(DbRes.asianpoker_sessions, sessionId), session);

    await updateDoc(this.fdb.documentRef(DbRes.users, playerId), {
      'appFeaturesData.asianPoker.currentSessionId': sessionId,
    });
  }

  async getSessionsByIds(sessionIds: string[]) {
    return this.fdb.getBy<AsianPokerSessionDTO>(DbRes.asianpoker_sessions, 'id', sessionIds);
  }

  async getSessionsByStates(states: SessionState[]) {
    return this.fdb.getBy<AsianPokerSessionDTO>(DbRes.asianpoker_sessions, 'sessionState', states);
  }

  async listenToSessionChanges(sessionId: string, cb: ListenerCallback<AsianPokerSessionDTO[]>) {
    this.fdb.listenToChangesSnapshots<AsianPokerSessionDTO>(DbRes.asianpoker_sessions, 'id', [sessionId], cb);
  }

  async getSessionGame(sessionId: string): Promise<SessionGameData | undefined> {
    const sessions = await this.getSessionsByIds([sessionId]);
    const games = await this.fdb.getBy<AsianPokerGameDTO>(DbRes.asianpoker_games, 'sessionId', [sessionId]);

    if (sessions && games) {
      return { session: sessions[0], game: games[0] };
    } else {
      return undefined;
    }
  }

  async getGamesByIds(gamesIds: string[]) {
    return this.fdb.getBy<AsianPokerSessionDTO>(DbRes.asianpoker_games, 'id', gamesIds);
  }

  async listenToGameChanges(gameId: string, cb: ListenerCallback<AsianPokerGameDTO[]>) {
    this.fdb.listenToChangesSnapshots<AsianPokerGameDTO>(DbRes.asianpoker_games, 'id', [gameId], cb);
  }
}
