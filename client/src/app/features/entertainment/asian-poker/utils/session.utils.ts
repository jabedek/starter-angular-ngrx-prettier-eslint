import { AsianPokerSessionDTO } from '../models/types/session-game-chat/session.model';

export function computePlayersAmount(session: AsianPokerSessionDTO): number {
  return session.activity.playersSlots.filter((slot) => slot.status !== 'empty' && slot.playerId).length;
}
