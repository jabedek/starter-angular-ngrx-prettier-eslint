import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthModule } from './modules/auth/auth.module';
import { LayoutModule } from './modules/layout/layout.module';
import { SharedModule } from '@shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [],
  imports: [CommonModule, AuthModule, LayoutModule, SharedModule, FormsModule, ReactiveFormsModule],
  exports: [AuthModule, LayoutModule],
})
export class CoreModule {}
