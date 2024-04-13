import { Card } from '../card.model';
import { DeckVariant } from '../../related-constants/deck.constant';
import { GameSlot, GameTickAction, PlayerTickAction } from './player-slot.model';

type AsianPokerGameDTO = {
  id: string;
  sessionId: string;
  ticks: GameActivityTickLogDTO[];
  // paused?: boolean;
};

type GameActivityTickLogDTO = {
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

type GameInternalData = Omit<GameActivityTickLogDTO, 'tickTriggeredBy'>;

type TickTriggeringAction = PlayerTickAction | GameTickAction;

export { AsianPokerGameDTO, GameActivityTickLogDTO, GameInternalData, TickTriggeringAction };
