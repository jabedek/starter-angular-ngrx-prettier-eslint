import { AsianPokerGameDTO } from './session-game-chat/game.model';
import { AsianPokerSessionDTO } from './session-game-chat/session.model';

type SessionGameIdsPair = {
  sessionId: string;
  gameId: string;
};

type SessionGameDataPair = {
  session: AsianPokerSessionDTO | undefined;
  game: AsianPokerGameDTO | undefined;
};

export { SessionGameIdsPair, SessionGameDataPair };
