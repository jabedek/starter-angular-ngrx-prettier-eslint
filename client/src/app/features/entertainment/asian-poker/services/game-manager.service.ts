import { Injectable } from '@angular/core';
import { shuffleCollection } from '@shared/helpers/collections.utils';
import { AsianPokerGameDTO, GameActivityTickLogDTO, TickTriggeringAction } from '../models/session-game-chat/game.model';
import { Card } from '../models/card.model';
import { createNewDeck, drawCards } from '../utils/game.utils';
import { FirebaseUsersService } from '@core/firebase/firebase-users.service';
import { SessionGameDataPair } from '../models/common.model';
import { AsianPokerService } from '../firebase/asian-poker.service';
import { SessionSlot, GameSlot, GameTickAction, PlayerTickAction } from '../models/session-game-chat/player-slot.model';
import { BehaviorSubject, EMPTY, Observable, ReplaySubject, filter, from, switchMap } from 'rxjs';
import { AsianPokerSessionDTO } from '../models/session-game-chat/session.model';
import { DeckVariant } from '../constants/deck.constant';

export type ActionTickPayload = {
  action: PlayerTickAction | GameTickAction;
  tickLog?: GameActivityTickLogDTO;
};

@Injectable({
  providedIn: 'root',
})
export class GameManagerService {
  private externalData: { session: AsianPokerSessionDTO | undefined; game: AsianPokerGameDTO | undefined } = {
    session: undefined,
    game: undefined,
  };

  private internalData = {
    roundInfo: { counter: -1, currentDealerIndex: -1, deckVariant: 'standard' as DeckVariant, publicCards: [] as Card[] },
    cycleInfo: { counter: -1, currentPlayerIndex: -1, gameSlots: [] as GameSlot[] },
  };

  readonly tickTriggeringActionsNext = new ReplaySubject<ActionTickPayload>(1);

  readonly tickTriggeringActions$ = this.tickTriggeringActionsNext
    .asObservable()
    .pipe(switchMap((action) => this.sendoutIncomingActions(action)));

  constructor(
    private firebaseUsers: FirebaseUsersService,
    private as: AsianPokerService,
  ) {}

  async create(dataPair: SessionGameDataPair) {
    this.externalData = dataPair;

    const players = dataPair.session.sessionActivity.playersSlots || [];
    const unshuffled: GameSlot[] = await this.createGameSlots(players);
    const shuffled: GameSlot[] = await this.getShuffledPlayers(unshuffled);

    const hostSlotIndex = shuffled.findIndex((slot) => slot.playerId === dataPair.session.sessionActivity.hostId);
    const hostSlot = { ...shuffled[hostSlotIndex] };
    const lastSlot = { ...shuffled[shuffled.length - 1] };

    shuffled[hostSlotIndex] = lastSlot;
    shuffled[0] = hostSlot;

    const newAction = { atMS: Date.now(), type: 'GAME_CREATE' } as GameTickAction;
    const newTick: GameActivityTickLogDTO = {
      roundInfo: { counter: -1, currentDealerIndex: -1, deckVariant: null, publicCards: [] as Card[] },
      cycleInfo: { counter: -1, currentPlayerIndex: -1, gameSlots: shuffled as GameSlot[] },
      tickTriggeredBy: newAction,
    };

    return this.as
      .updateData('sessions', dataPair.session.id, { 'sessionActivity.status': 'game-created' })
      .then(() => this.tickTriggeringActionsNext.next({ action: newAction, tickLog: newTick }));
  }

  getNextRoundSettings() {
    const { roundInfo, cycleInfo } = this.internalData;

    const roundIndex = roundInfo.counter;
    const cycleIndex = cycleInfo.counter;
    const players = cycleInfo.gameSlots;
    const { deckVariant, playersCards, publicCards, undealt } = this.getNewShuffledDeck(players);

    this.internalData.roundInfo = {
      counter: roundIndex + 1,
      currentDealerIndex: roundInfo.currentDealerIndex + 1,
      deckVariant,
      publicCards,
    };

    this.internalData.cycleInfo = {
      counter: cycleIndex + 1,
      currentPlayerIndex: cycleInfo.currentPlayerIndex + 1,
      gameSlots: players.map((player, index) => ({ ...player, hand: player.playerId ? playersCards[player.playerId] : [] })),
    };
  }

