import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthComponent } from './auth.component';
import { AuthFormComponent } from './components/auth-form/auth-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@shared/shared.module';
import { AuthButtonComponent } from './components/auth-button/auth-button.component';

@NgModule({
  declarations: [AuthComponent, AuthFormComponent, AuthButtonComponent],
  imports: [CommonModule, ReactiveFormsModule, FormsModule, SharedModule],
  exports: [AuthComponent, AuthFormComponent, AuthButtonComponent],
})
export class AuthModule {}
