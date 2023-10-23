import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'ago', canActivate: [], loadChildren: () => import('@features/ago/ago.module').then((m) => m.AgoModule) },
  { path: 'casino', canActivate: [], loadChildren: () => import('@features/casino/casino.module').then((m) => m.CasinoModule) },
  { path: 'cbbg', canActivate: [], loadChildren: () => import('@features/cbbg/cbbg.module').then((m) => m.CbbgModule) },
  {
    path: 'finances',
    canActivate: [],
    loadChildren: () => import('@features/finances/finances.module').then((m) => m.FinancesModule),
  },
  {
    path: 'paintchat',
    canActivate: [],
    loadChildren: () => import('@features/paintchat/paintchat.module').then((m) => m.PaintchatModule),
  },
  {
    path: 'personals',
    canActivate: [],
    loadChildren: () => import('@features/personals/personals.module').then((m) => m.PersonalsModule),
  },
  {
    path: 'playlists',
    canActivate: [],
    loadChildren: () => import('@features/playlists/playlists.module').then((m) => m.PlaylistsModule),
  },
  {
    path: 'socialities',
    canActivate: [],
    loadChildren: () => import('@features/socialities/socialities.module').then((m) => m.SocialitiesModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
