import { AsianPokerGameDTO } from './game.model';
import { AsianPokerSessionDTO } from './lobby.model';

export type SessionGameIdsPair = {
  sessionId: string;
  gameId: string;
};

export type SessionGameDataPair = {
  session: AsianPokerSessionDTO;
  game: AsianPokerGameDTO;
};
