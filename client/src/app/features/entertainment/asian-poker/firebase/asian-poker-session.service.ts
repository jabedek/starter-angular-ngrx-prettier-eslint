import { Injectable } from '@angular/core';
import { DbFeature, DbResDetails, DbSubFeature, FirebaseDbService, ListenerCallback } from '@core/firebase/firebase-db.service';
import { FirebaseUsersService } from '@core/firebase/firebase-users.service';
import { AsianPokerService } from './asian-poker.service';
import { consoleError } from '@shared/helpers/common.utils';
import { UserAppAccount } from '@store/auth/auth.state';
import { arrayUnion } from 'firebase/firestore';
import { generateDocumentId } from 'frotsi';
import { AsianPokerGameDTO, GameActivityTickLogDTO, RoundInfoDTO } from '../models/types/session-game-chat/game.model';
import { SessionSlot } from '../models/types/player-slot.model';
import { AsianPokerSessionDTO, SessionInvitation } from '../models/types/session-game-chat/session.model';
import { computePlayersAmount } from '../utils/session.utils';
import { getNextStatus } from '../utils/session-status.helper';
import { AsianPokerSessionCreationForm } from '../pages/main-lobby-page/components/create-session/create-session.component';
import { mapCardsTo } from '../utils/mappers/cards.mapper';

@Injectable({
  providedIn: 'root',
})
export class AsianPokerSessionService {
  topFeature: DbFeature = 'features-entertainment';
  subFeature: DbSubFeature = 'asian-poker';

  constructor(
    private ap: AsianPokerService,
    private fbDb: FirebaseDbService,
    private fbUsers: FirebaseUsersService,
  ) {}

  /* # Listeners # */
  async listenToSessionChanges(sessionId: string, cb: ListenerCallback<AsianPokerSessionDTO[]>) {
    const readDetails = { key: 'id', values: [sessionId] };
    const dbResDetails: DbResDetails = [this.topFeature, this.subFeature, 'sessions'];
    this.fbDb.listenToChangesSnapshots<AsianPokerSessionDTO>(readDetails, dbResDetails, cb);
  }

  async listenToGameChanges(gameId: string, cb: ListenerCallback<AsianPokerGameDTO[]>) {
    const readDetails = { key: 'id', values: [gameId] };
    const dbResDetails: DbResDetails = [this.topFeature, this.subFeature, 'games'];
    this.fbDb.listenToChangesSnapshots<AsianPokerGameDTO>(readDetails, dbResDetails, cb);
    // this.fbDb.listenToChangesSnapshots<AsianPokerGameDTO>(DbRes.asianpoker_games, 'id', [gameId], cb);
  }

  /* # Session and players management (in initial stages - Lobby and Waiting) # */

