import { Component, Input, OnInit } from '@angular/core';
import { AsianPokerPlayerInfo, AsianPokerSession, GameState, HandsWithHierarchy, PlayerActions } from '../../asian-poker.model';
import { SessionCroupierService } from '../../session-croupier.service';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-player-gui',
  templateUrl: './player-gui.component.html',
  styleUrls: ['./player-gui.component.scss'],
})
export class PlayerGuiComponent implements OnInit {
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
    return this.session?.turnPlayers[this.session.currentPlayerIndex]?.nickname === this.currentUser?.nickname || false;
  }

  get isCurrentUserDealer() {
    return this.session?.turnPlayers[this.session.currentDealerIndex]?.nickname === this.currentUser?.nickname || false;
  }

  constructor(private croupier: SessionCroupierService) {}

  ngOnInit(): void {
    // console.log(this.session);
  }

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
          calledCardSet: { kind: HandsWithHierarchy[0], cards: [this.currentPlayer?.hand[0]] },
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
