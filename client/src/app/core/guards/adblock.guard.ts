import { CanActivateFn } from '@angular/router';

export const adblockGuard: CanActivateFn = (route, state) => {
  return true;
};
