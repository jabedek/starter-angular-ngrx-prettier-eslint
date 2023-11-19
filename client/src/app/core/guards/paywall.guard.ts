import { CanActivateFn } from '@angular/router';

export const paywallGuard: CanActivateFn = (route, state) => {
  return true;
};
