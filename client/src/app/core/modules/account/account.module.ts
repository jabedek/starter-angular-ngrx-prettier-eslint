import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountRoutingModule } from './account-routing.module';
import { AccountComponent } from './account.component';
import { AuthModule } from '../auth/auth.module';
import { AccountFormComponent } from './components/account-form/account-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [AccountComponent, AccountFormComponent],
  imports: [CommonModule, AuthModule, FormsModule, ReactiveFormsModule, AccountRoutingModule],
})
export class AccountModule {}