  async createNewSession(sessionSettings: AsianPokerSessionCreationForm) {
    console.log(sessionSettings);

    const { hostId, hostDisplayName, id, ...settings } = sessionSettings;

    const slots: SessionSlot[] = Array.from({ length: settings.playersLimit }, (_, index) => ({
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
      metadata: {
        id,
        gameId: `${id}_game`,
        chatId: `${id}_chat`,
      },
      title: settings.title,
      restrictions: {
        playersLimit: settings.playersLimit,
        actionDurationSeconds: settings.actionDurationSeconds,
        spectatorsAllowed: settings.spectatorsAllowed,
      },
      accessibility: {
        password: settings.password,
        inviteNeeded: settings.inviteNeeded,
        listability: settings.listability,
      },
      activity: {
        hostId,
        hostDisplayName,
        playersJoinedAmount: 1,
        playersSlots: slots,
        invitations: [],
        status: 'session-created',
        finishResult: null,
      },
    };

    // Create chat
    const chat = {
      id: session.metadata.chatId,
      messages: [
        {
          id: generateDocumentId('msg'),
          senderId: 'system',
          senderNickname: 'system',
          sentAtMS: Date.now(),
          content: 'Session created',
        },
      ],
    };

    // Create game
    const game: AsianPokerGameDTO = {
      id: session.metadata.gameId,
      sessionId: id,
      ticks: [],
    };

    return Promise.all([
      this.ap.insertData('sessions', session.metadata.id, session),
      this.ap.insertData('chats', chat.id, chat),
      this.ap.insertData('games', game.id, game),
    ]);
  }

  async addPlayerToSession(playerId: string, sessionId: string) {
    const [session] = await this.ap.getSessionsByIds([sessionId]);
    if (!session) {
      consoleError(`Session ${sessionId} not found`);
      return;
    }

    const presentPlayersIds = session.activity.playersSlots.map((slot) => slot.playerId);
    const presentInvitedIds = session.activity.playersSlots.map((slot) => slot.invitedId);

    // Check if player is joining after disconnect - he gets his slot back if he locked it
    if (presentPlayersIds.includes(playerId)) {
      const playerSlot = session.activity.playersSlots.find((slot) => slot.playerId === playerId);

      if (playerSlot && playerSlot.locked) {
        playerSlot.status = 'occupied';
      }
    }

    // Check if player is joining after being invited - he gets his slot back
    if (presentInvitedIds.includes(playerId)) {
      const playerSlot = session.activity.playersSlots.find((slot) => slot.invitedId === playerId);

      if (playerSlot) {
        playerSlot.status = 'occupied';
      }
    }

    // Check if player is joining for the first time
    if (!presentPlayersIds.includes(playerId) && !presentInvitedIds.includes(playerId)) {
      const emptySlot = session.activity.playersSlots.find((slot) => slot.status === 'empty');

      if (emptySlot) {
        emptySlot.status = 'occupied';
        emptySlot.playerId = playerId;
      }
    }

    session.activity.playersJoinedAmount = computePlayersAmount(session);

    await this.ap.updateData('sessions', sessionId, session);
    // await updateDoc(this.fbDb.documentRef(DbRes.asianpoker_sessions, sessionId), session);

    await this.fbDb.updateDataGlobal(['users'], playerId, {
      'appFeaturesData.asianPoker.currentSessionId': sessionId,
    });

    // await updateDoc(this.fbDb.documentRef(DbRes.users, playerId), {
    //   'appFeaturesData.asianPoker.currentSessionId': sessionId,
    // });
  }

  async sendInvite(sessionId: string, data: { playerEmail: string; additionalText: string }, slotOrder: number) {
    const playerEmail = data.playerEmail;
    const [session] = await this.ap.getSessionsByIds([sessionId]);
    if (!session) {
      const errMsg = `Session ${sessionId} not found`;
      consoleError(errMsg);
      throw new Error(errMsg);
    }

    const player = await this.fbDb.readOneByGlobal<UserAppAccount>(['users'], { key: 'email', value: playerEmail });

    if (!player) {
      const errMsg = `Player with email ${playerEmail} not found`;
      consoleError(errMsg);
      throw new Error(errMsg);
    }

    // // Check if player is already in session
    const presentPlayersIds = session.activity.playersSlots.map((slot) => slot.playerId);
    if (presentPlayersIds.includes(player.id)) {
      const errMsg = `Player ${playerEmail} is already in session`;
      consoleError(errMsg);
      throw new Error(errMsg);
    }

    // // Check if player is already invited
    const presentInvitedIds = session.activity.playersSlots.map((slot) => slot.invitedId);
    if (presentInvitedIds.includes(player.id)) {
      const errMsg = `Player ${playerEmail} is already invited`;
      consoleError(errMsg);
      throw new Error(errMsg);
    }

    const invitation: SessionInvitation = {
      id: generateDocumentId(),
      sessionId,
      invitedId: player.id,
      hostId: session.activity.hostId,
      hostDisplayName: session.activity.hostDisplayName,
      active: true,
      seen: false,
      accepted: false,
      slotOrder,
      additionalText: data.additionalText,
    };

    session.activity.playersSlots[slotOrder].invitedId = player.id;
    session.activity.playersSlots[slotOrder].status = 'invited';
    session.activity.playersSlots[slotOrder].locked = true;
    session.activity.invitations = [...session.activity.invitations, invitation];

    // success
    console.log('success', session);
    return await Promise.allSettled([
      this.ap.updateData('sessions', sessionId, session),
      this.fbDb.updateDataGlobal(['users'], player.id, {
        'appFeaturesData.asianPoker.invitations': arrayUnion(invitation.id),
      }),
    ]);
    // await updateDoc(this.fbDb.documentRef(DbRes.asianpoker_sessions, sessionId), session);
  }

  async kickFromWaiting(sessionId: string, playerId: string) {
    const [session] = await this.ap.getSessionsByIds([sessionId]);
    if (!session) {
      consoleError(`Session ${sessionId} not found`);
      return;
    }

    const playerSlotIndex = session.activity.playersSlots.findIndex((slot) => slot.playerId === playerId);

    if (playerSlotIndex < 0) {
      consoleError(`Slot with Player ${playerId} not found`);
      return;
    }

    session.activity.playersSlots[playerSlotIndex].status = 'empty';
    session.activity.playersSlots[playerSlotIndex].playerId = null;
    session.activity.playersSlots[playerSlotIndex].locked = false;
    session.activity.playersJoinedAmount = session.activity.playersJoinedAmount - 1;

    return Promise.all([
      this.ap.updateData('sessions', sessionId, session),
      await this.fbDb.updateDataGlobal(['users'], playerId, {
        'appFeaturesData.asianPoker.currentSessionId': null,
      }),
    ]);
  }

  async setSlotLock(sessionId: string, userId: string, force = undefined) {
    const [session] = await this.ap.getSessionsByIds([sessionId]);
    const [player] = await this.fbUsers.getUsersByIds([userId]);

    if (!session) {
      consoleError(`Session ${sessionId} not found`);
      return;
    }

    if (!player) {
      consoleError(`Player ${userId} not found`);
      return;
    }

    const playerSlotIndex = session.activity.playersSlots.findIndex((slot) => slot.playerId === userId);

    if (playerSlotIndex < 0) {
      consoleError(`Slot with Player ${userId} not found`);
      return;
    }

    if (force !== undefined) {
      session.activity.playersSlots[playerSlotIndex].locked = force;
    } else {
      session.activity.playersSlots[playerSlotIndex].locked = !session.activity.playersSlots[playerSlotIndex].locked;
    }

    return this.ap.updateData('sessions', sessionId, session);
  }

  /* # Game management # */

  /** * Session is moving from Wait page to the Game page and the game is being initialized */
  async startGame(sessionId: string) {
    const res = await this.ap.getSessionAndGame(sessionId);

    if (!res) {
      consoleError(`Session ${sessionId} or game not found`);
      return;
    }

    const { session, game } = res;

    // Update session
    session.activity.status = getNextStatus(session.activity.status);

    game.ticks = [...game.ticks];

    return Promise.all([this.ap.updateData('sessions', session.metadata.id, session)]).catch((e) =>
      consoleError(e, 'Error while starting game'),
    );
  }

  async addGameTick(gameId: string, tick: GameActivityTickLogDTO) {
    const tickMutated: GameActivityTickLogDTO = {
      ...tick,
      roundInfo: {
        ...tick.roundInfo,
        publicCards: mapCardsTo('backend', tick.roundInfo.publicCards) as any,
      },
      cycleInfo: {
        ...tick.cycleInfo,
        gameSlots: tick.cycleInfo.gameSlots.map((slot) => {
          slot.playerWithHand.hand = mapCardsTo('backend', slot.playerWithHand.hand) as any;
          return slot;
        }),
      },
    };

    await this.ap.updateData('games', gameId, { ticks: arrayUnion(tickMutated) });
  }

  async getGameTicks(gameId: string): Promise<GameActivityTickLogDTO[]> {
    const [game] = await this.ap.getGamesByIds([gameId]);
    game.ticks.forEach((tick) => {
      tick.roundInfo.publicCards = mapCardsTo('frontend', tick.roundInfo.publicCards) as any;
    });

    return game.ticks;
  }
}
