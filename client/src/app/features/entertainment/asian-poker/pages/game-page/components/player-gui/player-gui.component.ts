import { Component, Input } from '@angular/core';
import { AsianPokerSessionDTO } from '@features/entertainment/asian-poker/models';
import { SessionGameDataPair } from '@features/entertainment/asian-poker/models/types/common.model';
import {
  AsianPokerGameDTO,
  GameInternalData,
} from '@features/entertainment/asian-poker/models/types/session-game-chat/game.model';
import { PlayerWithHand } from '@features/entertainment/asian-poker/models/types/session-game-chat/player-slot.model';
import { GameManagerService } from '@features/entertainment/asian-poker/services/game-manager.service';

@Component({
  selector: 'app-player-gui',
  templateUrl: './player-gui.component.html',
  styleUrls: ['./player-gui.component.scss'],
})
export class PlayerGuiComponent {
  @Input() session?: AsianPokerSessionDTO;
  @Input() game?: AsianPokerGameDTO;
  @Input({ required: true }) currentUser: Partial<PlayerWithHand> | undefined;
  @Input() gameInternalDataSnapshot: GameInternalData | null = null;

  get gameLastTick() {
    return this.game?.ticks.at(-1);
  }

  get currentDealerIndex() {
    return this.gameLastTick?.roundInfo?.currentDealerIndex || 0;
  }

  get currentPlayerIndex() {
    return this.gameLastTick?.cycleInfo?.currentPlayerIndex || 0;
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

  get isCurrentUserDealer() {
    return this.currentDealer?.playerWithHand.displayName === this.currentUser?.displayName || false;
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

  constructor(private manager: GameManagerService) {}

  startFirstRound() {
    this.manager.setupNextRoundAndStart();
  }

  call() {
    // if (this.session && this.currentPlayer) {
    // this.croupier.play(this.sessionId, {
    //   type: PlayerTickActions.PLAY_CALL,
    //   data: {
    //     playerId: this.currentPlayer?.id || '',
    //     playerIndex: this.session?.currentPlayerIndex,
    //     cycleId: this.session?.turnCycleCounter,
    //     roundId: this.session?.turnCycleCounter,
    //     calledCardSet: undefined,
    //   },
    // });
    // }
  }

  check() {
    // if (this.session && this.currentPlayer) {
    // this.croupier.play(this.sessionId, {
    //   type: PlayerTickActions.PLAY_CHECK,
    //   data: {
    //     playerId: this.currentPlayer?.id || '',
    //     playerIndex: this.session?.currentPlayerIndex,
    //     cycleId: this.session?.turnCycleCounter,
    //     roundId: this.session?.turnCycleCounter,
    //   },
    // });
    // }
  }
}
