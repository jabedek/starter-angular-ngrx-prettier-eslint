import { ElementRef } from '@angular/core';
import { CellPos } from './ago-point.model';

export type TimeMode = 'years' | 'months'; // | 'weeks' | 'days';

export interface TableCellElements {
  header: ElementRef<HTMLDivElement>[];
  data: ElementRef<HTMLDivElement>[];
}

export interface FutureMonths {
  firstPos: CellPos;
  positions: Map<string, CellPos>;
  naturalNumbers: Map<number, number>;
}
