import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { FirebaseAuthService } from '@core/firebase/firebase-auth.service';
import { PopupService } from '../layout/components/popup/popup.service';
import { AuthFormComponent } from './components/auth-form/auth-form.component';
import { LocalStorage } from 'frotsi';
import { StorageItem } from '@shared/models/storage-items.enum';

export function authGuard(redirectToAfter?: string): CanActivateFn {
  return (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    console.log('authGuard', route);
    debugger;
    const service: FirebaseAuthService = inject(FirebaseAuthService);
    const router = inject(Router);
    const popup = inject(PopupService);
    // console.log(route);
    // console.log(state);

    return new Promise((res, rej) => {
      setTimeout(() => {
        if (service.isLogged) {
          res(true);
        } else {
          // popup.showPopup({
          //   contentType: 'component',
          //   content: { component: AuthFormComponent },
          //   config: { showCloseButton: true, closeOnOutclick: false },
          // });
          LocalStorage.setItem(StorageItem.REDIRECT_TO_AFTER, redirectToAfter || state.url);
          router.navigate(['home']);
          rej(false);
        }
      }, 300);
    });
  };
}
