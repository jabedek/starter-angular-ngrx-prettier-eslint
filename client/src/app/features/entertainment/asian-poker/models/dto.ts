// updated on every Player action

import { DeckVariant } from '../constants/deck.constant';
import { Card } from './card.model';
import { GameState, GamePauseInfo, PlayerWithHand, PlayerAction } from './game.model';
import { AsianPokerSessionSettings, AsianPokerSessionActivity } from './lobby.model';

export type AsianPokerSessionDTO = {
  id: string;
  gameId: string | null;
  sessionSettings: AsianPokerSessionSettings;
  sessionActivity: AsianPokerSessionActivity;
};

export type AsianPokerGameDTO = {
  id: string;
  sessionId: string;

  gameState: GameState;
  pausesInfo: GamePauseInfo[];

  roundCounter: number;
  cycleCounter: number;

  currentPlayerIndex: number;
  currentDealerIndex: number;

  deckVariant: DeckVariant;
  publicCards: Card[];
  playersWithHands: PlayerWithHand[];
  playersActions: PlayerAction[];
};
