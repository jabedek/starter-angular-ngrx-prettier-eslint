import { AsianPokerGame } from './asian-poker-game.model';

export type AsianPokerSession = {
  id: string;
  title: string;
  hostId: string;
  hostDisplayName: string;
  playersLimit: number;
  playersJoined: number; // players joined when game started
  playersJoinedIds: string[];
  accessibility: 'invite' | 'all';
  visibility: 'private' | 'public';
  sessionState: 'lobby' | 'playing' | 'finished';
  actionDurationSeconds: number;
  finishResult: {
    cause: 'game-finished' | 'players-cancelled';
  } | null; // 'undefined' means some kind of error;
};

export type AsianPokerSessionForm = Pick<
  AsianPokerSession,
  'id' | 'title' | 'hostId' | 'hostDisplayName' | 'playersLimit' | 'accessibility' | 'visibility' | 'actionDurationSeconds'
>;

export type SessionGameData = {
  session: AsianPokerSession;
  game: AsianPokerGame;
};
