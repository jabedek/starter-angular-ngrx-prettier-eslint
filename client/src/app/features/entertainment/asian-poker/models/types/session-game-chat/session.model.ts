import { SessionSlot } from './player-slot.model';
import { SessionStatus } from './session.status.model';

type AsianPokerSessionDTO = {
  id: string;
  sessionSettings: AsianPokerSessionSettings;
  sessionActivity: AsianPokerSessionActivity;
  gameId: string;
  chatId: string;
};

type AsianPokerSessionSettings = {
  title: string;
  password: string | null;
  playersLimit: number;
  accessibility: SessionAccessibility;
  visibility: SessionVisibility;
  actionDurationSeconds: number;
  spectatorsAllowed: boolean;
};

type AsianPokerSessionActivity = {
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

type SessionVisibility = 'private' | 'public';
type SessionAccessibility = 'invite' | 'all';

type SessionSlotStatus = 'empty' | 'occupied' | 'invited' | 'disconnected';
type SessionResult = 'game-finished' | 'players-cancelled';
type SessionInvitation = {
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

export {
  AsianPokerSessionDTO,
  AsianPokerSessionSettings,
  AsianPokerSessionActivity,
  SessionVisibility,
  SessionAccessibility,
  SessionSlotStatus,
  SessionResult,
  SessionInvitation,
};
