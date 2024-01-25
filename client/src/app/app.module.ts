import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { CoreModule } from '@core/core.module';
import { SharedModule } from '@shared/shared.module';

import { RouterModule } from '@angular/router';
import { AgoModule } from '@features/management/ago/ago.module';
import { CasinoModule } from '@features/entertainment/casino/casino.module';
import { CbbgModule } from '@features/entertainment/cbbg/cbbg.module';
import { FinancesModule } from '@features/management/finances/finances.module';
import { PaintchatModule } from '@features/entertainment/paintchat/paintchat.module';
import { PersonalsModule } from '@features/management/personals/personals.module';
import { PlaylistsModule } from '@features/entertainment/playlists/playlists.module';
import { SocialitiesModule } from '@features/management/socialities/socialities.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StoreRouterConnectingModule, routerReducer as router } from '@ngrx/router-store';
import { EffectsModule } from '@ngrx/effects';

import { extModules } from '@env/build-specifics';
import { environment } from '@env/environment';
import { metaReducers } from '@store/meta-reducers';
import { featureState as layout } from '@store/layout/layout.reducer';
import { featureState as auth } from '@store/auth/auth.reducer';
import { CustomSerializer } from '@store/router/custom-route-serializer';
import { AsianPokerModule } from '@features/entertainment/asian-poker/asian-poker.module';
import { StreamingStudioModule } from '@features/entertainment/streaming-studio/streaming-studio.module';
import { DecisionTreeModule } from '@features/misc/decision-tree/decision-tree.module';
import { WeatherArchiveModule } from '@features/misc/weather-archive/weather-archive.module';
import { Lang } from '@shared/models/enums';
import { FoodAndGroceriesModule } from '@features/misc/food-and-groceries/food-and-groceries.module';

if (environment.environmentName === 'production') {
  console.log = () => ({});
} else {
  const ports = ['4200', '4201'];
  if (!ports.includes(`${window.location.port}`)) {
    console.error(
      `[${environment.environmentName}] Wrong port. Use only these ports: ` +
        ports.join(', ') +
        '. Otherwise external services like Auth0 may not work.',
    );
  }
}

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

export const Features = [
  // Entertainment
  AsianPokerModule,
  CasinoModule,
  CbbgModule,
  PaintchatModule,
  PlaylistsModule,
  StreamingStudioModule,
  // Management
  AgoModule,
  FinancesModule,
  PersonalsModule,
  SocialitiesModule,
  // Misc
  DecisionTreeModule,
  FoodAndGroceriesModule,
  WeatherArchiveModule,
];

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
      defaultLanguage: Lang.pl,
    }),
    //
    AppRoutingModule,
    //
    StoreModule.forRoot({ router, layout, auth }, { metaReducers }),
    StoreRouterConnectingModule.forRoot({ serializer: CustomSerializer }),
    EffectsModule.forRoot([]),
    // App
    CoreModule,
    SharedModule,
    ...Features,
    extModules,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
