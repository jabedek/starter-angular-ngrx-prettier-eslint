import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountRoutingModule } from './account-routing.module';
import { AccountComponent } from './account.component';
import { AuthModule } from '../auth/auth.module';
import { AccountFormComponent } from './components/account-form/account-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AccountDetailsComponent } from './components/account-details/account-details.component';
import { SharedModule } from '@shared/shared.module';
import { InboxComponent } from './components/inbox/inbox.component';

@NgModule({
  declarations: [AccountComponent, AccountFormComponent, AccountDetailsComponent, InboxComponent],
  imports: [CommonModule, AuthModule, FormsModule, ReactiveFormsModule, AccountRoutingModule, SharedModule],
})
export class AccountModule {}
