/* eslint-disable prettier/prettier */
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

@Injectable()
export class LayoutEffects {
  constructor(private actions$: Actions) {}
}
