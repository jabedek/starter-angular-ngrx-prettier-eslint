import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StoreModule } from '@ngrx/store';
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

export const Features = [
  AgoModule,
  CasinoModule,
  CbbgModule,
  FinancesModule,
  PaintchatModule,
  PersonalsModule,
  PlaylistsModule,
  SocialitiesModule,
];

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    RouterModule,
    StoreModule.forRoot({}, {}),
    CoreModule,
    SharedModule,
    ...Features,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
