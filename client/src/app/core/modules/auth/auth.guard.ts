import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AppFirebaseService } from '@core/firebase/app-firebase.service';
import { first, take, takeUntil, tap } from 'rxjs';
import { PopupService } from '../layout/components/popup/popup.service';
import { AuthFormComponent } from './components/auth-form/auth-form.component';

export function authGuard(): CanActivateFn {
  return () => {
    const router: Router = inject(Router);
    console.log(router);

    const popup = inject(PopupService);
    popup.showPopup({
      contentType: 'simple',
      content: {
        textContent: 'okay?',
        textHeader: 'header',
        closeOnDecision: true,
        showAcceptButton: true,
        showDeclineButton: true,
        callbackAfterDecision: (decision) => {
          console.log('callbackAfterDecision', decision);
        },
      },
      config: {
        showCloseButton: true,
        callbackAfterClosing: () => {
          console.log('callbackAfterClosing');
        },
      },
    });
    // popup.showPopup({
    //   contentType: 'component',
    //   content: { component: AuthFormComponent, inputs: {} },
    //   config: {
    //     showCloseButton: true,
    //     callbackAfterClosing: () => {
    //       console.log('callbackAfterClosing');
    //     },
    //   },
    // });

    const service: AppFirebaseService = inject(AppFirebaseService);
    const isLogged = service.isLogged;
    console.log(isLogged);

    // return true;
    return isLogged ? true : router.createUrlTree(['/']);
  };
}
