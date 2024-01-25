import { Card } from './models/card.model';
import { DeckVariant } from './models/deck.model';

export type GameState = 'started' | 'ready' | 'running' | 'paused' | 'finished';

export type AsianPokerGame = {
  id: string;
  sessionId: string;
  gameState: GameState;
  deckVariant: DeckVariant;
  turnsCounter: number;
  turnCycleCounter: number;
  turnPlayers: AsianPokerPlayerInfo[];
  currentPlayerIndex: number;
  currentDealerIndex: number;
  publicCards: Card[];
  playersCalls: PlayAction[];
};

interface AsianPokerPlayer {
  id: string;
  nickname: string;
  handSize: number;
  hand: Card[];
}

export class AsianPokerPlayerInfo implements AsianPokerPlayer {
  id: string;
  nickname: string;
  handSize = 1;
  hand: Card[] = [];

  constructor(id: string, nickname: string, handSize = 1) {
    this.id = id;
    this.nickname = nickname;
    this.handSize = handSize;
  }
}

export enum PlayerActions {
  SESSION_START = 'SESSION_START',
  PLAY_CALL = 'PLAY_CALL',
  PLAY_CHECK = 'PLAY_CHECK',
  PAUSE_PROPOSE = 'PAUSE_PROPOSE',
  PAUSE_VOTE_YES = 'PAUSE_VOTE_YES',
  PAUSE_VOTE_NO = 'PAUSE_VOTE_NO',
}

export type PlayAction =
  | {
      type: PlayerActions.PLAY_CALL;
      data: {
        turnCycleIndex: number;
        playerId: string;
        playerIndex: number;
        calledCardSet: any;
      };
    }
  | {
      type: PlayerActions.PLAY_CHECK;
      data: {
        turnCycleIndex: number;
        playerId: string;
        playerIndex: number;
      };
    };
