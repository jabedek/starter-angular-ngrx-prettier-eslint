import { Injectable } from '@angular/core';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale/pl';
import { DurationRange } from '../models/ago-commons.model';

@Injectable({
  providedIn: 'root',
})
export class AgoDateService {
  constructor() {}

  getYearsFromRange(range: DurationRange): number[] {
    const array: number[] = [];
    if (range.length === 0) {
      return array;
    } else {
      for (let i = 0; i < range.length; i++) {
        array.push(range.earliest + i);
      }
      return array;
    }
  }

  getAllMonthNames() {
    const months: any[] = [];
    for (let i = 0; i < 12; i++) {
      months.push(format(new Date(`2000-${1 + i}-01`), 'LLL', { locale: pl }));
    }
    return months;
  }
}
