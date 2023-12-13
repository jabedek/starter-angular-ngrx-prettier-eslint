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

  async refreshLogin(tryReAuth: boolean, redirectToAfter?: string) {
    this.firebase.refreshLogin(tryReAuth, redirectToAfter);
  }

  async logout(redirectToAfter?: string) {
    this.firebase.firebaseLogout(redirectToAfter);
  }
}
