import { Card } from './card.model';
import { DeckVariant } from '../constants/deck.constant';

export type GameState = 'just-started' | 'running' | 'paused' | 'finished';

export type GamePauseInfo = {
  proposerId: string;
  startAtMS: number;
  lengthMS: number;
  success: boolean;
};

export class PlayerWithHand {
  id: string;
  nickname: string;
  fixedHandSize = 1;
  hand: Card[] = [];

  constructor(id: string, nickname: string, fixedHandSize = 1) {
    this.id = id;
    this.nickname = nickname;
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
      data: {
        roundId: number;
        cycleId: number;
        playerId: string;
        playerIndex: number;
      };
    }
  | {
      type: PlayerActions.PAUSE_PROPOSE;
      data: {
        proposerId: string;
        roundId: number;
        cycleId: number;
      };
      lengthMS: number;
    }
  | {
      type: PlayerActions.PAUSE_VOTE;
      data: {
        proposerId: string;
        roundId: number;
        cycleId: number;
      };
      decision: boolean;
    };
