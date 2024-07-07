import { SessionSlot } from '../player-slot.model';
import { SessionStatus } from './session.status.model';

export type AsianPokerSessionDTO = {
  metadata: SessionMetadata;
  title: string;
  restrictions: SessionRestrictions;
  accessibility: SessionAccessibility;
  activity: SessionActivity;
};

export type SessionMetadata = { id: string; gameId: string; chatId: string };

export type SessionRestrictions = {
  playersLimit: number;
  actionDurationSeconds: number;
  spectatorsAllowed: boolean;
};

export type SessionAccessibility = {
  password: string | null;
  inviteNeeded: boolean;
  listability: SessionListVisibility;
};

export type SessionActivity = {
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

export type SessionListVisibility = 'private' | 'public';
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
