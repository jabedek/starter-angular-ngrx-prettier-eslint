import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AppFirebaseService } from '@core/firebase/app-firebase.service';
import { first, take, takeUntil, tap } from 'rxjs';
import { PopupService } from '../layout/components/popup/popup.service';
import { AuthFormComponent } from './components/auth-form/auth-form.component';

export function authGuard(redirectToAfter?: string): CanActivateFn {
  return () => {
    const router: Router = inject(Router);
    const service: AppFirebaseService = inject(AppFirebaseService);

    return new Promise((res, rej) => {
      setTimeout(() => {
        if (service.isLogged) {
          res(true);
        } else {
          inject(PopupService).showPopup({
            contentType: 'component',
            content: { component: AuthFormComponent, inputs: { redirectToAfter } },
            config: {
              showCloseButton: true,
              callbackAfterClosing: () => {
                console.log('callbackAfterClosing');
              },
            },
          });
          // router.createUrlTree(['/']);
          rej(false);
        }
      }, 300);
    });
  };
}

// popup.showPopup({
//   contentType: 'simple',
//   content: {
//     textContent: 'okay?',
//     textHeader: 'header',
//     closeOnDecision: true,
//     showAcceptButton: true,
//     showDeclineButton: true,
//     callbackAfterAccept: (decision) => {
//       console.log('callbackAfterAccept', decision);
//     },
//   },
//   config: {
//     showCloseButton: true,
//     callbackAfterClosing: () => {
//       console.log('callbackAfterClosing');
//     },
//   },
// });
