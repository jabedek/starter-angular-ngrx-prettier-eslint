import { Card } from '../card.model';
import { DeckVariant } from '../../constants/deck.constant';
import { GameSlot, GameTickAction, PlayerTickAction } from './player-slot.model';

export type AsianPokerGameDTO = {
  id: string;
  sessionId: string;
  ticks: GameActivityTickLogDTO[];
  // paused?: boolean;
};

export type GameActivityTickLogDTO = {
  roundInfo: {
    counter: number;
    currentDealerIndex: number;
    deckVariant: DeckVariant | null;
    publicCards: Card[];
    // paused?: boolean;
  };
  cycleInfo: {
    counter: number;
    currentPlayerIndex: number;
    gameSlots: GameSlot[];
    //  paused?: boolean
  };
  tickTriggeredBy: TickTriggeringAction;
};

export type GameInternalData = Omit<GameActivityTickLogDTO, 'tickTriggeredBy'>;

export type TickTriggeringAction = PlayerTickAction | GameTickAction;
