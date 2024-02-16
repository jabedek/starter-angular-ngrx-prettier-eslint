import { UserAppAccount } from '@store/auth/auth.state';
import { Flatten } from 'frotsi';
import { PlayerWithHand } from './game.model';

export type AsianPokerSessionSettings = {
  title: string;
  password: string | null;
  playersLimit: number;
  accessibility: SessionAccessibility;
  visibility: SessionVisibility;
  actionDurationSeconds: number;
};

export type AsianPokerSessionActivity = {
  hostId: string;
  hostDisplayName: string;
  playersSlots: SessionPlayerSlot[];
  playersJoinedAmount: number;
  invitations: SessionInvitation[];
  sessionState: SessionState;
  finishResult: {
    cause: SessionResult;
  } | null; // 'undefined' means some kind of error;
};

export type SessionVisibility = 'private' | 'public';
export type SessionAccessibility = 'invite' | 'all';
export type SessionState = 'setup' | 'in-game' | 'finished';
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
export type SessionPlayerSlot = {
  order: number;
  playerId: string | null;
  invitedId: string | null;
  status: SessionSlotStatus;
  locked: boolean;
};

export type WaitingSlot = Flatten<SessionPlayerSlot & { user?: UserAppAccount | null }>;
export type GameSlot = Flatten<SessionPlayerSlot & { playerWithHand?: PlayerWithHand }>;
