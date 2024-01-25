import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from '@core/modules/auth/auth.guard';
import { LayoutComponent } from '@core/modules/layout/layout.component';
import { LobbyPageComponent } from './pages/lobby-page/lobby-page.component';
import { GamePageComponent } from './pages/game-page/game-page.component';
import { sessionsResolver, sessionGameResolver } from './pages/game-page/game-session.resolver';
import { WaitingRoomPageComponent } from './pages/waiting-room-page/waiting-room-page.component';

const routes: Routes = [
  {
    path: '',
    // canActivate: [authGuard],
    title: 'Azjatycki Poker',
    children: [
      {
        path: '',
        component: LayoutComponent,
        children: [
          { path: '', pathMatch: 'full', redirectTo: 'lobby' },
          { path: 'lobby', component: LobbyPageComponent },
          { path: 'waiting-room/:id', component: WaitingRoomPageComponent, resolve: { data: sessionsResolver } },
          { path: 'game/:id', component: GamePageComponent, resolve: { data: sessionGameResolver } },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AsianPokerRoutingModule {}
