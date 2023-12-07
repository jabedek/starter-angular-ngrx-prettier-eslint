import { Injectable } from '@angular/core';
import { AppFirebaseService } from '@core/firebase/app-firebase.service';
import { Store } from '@ngrx/store';
import { AppState } from '@store/app-state';
import { selectAuth } from '@store/auth/auth.selectors';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  auth$ = this.store.select(selectAuth);

  constructor(
    private firebase: AppFirebaseService,
    private store: Store<AppState>,
  ) {}

  async refreshLogin() {
    this.firebase.refreshLogin();
  }

  async logout() {
    this.firebase.firebaseLogout();
  }
}
