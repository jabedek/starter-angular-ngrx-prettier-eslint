import { Component, Input } from '@angular/core';
import { AsianPokerPlayerInfo, AsianPokerGame } from '../../../../asian-poker-game.model';
import { SessionCroupierService } from '../../../../services/session-croupier.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-playing-table',
  templateUrl: './playing-table.component.html',
  styleUrls: ['./playing-table.component.scss'],
})
export class PlayingTableComponent {
  @Input({ required: true }) currentUser: Partial<AsianPokerPlayerInfo> | undefined;
  @Input({ required: true }) session: AsianPokerGame | undefined;

  get currentPlayer() {
    if (this.session) {
      return this.session.turnPlayers[this.session.currentPlayerIndex];
    }
    return undefined;
  }

  get currentDealer() {
    if (this.session) {
      return this.session.turnPlayers[this.session.currentDealerIndex];
    }
    return undefined;
  }

  get isCurrentUserMoving() {
    return this.currentPlayer?.nickname === this.currentUser?.nickname || false;
  }

  cardsHidden = false;

  constructor(private croupier: SessionCroupierService) {}
}
