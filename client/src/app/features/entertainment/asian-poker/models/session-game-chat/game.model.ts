import { Card } from '../card.model';
import { DeckVariant } from '../../constants/deck.constant';
import { GameSlot, GameTickAction, PlayerTickAction } from './player-slot.model';

export type AsianPokerGameDTO = {
  id: string;
  sessionId: string;
  ticks: GameActivityTickLogDTO[];
};

export type GameActivityTickLogDTO = {
  roundInfo: { counter: number; currentDealerIndex: number; deckVariant: DeckVariant | null; publicCards: Card[] };
  cycleInfo: { counter: number; currentPlayerIndex: number; gameSlots: GameSlot[] };
  tickTriggeredBy: TickTriggeringAction;
};

export type TickTriggeringAction = PlayerTickAction | GameTickAction;
