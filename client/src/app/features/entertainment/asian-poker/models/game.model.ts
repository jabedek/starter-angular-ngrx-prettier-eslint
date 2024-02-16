import { Card } from './card.model';
import { DeckVariant } from '../constants/deck.constant';

export type GameActivityTickLogDTO = {
  roundCounter: number;
  cycleCounter: number;

  currentPlayerIndex: number;
  currentDealerIndex: number;

  deckVariant: DeckVariant | null;
  publicCards: Card[];
  playersWithHands: PlayerWithHand[];
  playersActions: PlayerAction[];

  sentAtMS: number;
  gameState: GameState;
  pausesInfo: GamePauseInfo[];
};

export type GameState = 'just-created' | 'just-started' | 'running' | 'paused' | 'finished';

export type GamePauseInfo = {
  proposerId: string;
  startAtMS: number;
  lengthMS: number;
  success: boolean;
};

export class PlayerWithHand {
  id: string;
  displayName: string;
  fixedHandSize = 1;
  hand: Card[] = [];

  constructor(id: string, displayName: string, fixedHandSize = 1) {
    this.id = id;
    this.displayName = displayName;
    this.fixedHandSize = fixedHandSize;
  }
}

export enum PlayerActions {
  PLAY_CALL = 'PLAY_CALL',
  PLAY_CHECK = 'PLAY_CHECK',
  PAUSE_PROPOSE = 'PAUSE_PROPOSE',
  PAUSE_VOTE = 'PAUSE_VOTE',
}

export type PlayerAction =
  | {
      type: PlayerActions.PLAY_CALL;
      atMS: number;
      data: {
        roundId: number;
        cycleId: number;
        playerId: string;
        playerIndex: number;
        calledCardSet: any;
      };
    }
  | {
      type: PlayerActions.PLAY_CHECK;
      atMS: number;
      data: {
        roundId: number;
        cycleId: number;
        playerId: string;
        playerIndex: number;
      };
    }
  | {
      type: PlayerActions.PAUSE_PROPOSE;
      atMS: number;
      data: {
        proposerId: string;
        roundId: number;
        cycleId: number;
      };
      lengthMS: number;
    }
  | {
      type: PlayerActions.PAUSE_VOTE;
      atMS: number;
      data: {
        proposerId: string;
        roundId: number;
        cycleId: number;
      };
      decision: boolean;
    };
