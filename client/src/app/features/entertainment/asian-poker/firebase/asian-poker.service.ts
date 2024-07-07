import { Injectable } from '@angular/core';
import {
  DbFeature,
  DbResDetails,
  DbSubFeature,
  DbSubFeaturePart,
  FirebaseDbService,
} from '../../../../core/firebase/firebase-db.service';
import { SessionGameData } from '@features/entertainment/asian-poker/pages/game-page/game-session.resolver';
import { AsianPokerGameDTO } from '../models/types/session-game-chat/game.model';
import { FirebaseUsersService } from '@core/firebase/firebase-users.service';
import { AsianPokerSessionDTO } from '../models/types/session-game-chat/session.model';
import { SessionStatus } from '../models/types/session-game-chat/session.status.model';

@Injectable({
  providedIn: 'root',
})
export class AsianPokerService {
  topFeature: DbFeature = 'features-entertainment';
  subFeature: DbSubFeature = 'asian-poker';

  constructor(
    private fdb: FirebaseDbService,
    private fdbUsers: FirebaseUsersService,
  ) {}

  // Base methods
  async insertData(dbRes: DbSubFeaturePart, docId: string, data: any) {
    const dbResDetails: DbResDetails = [this.topFeature, this.subFeature, dbRes];
    this.fdb.insertDataGlobal(dbResDetails, docId, data); //.catch((e) => consoleError(e, 'Error while creating new' + dbRes));
  }

  async updateData(dbRes: DbSubFeaturePart, docId: string, data: any) {
    const dbResDetails: DbResDetails = [this.topFeature, this.subFeature, dbRes];
    this.fdb.updateDataGlobal(dbResDetails, docId, data); //.catch((e) => consoleError(e, 'Error while updating' + dbRes));
  }

  async readOneBy<T>(dbRes: DbSubFeaturePart, readDetails: { key: string; value: string | number | boolean }) {
    const dbResDetails: DbResDetails = [this.topFeature, this.subFeature, dbRes];
    return this.fdb.readOneByGlobal<T>(dbResDetails, readDetails); //.catch((e) => consoleError(e, 'Error while reading' + dbRes));
  }

  async readManyBy<T>(dbRes: DbSubFeaturePart, readDetails: { key: string; values: (string | number | boolean)[] }) {
    const dbResDetails: DbResDetails = [this.topFeature, this.subFeature, dbRes];
    return this.fdb.readManyByGlobal<T>(dbResDetails, readDetails); //.catch((e) => consoleError(e, 'Error while reading' + dbRes));
  }

  // Specific methods
  async getSessionsByIds(sessionIds: string[]): Promise<AsianPokerSessionDTO[]> {
    return this.readManyBy('sessions', { key: 'metadata.id', values: sessionIds });
  }

  async getSessionsByStates(states: SessionStatus[]): Promise<AsianPokerSessionDTO[]> {
    return this.readManyBy('sessions', { key: 'activity.status', values: states });
  }

  async getSessionAndGame(sessionId: string): Promise<SessionGameData | undefined> {
    const [session] = await this.getSessionsByIds([sessionId]);
    const game = await this.readOneBy<AsianPokerGameDTO>('games', { key: 'sessionId', value: sessionId });
    // const games = await this.fdb.getBy<AsianPokerGameDTO>(DbRes.asianpoker_games, 'sessionId', [sessionId]);

    if (session && game) {
      return { session, game };
    } else {
      return undefined;
    }
  }

  async getGamesByIds(gamesIds: string[]) {
    return this.readManyBy<AsianPokerGameDTO>('games', { key: 'id', values: gamesIds });
  }

  async getPlayerById(playerId: string) {
    const [result] = await this.fdbUsers.getUsersByIds([playerId]);
    return result;
  }
}
