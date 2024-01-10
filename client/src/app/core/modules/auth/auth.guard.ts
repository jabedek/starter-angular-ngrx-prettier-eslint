import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { FirebaseAuthService } from '@core/firebase/firebase-auth.service';
import { PopupService } from '../layout/components/popup/popup.service';
import { AuthFormComponent } from './components/auth-form/auth-form.component';

export function authGuard(redirectToAfter?: string): CanActivateFn {
  return () => {
    const service: FirebaseAuthService = inject(FirebaseAuthService);
    const router = inject(Router);
    const popup = inject(PopupService);
    return new Promise((res, rej) => {
      setTimeout(() => {
        if (service.isLogged) {
          res(true);
        } else {
          popup.showPopup({
            contentType: 'component',
            content: { component: AuthFormComponent, inputs: { redirectToAfter } },
            config: {
              showCloseButton: true,
              callbackAfterClosing: () => {
                console.log('callbackAfterClosing');
              },
            },
          });
          router.navigate(['home']);
          rej(false);
        }
      }, 300);
    });
  };
}
