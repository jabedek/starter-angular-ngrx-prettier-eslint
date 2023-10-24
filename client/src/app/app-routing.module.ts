import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'casino',
    canActivate: [],
    loadChildren: () => import('@features/entertainment/casino/casino.module').then((m) => m.CasinoModule),
  },
  {
    path: 'cbbg',
    canActivate: [],
    loadChildren: () => import('@features/entertainment/cbbg/cbbg.module').then((m) => m.CbbgModule),
  },
  {
    path: 'paintchat',
    canActivate: [],
    loadChildren: () => import('@features/entertainment/paintchat/paintchat.module').then((m) => m.PaintchatModule),
  },
  {
    path: 'playlists',
    canActivate: [],
    loadChildren: () => import('@features/entertainment/playlists/playlists.module').then((m) => m.PlaylistsModule),
  },
  { path: 'ago', canActivate: [], loadChildren: () => import('@features/management/ago/ago.module').then((m) => m.AgoModule) },
  {
    path: 'finances',
    canActivate: [],
    loadChildren: () => import('@features/management/finances/finances.module').then((m) => m.FinancesModule),
  },
  {
    path: 'personals',
    canActivate: [],
    loadChildren: () => import('@features/management/personals/personals.module').then((m) => m.PersonalsModule),
  },
  {
    path: 'socialities',
    canActivate: [],
    loadChildren: () => import('@features/management/socialities/socialities.module').then((m) => m.SocialitiesModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
