import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AsianPokerSession, SessionGameData } from '../../asian-poker-lobby.model';
import { AsianPokerGame } from '../../asian-poker-game.model';

@Component({
  selector: 'app-setup-page',
  templateUrl: './setup-page.component.html',
  styleUrls: ['./setup-page.component.scss'],
})
export class SetupPageComponent {
  session: AsianPokerSession | undefined;
  game: AsianPokerGame | undefined;
  constructor(private route: ActivatedRoute) {
    this.route.data.subscribe((routeData) => {
      const data = routeData.data as SessionGameData;
      this.session = data.session;
      this.game = data.game;

      if (data) {
        console.log(data);
      }
    });
  }
}
