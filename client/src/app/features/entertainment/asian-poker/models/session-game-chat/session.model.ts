import { SessionSlot } from './player-slot.model';
import { SessionStatus } from './session.status.model';

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
