import { Pipe, PipeTransform } from '@angular/core';
import { CellPos } from '../models/ago-point.model';

export function getCellPos(year: number, month: number, slotIndex?: number, week = ''): CellPos {
  const naturalMonth = month + 1;
  const doubleDigitMonth = `${naturalMonth < 10 ? `0${naturalMonth}` : naturalMonth}`;
  let doubleDigitSlot = '';

  if (slotIndex === undefined || slotIndex < 0) {
    doubleDigitSlot = 'HH';
  } else {
    doubleDigitSlot = `${slotIndex < 10 ? `0${slotIndex}` : slotIndex}`;
  }
  if (slotIndex === undefined && !week) {
    return `${year}_N${doubleDigitMonth}`;
  }

  return `${year}_N${doubleDigitMonth}_W${'00'}_S${doubleDigitSlot}`;
}

@Pipe({
  name: 'pos',
})
export class AgoPosPipe implements PipeTransform {
  transform(value: number, ...args: number[]): CellPos {
    return getCellPos(value, args[0], args[1]);
  }
}
