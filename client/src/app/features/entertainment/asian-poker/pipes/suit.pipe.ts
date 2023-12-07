import { Pipe, PipeTransform } from '@angular/core';
import { SimpleCard, Suits, SuitsSymbols } from '../asian-poker.model';

@Pipe({
  name: 'suit',
})
export class SuitPipe implements PipeTransform {
  transform(card: SimpleCard, mode: 'name' | 'symbol', lang?: 'en' | 'pl'): unknown {
    const index = Suits.findIndex((suit) => suit === card.suit);
    return mode === 'name' ? Suits[index] : SuitsSymbols[index];
  }
}
