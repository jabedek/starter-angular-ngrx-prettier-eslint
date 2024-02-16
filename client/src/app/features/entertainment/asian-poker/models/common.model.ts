import { AsianPokerSessionDTO, AsianPokerGameDTO } from './dto';

export type SessionGameIdsPair = {
  sessionId: string;
  gameId: string;
};

export type SessionGameDataPair = {
  session: AsianPokerSessionDTO;
  game: AsianPokerGameDTO;
};
