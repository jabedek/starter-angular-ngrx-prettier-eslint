import { Injectable } from '@angular/core';
import {
  DbFeature,
  DbRes,
  DbResDetails,
  DbSubFeature,
  DbSubFeaturePart,
  FirebaseDbService,
  ListenerCallback,
} from '../../../../core/firebase/firebase-db.service';
import { consoleError } from '@shared/helpers/common.utils';
import { arrayUnion, updateDoc } from 'firebase/firestore';
import { SessionGameData } from '@features/entertainment/asian-poker/pages/game-page/game-session.resolver';
import { SessionInvitation, SessionPlayerSlot, SessionState } from '@features/entertainment/asian-poker/models/session.model';
import { AsianPokerGameDTO, AsianPokerSessionDTO } from '../models/dto';
import { GameActivityTickLogDTO } from '../models/game.model';
import { FirebaseUsersService } from '@core/firebase/firebase-users.service';
import { UserAppAccount } from '@store/auth/auth.state';
import { AsianPokerSessionCreationForm } from '../pages/lobby-page/create-session/create-session.component';
import { computePlayersAmount } from '../utils/session.utils';
import { generateDocumentId } from 'frotsi';

@Injectable({
  providedIn: 'root',
})
export class AsianPokerService {
  constructor(
    private fdb: FirebaseDbService,
    private fdbUsers: FirebaseUsersService,
  ) {}

  topFeature: DbFeature = 'features-entertainment';
  subFeature: DbSubFeature = 'asian-poker';

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

  async getSessionsByIds(sessionIds: string[]): Promise<AsianPokerSessionDTO[]> {
    return this.readManyBy('sessions', { key: 'id', values: sessionIds });
  }

  async getSessionsByStates(states: SessionState[]): Promise<AsianPokerSessionDTO[]> {
    return this.readManyBy('sessions', { key: 'sessionActivity.sessionState', values: states });
  }

  async getGamesByIds(gamesIds: string[]) {
    return this.readManyBy<AsianPokerGameDTO>('games', { key: 'id', values: gamesIds });
  }

  async addGameTick(gameId: string, tick: GameActivityTickLogDTO) {
    await this.updateData('games', gameId, { ticks: arrayUnion(tick) });
    // await updateDoc(this.fdb.documentRef(DbRes.asianpoker_games, gameId), { ticks: arrayUnion(tick) });
  }

