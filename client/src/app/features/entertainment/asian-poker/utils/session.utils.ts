import { AsianPokerSessionDTO } from '../models/dto';

export function computePlayersAmount(session: AsianPokerSessionDTO): number {
  return session.sessionActivity.playersSlots.filter((slot) => slot.status !== 'empty' && slot.playerId).length;
}
