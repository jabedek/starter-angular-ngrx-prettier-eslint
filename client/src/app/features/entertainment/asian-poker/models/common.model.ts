import { AsianPokerGameDTO } from './session-game-chat/game.model';
import { AsianPokerSessionDTO } from './session-game-chat/session.model';

export type SessionGameIdsPair = {
  sessionId: string;
  gameId: string;
};

export type SessionGameDataPair = {
  session: AsianPokerSessionDTO;
  game: AsianPokerGameDTO;
};
