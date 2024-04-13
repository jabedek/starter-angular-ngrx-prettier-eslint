import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { AsianPokerService } from '@features/entertainment/asian-poker/firebase/asian-poker.service';
import { AsianPokerGameDTO } from '../../models/types/session-game-chat/game.model';
import { AsianPokerSessionDTO } from '../../models/types/session-game-chat/session.model';

export type SessionGameData = {
  session: AsianPokerSessionDTO;
  game: AsianPokerGameDTO;
};

export const sessionsResolver: ResolveFn<AsianPokerSessionDTO[]> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => {
  return inject(AsianPokerService).getSessionsByIds([route.paramMap.get('id')!]);
};

export const sessionGameResolver: ResolveFn<SessionGameData | undefined> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => {
  console.log('sessionGameResolver');

  return inject(AsianPokerService).getSessionAndGame(route.paramMap.get('id')!);
};
