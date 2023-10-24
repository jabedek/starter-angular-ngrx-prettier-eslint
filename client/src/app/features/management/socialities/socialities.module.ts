import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SocialitiesRoutingModule } from './socialities-routing.module';
import { SocialitiesComponent } from './socialities.component';

@NgModule({
  declarations: [SocialitiesComponent],
  imports: [CommonModule, SocialitiesRoutingModule],
})
export class SocialitiesModule {}
