import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from '@core/modules/layout/pages/landing-page/landing-page.component';
import { LayoutComponent } from '@core/modules/layout/layout.component';
import { HomePageComponent } from '@core/modules/layout/components/home-page/home-page.component';
import { authGuard } from '@core/modules/auth/auth.guard';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  {
    path: 'home',
    // pathMatch: 'full',
    children: [
      {
        path: '',
        component: LayoutComponent,
        children: [{ path: '', component: HomePageComponent }],
      },
    ],
  },
  {
    path: 'account',
    canActivate: [authGuard()],
    loadChildren: () => import('@core/modules/account/account.module').then((m) => m.AccountModule),
  },
  {
    path: 'asian-poker',
    // canActivate: [authGuard('asian-poker')],
    loadChildren: () => import('@features/entertainment/asian-poker/asian-poker.module').then((m) => m.AsianPokerModule),
  },
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
  {
    path: 'streaming-studio',
    canActivate: [],
    loadChildren: () =>
      import('@features/entertainment/streaming-studio/streaming-studio.module').then((m) => m.StreamingStudioModule),
  },
  {
    path: 'decision-tree',
    canActivate: [],
    loadChildren: () => import('@features/misc/decision-tree/decision-tree.module').then((m) => m.DecisionTreeModule),
  },
  {
    path: 'food-and-groceries',
    canActivate: [],
    loadChildren: () =>
      import('@features/misc/food-and-groceries/food-and-groceries.module').then((m) => m.FoodAndGroceriesModule),
  },
  {
    path: 'weather-archive',
    canActivate: [],
    loadChildren: () => import('@features/misc/weather-archive/weather-archive.module').then((m) => m.WeatherArchiveModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
