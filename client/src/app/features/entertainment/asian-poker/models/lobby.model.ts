export type AsianPokerSessionSettings = {
  title: string;
  password: string | null;
  hostId: string;
  hostDisplayName: string;
  playersLimit: number;
  accessibility: SessionAccessibility;
  visibility: SessionVisibility;
  actionDurationSeconds: number;
};

export type AsianPokerSessionActivity = {
  playersJoined: number; // players joined when game started
  playersJoinedIds: string[];
  sessionState: SessionState;
  finishResult: {
    cause: SessionResult;
  } | null; // 'undefined' means some kind of error;
};

export type SessionVisibility = 'private' | 'public';
export type SessionAccessibility = 'invite' | 'all';
export type SessionState = 'setup' | 'in-game' | 'finished';
export type SessionResult = 'game-finished' | 'players-cancelled';
