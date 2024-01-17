import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { AsianPokerSession, SessionGameData } from '../../asian-poker-lobby.model';
import { inject } from '@angular/core';
import { AsianPokerService } from '@core/firebase/asian-poker.service';
import { Observable } from 'rxjs';
import { AsianPokerGame } from '../../asian-poker-game.model';

export const sessionsResolver: ResolveFn<AsianPokerSession[]> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  return inject(AsianPokerService).getSessions([route.paramMap.get('id')!]);
};

export const sessionGameResolver: ResolveFn<SessionGameData | undefined> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => {
  return inject(AsianPokerService).getSessionGame(route.paramMap.get('id')!);
};
