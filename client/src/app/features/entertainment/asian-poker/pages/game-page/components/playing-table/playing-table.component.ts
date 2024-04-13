import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { AsianPokerSessionDTO } from '@features/entertainment/asian-poker/models';
import { SessionGameDataPair } from '@features/entertainment/asian-poker/models/types/common.model';
import {
  AsianPokerGameDTO,
  GameInternalData,
} from '@features/entertainment/asian-poker/models/types/session-game-chat/game.model';
import { UserAppAccount } from '@store/auth/auth.state';

@Component({
  selector: 'app-playing-table',
  templateUrl: './playing-table.component.html',
  styleUrls: ['./playing-table.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayingTableComponent {
  @Input() session?: AsianPokerSessionDTO;
  @Input() game?: AsianPokerGameDTO;

  @Input({ required: true }) set currentUser(currentUser: UserAppAccount | undefined) {
    console.log('##', currentUser);

    this._currentUser = currentUser;
  }
  get currentUser(): UserAppAccount | undefined {
    return this._currentUser;
  }

  private _currentUser: UserAppAccount | undefined;

  @Input() gameInternalDataSnapshot: GameInternalData | null = null;

  get gameLastTick() {
    return this.game?.ticks.at(-1);
  }

  get currentPlayerIndex() {
    return this.gameLastTick?.cycleInfo?.currentPlayerIndex || 0;
  }

  get currentDealerIndex() {
    return this.gameLastTick?.roundInfo?.currentDealerIndex || 0;
  }

  get currentPlayer() {
    if (this.gameLastTick) {
      return this.gameLastTick.cycleInfo?.gameSlots[this.currentPlayerIndex];
    }
    return undefined;
  }

  get currentDealer() {
    if (this.gameLastTick) {
      return this.gameLastTick.cycleInfo?.gameSlots[this.currentDealerIndex];
    }
    return undefined;
  }

  get isCurrentUserMoving() {
    return this.currentPlayer?.playerWithHand.displayName === this.currentUser?.displayName || false;
  }

  get publicCards() {
    return this.gameLastTick?.roundInfo?.publicCards || [];
  }

  get turnPlayers() {
    return this.gameLastTick?.cycleInfo?.gameSlots || [];
  }

  cardsHidden = false;
}