  private sendoutIncomingActions<T = {}>(payload: ActionTickPayload): Observable<T | void> {
    console.log('Action', payload.action.type);

    if (!(this.externalData.session && this.externalData.game)) {
      return EMPTY;
    }

    const newTick: GameActivityTickLogDTO = {
      ...(payload.tickLog || this.internalData),
      tickTriggeredBy: payload.action,
    };

    switch (payload.action.type) {
      case 'GAME_CREATE':
        return from(this.as.addGameTick(this.externalData.game.id, newTick));
      default:
        return EMPTY;
    }
  }

  private async createGameSlots(players: SessionSlot[]) {
    const playersIds = players.filter((p) => !!p.playerId).map((p) => p.playerId) as string[];
    const usersDetails = await this.firebaseUsers.getUsersByIds(playersIds);
    const gamePlayers: GameSlot[] = players.map((slot) => {
      const user = usersDetails.find((u) => u.id === slot.playerId);
      return {
        order: slot.order,
        playerId: slot.playerId,
        invitedId: slot.invitedId,
        status: slot.status,
        locked: slot.locked,
        playerWithHand: {
          id: slot.playerId,
          displayName: user?.displayName || `Typical Player ${slot.playerId?.substring(0, 5)}`,
          fixedHandSize: 1,
          hand: [],
        },
      } as GameSlot;
    });

    return gamePlayers;
  }

  private getShuffledPlayers(players: GameSlot[]) {
    const shuffled = shuffleCollection(players);
    shuffled.forEach((player, newIndex) => (player.order = newIndex));
    return players;
  }

  private getNewShuffledDeck(players: GameSlot[]) {
    const { cards, deckVariant } = createNewDeck(players);
    const shuffledCards = shuffleCollection<Card>(cards);
    const { playersCards, publicCards, undealt } = drawCards(shuffledCards, players);
    return { deckVariant, playersCards, publicCards, undealt };
  }

  // startNew(dataPair: SessionGameDataPair) {
  //   const { game, session } = dataPair;
  //   const players = game.ticks.at(-1)?.gameSlots;
  //   if (players) {
  //     const shuffledPlayers = this.getShuffledPlayers(players);

  //     this.newRound(game);
  //   }
  // }

  // initGameAndStartRoung(players: PlayerWithHand[]) {
  //   const shuffledPlayers = shuffleCollection(players);

  //   const newSession: AsianPokerGameDTO = {
  //     id: generateDocumentId(),
  //     sessionId: 'TODO',
  //     turnsCounter: 0,
  //     deckVariant: 'standard',
  //     turnCycleCounter: 0,
  //     currentPlayerIndex: 2,
  //     currentDealerIndex: 0,
  //     turnPlayers: [...shuffledPlayers],
  //     gameState: 'ready',
  //     publicCards: [],
  //     playersCalls: [],
  //   };

  //   const { cards, deckVariant } = createNewDeck(newSession.turnPlayers);
  //   const shuffledCards = shuffleCollection<Card>(cards);
  //   const { playersCards, publicCards, undealt } = drawCards(shuffledCards, newSession.turnPlayers);

  //   newSession.deckVariant = deckVariant;
  //   newSession.turnPlayers.forEach((player) => (player.hand = playersCards[player.id]));
  //   newSession.publicCards = publicCards;
  //   this.sessions.set(newSession.id, newSession);

  //     const session = this.sessionGameData.get(sessionId);
  //     if (session) {
  //       session.gameState = 'running';
  //     }

  //   return newSession.id;
  // }

  // play(sessionId: string, action: PlayerTickAction) {
  //   const session = this.sessionGameData.get(sessionId);
  //   if (session) {
  //     const { turnsCounter, turnCycleCounter, currentPlayerIndex, currentDealerIndex } = session;

  //     session.playersCalls.push(action);
  //     session.currentPlayerIndex = currentPlayerIndex + 1;

  //     if (session.currentPlayerIndex === session.turnPlayers.length) {
  //       session.currentPlayerIndex = 0;
  //       session.turnCycleCounter = turnCycleCounter + 1;
  //     }
  //     // session.turnsCounter = turnsCounter + 1;
  //     // session.currentDealerIndex = currentDealerIndex + 1;
  //   }
  // }
}
