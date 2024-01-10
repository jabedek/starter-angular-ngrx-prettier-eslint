import { Component, Input, OnInit } from '@angular/core';
import { AsianPokerPlayerInfo, AsianPokerGame, PlayerActions } from '../../../../asian-poker-game.model';
import { SessionCroupierService } from '../../../../services/session-croupier.service';

@Component({
  selector: 'app-player-gui',
  templateUrl: './player-gui.component.html',
  styleUrls: ['./player-gui.component.scss'],
})
export class PlayerGuiComponent {
  @Input({ required: true }) currentUser: Partial<AsianPokerPlayerInfo> | undefined;
  session: AsianPokerGame | undefined;
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
    return this.session?.turnPlayers[this.session.currentPlayerIndex]?.nickname === this.currentUser?.nickname || false;
  }

  get isCurrentUserDealer() {
    return this.session?.turnPlayers[this.session.currentDealerIndex]?.nickname === this.currentUser?.nickname || false;
  }

  constructor(private croupier: SessionCroupierService) {}

  startTurn() {
    this.croupier.startTurn(this.sessionId);
  }

  call() {
    if (this.session && this.currentPlayer) {
      this.croupier.play(this.sessionId, {
        type: PlayerActions.PLAY_CALL,
        data: {
          playerId: this.currentPlayer?.id || '',
          playerIndex: this.session?.currentPlayerIndex,
          turnCycleIndex: this.session?.turnCycleCounter,
          calledCardSet: undefined,
        },
      });
    }
  }

  check() {
    if (this.session && this.currentPlayer) {
      this.croupier.play(this.sessionId, {
        type: PlayerActions.PLAY_CHECK,
        data: {
          playerId: this.currentPlayer?.id || '',
          playerIndex: this.session?.currentPlayerIndex,
          turnCycleIndex: this.session?.turnCycleCounter,
        },
      });
    }
  }
}
