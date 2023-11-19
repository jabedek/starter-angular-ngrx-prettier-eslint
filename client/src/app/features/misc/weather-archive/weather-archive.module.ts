import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WeatherArchiveRoutingModule } from './weather-archive-routing.module';
import { WeatherArchiveComponent } from './weather-archive.component';


@NgModule({
  declarations: [
    WeatherArchiveComponent
  ],
  imports: [
    CommonModule,
    WeatherArchiveRoutingModule
  ]
})
export class WeatherArchiveModule { }
