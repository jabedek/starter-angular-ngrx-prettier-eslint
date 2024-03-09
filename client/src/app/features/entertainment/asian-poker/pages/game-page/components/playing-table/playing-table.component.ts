import { Component, Input } from '@angular/core';
import { SessionGameDataPair } from '@features/entertainment/asian-poker/models/common.model';
import { UserAppAccount } from '@store/auth/auth.state';

@Component({
  selector: 'app-playing-table',
  templateUrl: './playing-table.component.html',
  styleUrls: ['./playing-table.component.scss'],
})
export class PlayingTableComponent {
  @Input({ required: true }) currentUser: UserAppAccount | undefined;
  @Input({ required: true }) data: SessionGameDataPair | undefined;

  get gameLastTick() {
    return this.data?.game?.ticks.at(-1);
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
