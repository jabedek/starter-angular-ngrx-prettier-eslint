import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AsianPokerSession, SessionGameData } from '../../asian-poker-lobby.model';
import { AsianPokerGame } from '../../asian-poker-game.model';
import { AsianPokerService } from '@core/firebase/asian-poker.service';
import { Unsubscribe } from 'firebase/firestore';
import { BaseComponent } from '@shared/abstracts/base/base.component';

@Component({
  selector: 'app-waiting-room-page',
  templateUrl: './waiting-room-page.component.html',
  styleUrls: ['./waiting-room-page.component.scss'],
})
export class WaitingRoomPageComponent extends BaseComponent implements OnDestroy {
  private firebaseUnsubs = new Map<string, Unsubscribe>();

  session: AsianPokerSession | undefined;
  game: AsianPokerGame | undefined;
  constructor(
    private route: ActivatedRoute,
    private ap: AsianPokerService,
  ) {
    super('WaitingRoomPageComponent');

    this.route.data.subscribe((routeData) => {
      const data = routeData.data[0];
      this.session = data;
    });
  }

  override ngOnDestroy(): void {
    this.deleteFirebaseListeners();
  }

  private deleteFirebaseListeners() {
    this.firebaseUnsubs.forEach((unsub, key) => {
      if (unsub) {
        unsub();
      }
      this.firebaseUnsubs.delete(key);
    });
  }

  listenToSessionChanges() {
    if (this.session) {
      this.ap.listenToSessionChanges(this.session.id, (data: AsianPokerSession[] | undefined, unsub: Unsubscribe | undefined) => {
        if (data && unsub) {
          console.log('new changes', data);

          this.firebaseUnsubs.set('listenToSessionChanges', unsub);
          if (data) {
            this.session = data[0];
          }
        }
      });
    }
  }
}
