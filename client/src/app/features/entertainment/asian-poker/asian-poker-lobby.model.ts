import { AsianPokerGame } from './asian-poker-game.model';

export type AsianPokerSession = {
  id: string;
  title: string;
  password: string | null;
  hostId: string;
  hostDisplayName: string;
  playersLimit: number;
  accessibility: 'invite' | 'all';
  visibility: 'private' | 'public';
  actionDurationSeconds: number;
  playersJoined: number; // players joined when game started
  playersJoinedIds: string[];
  sessionState: 'setup' | 'in-game' | 'finished';
  gameId: string | null;
  finishResult: {
    cause: 'game-finished' | 'players-cancelled';
  } | null; // 'undefined' means some kind of error;
};

export type AsianPokerSessionForm = Pick<
  AsianPokerSession,
  | 'id'
  | 'title'
  | 'password'
  | 'hostId'
  | 'hostDisplayName'
  | 'playersLimit'
  | 'accessibility'
  | 'visibility'
  | 'actionDurationSeconds'
>;

export type SessionGameData = {
  session: AsianPokerSession;
  game: AsianPokerGame;
};