  async getPlayerById(playerId: string) {
    const [result] = await this.fdbUsers.getUsersByIds([playerId]);
    return result;
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

  async listenToSessionChanges(sessionId: string, cb: ListenerCallback<AsianPokerSessionDTO[]>) {
    const readDetails = { key: 'id', values: [sessionId] };
    const dbResDetails: DbResDetails = [this.topFeature, this.subFeature, 'sessions'];
    this.fdb.listenToChangesSnapshots<AsianPokerSessionDTO>(readDetails, dbResDetails, cb);
  }

  async listenToGameChanges(gameId: string, cb: ListenerCallback<AsianPokerGameDTO[]>) {
    const readDetails = { key: 'id', values: [gameId] };
    const dbResDetails: DbResDetails = [this.topFeature, this.subFeature, 'games'];
    this.fdb.listenToChangesSnapshots<AsianPokerGameDTO>(readDetails, dbResDetails, cb);
    // this.fdb.listenToChangesSnapshots<AsianPokerGameDTO>(DbRes.asianpoker_games, 'id', [gameId], cb);
  }

  async createNewSession(sessionSettings: AsianPokerSessionCreationForm) {
    const { hostId, hostDisplayName, id, ...settings } = sessionSettings;

    const slots: SessionPlayerSlot[] = Array.from({ length: settings.playersLimit }, (_, index) => ({
      order: index,
      invitedId: null,
      playerId: null,
      status: 'empty',
      locked: false,
    }));

    slots[0] = {
      order: 0,
      invitedId: null,
      playerId: hostId,
      status: 'occupied',
      locked: true,
    };

    // Create session
    const session: AsianPokerSessionDTO = {
      id,
      gameId: `${id}_game`,
      chatId: `${id}_chat`,
      sessionSettings: { ...settings },
      sessionActivity: {
        hostId,
        hostDisplayName,
        playersJoinedAmount: 1,
        playersSlots: slots,
        invitations: [],
        sessionState: 'setup',
        finishResult: null,
      },
    };

    // Create chat
    const chat = {
      id: session.chatId,
      messages: [
        {
          id: `msg_${Date.now()}`,
          senderId: 'system',
          senderNickname: 'system',
          sentAtMS: Date.now(),
          content: 'Session created',
        },
      ],
    };

    // Create game
    const game: AsianPokerGameDTO = {
      id: session.gameId,
      sessionId: id,

      ticks: [
        {
          roundCounter: 0,
          cycleCounter: 0,

          currentPlayerIndex: 0,
          currentDealerIndex: 0,

          publicCards: [],
          playersWithHands: [],
          playersActions: [],

          deckVariant: null,
          pausesInfo: [],

          sentAtMS: Date.now(),
          gameState: 'just-created',
        },
      ],
    };

    return Promise.all([
      this.insertData('sessions', session.id, session),
      this.insertData('chats', chat.id, chat),
      this.insertData('games', game.id, game),
    ]);
  }

  async addPlayerToSession(playerId: string, sessionId: string) {
    const [session] = await this.getSessionsByIds([sessionId]);
    if (!session) {
      consoleError(`Session ${sessionId} not found`);
      return;
    }

    const presentPlayersIds = session.sessionActivity.playersSlots.map((slot) => slot.playerId);
    const presentInvitedIds = session.sessionActivity.playersSlots.map((slot) => slot.invitedId);

    // Check if player is joining after disconnect - he gets his slot back (if he locked it)
    if (presentPlayersIds.includes(playerId)) {
      const playerSlot = session.sessionActivity.playersSlots.find((slot) => slot.playerId === playerId);

      if (playerSlot && playerSlot.locked) {
        playerSlot.status = 'occupied';
      }
    }

    // Check if player is joining after being invited
    if (presentInvitedIds.includes(playerId)) {
      const playerSlot = session.sessionActivity.playersSlots.find((slot) => slot.invitedId === playerId);

      if (playerSlot) {
        playerSlot.status = 'occupied';
      }
    }

    // Check if player is joining for the first time
    if (!presentPlayersIds.includes(playerId) && !presentInvitedIds.includes(playerId)) {
      const emptySlot = session.sessionActivity.playersSlots.find((slot) => slot.status === 'empty');

      if (emptySlot) {
        emptySlot.status = 'occupied';
        emptySlot.playerId = playerId;
      }
    }

    session.sessionActivity.playersJoinedAmount = computePlayersAmount(session);

    await this.updateData('sessions', sessionId, session);
    // await updateDoc(this.fdb.documentRef(DbRes.asianpoker_sessions, sessionId), session);

    await this.fdb.updateDataGlobal(['users'], playerId, {
      'appFeaturesData.asianPoker.currentSessionId': sessionId,
    });

    // await updateDoc(this.fdb.documentRef(DbRes.users, playerId), {
    //   'appFeaturesData.asianPoker.currentSessionId': sessionId,
    // });
  }

  async invite(sessionId: string, data: { playerEmail: string; additionalText: string }, slotOrder: number) {
    const [session] = await this.getSessionsByIds([sessionId]);
    if (!session) {
      consoleError(`Session ${sessionId} not found`);
      return;
    }

    const player = await this.fdb.readOneByGlobal<UserAppAccount>(['users'], { key: 'email', value: data.playerEmail });

    // if (!player) {
    //   consoleError(`Player ${playerEmail} not found`);
    //   return;
    // }

    // // Check if player is already in session
    // const presentPlayersIds = session.sessionActivity.playersSlots.map((slot) => slot.playerId);
    // if (presentPlayersIds.includes(player.id)) {
    //   consoleError(`Player ${playerEmail} is already in session`);
    //   return;
    // }

    // // Check if player is already invited
    // const presentInvitedIds = session.sessionActivity.playersSlots.map((slot) => slot.invitedId);
    // if (presentInvitedIds.includes(player.id)) {
    //   consoleError(`Player ${playerEmail} is already invited`);
    //   return;
    // }

    if (player) {
      const invitation: SessionInvitation = {
        id: generateDocumentId(),
        sessionId,
        invitedId: player.id,
        hostId: session.sessionActivity.hostId,
        hostDisplayName: session.sessionActivity.hostDisplayName,
        active: true,
        seen: false,
        accepted: false,
        slotOrder,
        additionalText: data.additionalText,
      };

      session.sessionActivity.playersSlots[slotOrder].invitedId = player.id;
      session.sessionActivity.playersSlots[slotOrder].status = 'invited';
      session.sessionActivity.playersSlots[slotOrder].locked = true;
      session.sessionActivity.invitations = [...session.sessionActivity.invitations, invitation];

      // success
      console.log('success', session);

      await this.updateData('sessions', sessionId, session);
      await this.fdb.updateDataGlobal(['users'], player.id, {
        'appFeaturesData.asianPoker.invitations': arrayUnion(invitation.id),
      });
      // await updateDoc(this.fdb.documentRef(DbRes.asianpoker_sessions, sessionId), session);
    }
  }

  async startGame(sessionId: string) {
    const res = await this.getSessionAndGame(sessionId);

    if (!res) {
      consoleError(`Session ${sessionId} or game not found`);
      return;
    }

    const { session, game } = res;

    // Update session
    session.sessionActivity.sessionState = 'in-game';

    const newTick: GameActivityTickLogDTO = {
      roundCounter: 0,
      cycleCounter: 0,

      currentPlayerIndex: 0,
      currentDealerIndex: 0,

      publicCards: [],
      playersWithHands: [],
      playersActions: [],

      deckVariant: null,
      pausesInfo: [],

      sentAtMS: Date.now(),
      gameState: 'just-started',
    };

    game.ticks = [...game.ticks, newTick];

    return Promise.all([this.updateData('sessions', session.id, session), this.updateData('games', game.id, game)]).catch((e) =>
      consoleError(e, 'Error while starting game'),
    );
  }
}
