import { Component, Input } from '@angular/core';
import { AsianPokerPlayerInfo, AsianPokerSession } from '../../asian-poker.model';

@Component({
  selector: 'app-playing-table',
  templateUrl: './playing-table.component.html',
  styleUrls: ['./playing-table.component.scss'],
})
export class PlayingTableComponent {
  @Input({ required: true }) session: AsianPokerSession | undefined;
  @Input({ required: true }) currentUser: Partial<AsianPokerPlayerInfo> | undefined;

  get players() {
    return this.session?.turnPlayers || [];
  }

  get currentPlayerIndex() {
    return this.session?.currentPlayerIndex === undefined ? -1 : this.session?.currentPlayerIndex;
  }

  get currentDealerIndex() {
    return this.session?.currentDealerIndex === undefined ? -1 : this.session?.currentDealerIndex;
  }

  cardsHidden = false;
}
