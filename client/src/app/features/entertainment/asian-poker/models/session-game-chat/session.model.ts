import { SessionSlot } from './player-slot.model';

export type AsianPokerSessionDTO = {
  id: string;
  sessionSettings: AsianPokerSessionSettings;
  sessionActivity: AsianPokerSessionActivity;
  gameId: string;
  chatId: string;
};

export type AsianPokerSessionSettings = {
  title: string;
  password: string | null;
  playersLimit: number;
  accessibility: SessionAccessibility;
  visibility: SessionVisibility;
  actionDurationSeconds: number;
  spectatorsAllowed: boolean;
};

export type AsianPokerSessionActivity = {
  hostId: string;
  hostDisplayName: string;
  playersSlots: SessionSlot[];
  playersJoinedAmount: number;
  invitations: SessionInvitation[];
  status: SessionStatus;
  finishResult: {
    cause: SessionResult;
  } | null; // 'undefined' means some kind of error;
};

export type SessionVisibility = 'private' | 'public';
export type SessionAccessibility = 'invite' | 'all';

/**
 * 'session-started' - session was just opened, at lobby page
 * 'game-created' - session's game was just started, session is moving to the game page and the game is being initialized
 * 'running' - game was initalized and is running in game page, players are making their moves
 * 'paused' - game was paused, session is in game page
 * 'finished' - game was finished, session gathered last informations about the game
 */

export type SessionStatus = 'session-started' | 'game-created' | 'running' | 'paused' | 'finished';

export type SessionSlotStatus = 'empty' | 'occupied' | 'invited' | 'disconnected';
export type SessionResult = 'game-finished' | 'players-cancelled';
export type SessionInvitation = {
  id: string;
  sessionId: string;
  invitedId: string;
  hostId: string;
  hostDisplayName: string;
  active: boolean;
  seen: boolean;
  accepted: boolean;
  slotOrder: number;
  additionalText: string;
};
