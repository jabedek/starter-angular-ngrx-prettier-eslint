import { Component, Input } from '@angular/core';
import { PlayerWithHand } from '../../../../models/game.model';
import { AsianPokerGameDTO } from '@features/entertainment/asian-poker/models/dto';

@Component({
  selector: 'app-playing-table',
  templateUrl: './playing-table.component.html',
  styleUrls: ['./playing-table.component.scss'],
})
export class PlayingTableComponent {
  @Input({ required: true }) currentUser: Partial<PlayerWithHand> | undefined;
  @Input({ required: true }) game: AsianPokerGameDTO | undefined;

  get currentPlayer() {
    if (this.game) {
      return this.game.playersWithHands[this.game.currentPlayerIndex];
    }
    return undefined;
  }

  get currentDealer() {
    if (this.game) {
      return this.game.playersWithHands[this.game.currentDealerIndex];
    }
    return undefined;
  }

  get isCurrentUserMoving() {
    return this.currentPlayer?.nickname === this.currentUser?.nickname || false;
  }

  cardsHidden = false;
}
