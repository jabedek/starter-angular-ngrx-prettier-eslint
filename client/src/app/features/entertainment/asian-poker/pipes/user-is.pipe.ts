import { Pipe, PipeTransform, inject } from '@angular/core';
import { SessionGameListenerService, UserPlayerCheck } from '../services/session-game-listener.service';

@Pipe({
  name: 'userIs',
})
export class UserIsPipe implements PipeTransform {
  listener = inject(SessionGameListenerService);

  transform(playerId: string | undefined, args: UserPlayerCheck[]): unknown {
    return this.listener.checkIfUser(playerId, args);
  }
}
