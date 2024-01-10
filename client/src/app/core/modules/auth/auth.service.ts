import { Injectable } from '@angular/core';
import { FirebaseAuthService } from '@core/firebase/firebase-auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private firebase: FirebaseAuthService) {}

  async refreshLogin(tryReAuth: boolean, redirectToAfter?: string) {
    this.firebase.refreshLogin(tryReAuth, redirectToAfter);
  }

  async logout(redirectToAfter?: string) {
    this.firebase.firebaseLogout(redirectToAfter);
  }
}
