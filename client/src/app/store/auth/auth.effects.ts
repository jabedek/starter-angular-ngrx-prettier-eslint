/* eslint-disable prettier/prettier */
import { Injectable } from '@angular/core';
import { AuthService } from '@core/modules/auth/auth.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';

@Injectable()
export class FirebaseAuthEffects {
  // loadMovies$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType('[Auth] Gather App'),
  //     exhaustMap(() =>
  //       this.moviesService.getAll().pipe(
  //         map((movies) => ({ type: '[Movies API] Movies Loaded Success', payload: movies })),
  //         catchError(() => of({ type: '[Movies API] Movies Loaded Error' })),
  //       ),
  //     ),
  //   ),
  // );

  constructor(
    private actions$: Actions,
    private auth: AuthService,
  ) {}
}
