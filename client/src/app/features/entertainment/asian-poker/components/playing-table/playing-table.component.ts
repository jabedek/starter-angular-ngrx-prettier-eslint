import { Component, Input } from '@angular/core';
import { AsianPokerPlayerInfo, AsianPokerSession } from '../../asian-poker.model';
import { SessionCroupierService } from '../../session-croupier.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-playing-table',
  templateUrl: './playing-table.component.html',
  styleUrls: ['./playing-table.component.scss'],
})
export class PlayingTableComponent {
  @Input({ required: true }) currentUser: Partial<AsianPokerPlayerInfo> | undefined;
  session: AsianPokerSession | undefined;
  @Input({ required: true }) set sessionId(id: string) {
    this._sessionId = id;
    this.session = this.croupier.getSession(id);
  }
  get sessionId() {
    return this._sessionId;
  }
  private _sessionId = '';

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
    console.log(this);

    return this.currentPlayer?.nickname === this.currentUser?.nickname || false;
  }

  cardsHidden = false;

  constructor(private croupier: SessionCroupierService) {}
}
