import { Directive, ElementRef, Input } from '@angular/core';
import { BaseCard, SuitsBlack } from '../models/card.model';

@Directive({
  selector: '[appCardStyle]',
})
export class CardStyleDirective {
  @Input({ required: true }) set appCardStyle(card: BaseCard | undefined) {
    this._appCardStyle = card;
    this.appCardOnSet(card);
  }
  get appCardStyle(): BaseCard | undefined {
    return this._appCardStyle;
  }
  private _appCardStyle: BaseCard | undefined = undefined;
  private appCardOnSet(card: BaseCard | undefined) {
    if (card) {
      const suitColoring = SuitsBlack.includes(card.suit.name as any) ? 'black' : 'red';
      this.element.nativeElement.style.color = suitColoring;
    }

    return;
  }

  constructor(private element: ElementRef) {}
}
