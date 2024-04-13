import { Directive, ElementRef, Input } from '@angular/core';
import { Card } from '../models/types/card.model';
import { SuitsBlack } from '../models/related-constants/card.constant';

@Directive({
  selector: '[appCardStyle]',
})
export class CardStyleDirective {
  @Input({ required: true }) set appCardStyle(card: Card | undefined) {
    this._appCardStyle = card;
    this.appCardOnSet(card);
  }
  get appCardStyle(): Card | undefined {
    return this._appCardStyle;
  }
  private _appCardStyle: Card | undefined = undefined;
  private appCardOnSet(card: Card | undefined) {
    if (card) {
      const suitColoring = SuitsBlack.includes(card.suit.name as any) ? 'black' : 'red';
      this.element.nativeElement.style.color = suitColoring;
    }

    return;
  }

  constructor(private element: ElementRef) {}
}
