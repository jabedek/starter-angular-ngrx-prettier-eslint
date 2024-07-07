import { UserAppAccount } from '@store/auth/auth.state';
import { Flatten } from 'frotsi';
import { SessionSlotStatus } from './session-game-chat/session.model';
import { Card } from './card.model';

type SessionSlot = {
  order: number;
  playerId: string | null;
  invitedId: string | null;
  status: SessionSlotStatus;
  locked: boolean;
  user?: UserAppAccount | null;
};

type GameSlot = Flatten<Omit<SessionSlot, 'user'> & { playerWithHand: PlayerWithHand }>;

class PlayerWithHand {
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

enum PlayerTickActions {
  PLAY_CALL = 'PLAY_CALL',
  PLAY_CHECK = 'PLAY_CHECK',
  PAUSE_PROPOSE = 'PAUSE_PROPOSE',
  PAUSE_VOTE = 'PAUSE_VOTE',
}

type PlayerTickAction =
  | {
      type: PlayerTickActions.PLAY_CALL;
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
      type: PlayerTickActions.PLAY_CHECK;
      atMS: number;
      data: {
        roundId: number;
        cycleId: number;
        playerId: string;
        playerIndex: number;
      };
    }
  | {
      type: PlayerTickActions.PAUSE_PROPOSE;
      atMS: number;
      data: {
        proposerId: string;
        roundId: number;
        cycleId: number;
      };
      lengthMS: number;
    }
  | {
      type: PlayerTickActions.PAUSE_VOTE;
      atMS: number;
      data: {
        proposerId: string;
        roundId: number;
        cycleId: number;
      };
      decision: boolean;
    };

enum GameTickActions {
  GAME_CREATE = 'GAME_CREATE',
  GAME_START = 'GAME_START',
  GAME_PAUSE = 'GAME_PAUSE',
  GAME_RESUME = 'GAME_RESUME',
  GAME_END = 'GAME_END',
}

type GameTickAction =
  | {
      type: GameTickActions.GAME_CREATE;
      atMS: number;
    }
  | {
      type: GameTickActions.GAME_START;
      atMS: number;
    }
  | {
      type: GameTickActions.GAME_PAUSE;
      atMS: number;
      data: {
        proposerId: string;
        startAtMS: number;
        lengthMS: number;
      };
    }
  | {
      type: GameTickActions.GAME_RESUME;
      atMS: number;
    }
  | {
      type: GameTickActions.GAME_END;
      atMS: number;
    };

export { GameSlot, PlayerTickAction, PlayerTickActions, GameTickActions, GameTickAction, PlayerWithHand, SessionSlot };
