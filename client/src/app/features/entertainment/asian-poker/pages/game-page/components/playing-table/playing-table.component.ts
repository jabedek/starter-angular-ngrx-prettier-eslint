import { Component, Input } from '@angular/core';
import { PlayerWithHand } from '../../../../models/game.model';
import { SessionGameDataPair } from '@features/entertainment/asian-poker/models/common.model';

@Component({
  selector: 'app-playing-table',
  templateUrl: './playing-table.component.html',
  styleUrls: ['./playing-table.component.scss'],
})
export class PlayingTableComponent {
  @Input({ required: true }) currentUser: Partial<PlayerWithHand> | undefined;
  @Input({ required: true }) data: SessionGameDataPair | undefined;

  get gameLastTick() {
    return this.data?.game?.ticks.at(-1);
  }

  get currentPlayerIndex() {
    return this.gameLastTick?.currentPlayerIndex || 0;
  }

  get currentDealerIndex() {
    return this.gameLastTick?.currentDealerIndex || 0;
  }

  get currentPlayer() {
    if (this.gameLastTick) {
      return this.gameLastTick.playersWithHands[this.currentPlayerIndex];
    }
    return undefined;
  }

  get currentDealer() {
    if (this.gameLastTick) {
      return this.gameLastTick.playersWithHands[this.currentDealerIndex];
    }
    return undefined;
  }

  get isCurrentUserMoving() {
    return this.currentPlayer?.displayName === this.currentUser?.displayName || false;
  }

  get publicCards() {
    return this.gameLastTick?.publicCards || [];
  }

  get turnPlayers() {
    return this.gameLastTick?.playersWithHands || [];
  }

  cardsHidden = false;
}
