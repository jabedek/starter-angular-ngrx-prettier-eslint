import { Pipe, PipeTransform } from '@angular/core';
import { SuitDisplayItem, convertSuit } from '../utils/card-display-converter';

@Pipe({
  name: 'card',
})
export class CardPipe implements PipeTransform {
  transform(value: SuitDisplayItem | string | undefined, convertTo: 'name' | 'symbol' = 'symbol'): unknown {
    if (!value) {
      return '';
    }
    const result = convertSuit(value, convertTo);

    return result;
  }
}
