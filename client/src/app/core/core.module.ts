import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthModule } from './modules/auth/auth.module';
import { LayoutModule } from './modules/layout/layout.module';

@NgModule({
  declarations: [],
  imports: [CommonModule, AuthModule, LayoutModule],
  exports: [AuthModule, LayoutModule],
})
export class CoreModule {}
