import { Pipe, PipeTransform } from '@angular/core';
import { BaseCard, Ranks, RanksFull, RanksWithHierarchyStandard, SimpleCard } from '../asian-poker.model';

@Pipe({
  name: 'rank',
})
export class RankPipe implements PipeTransform {
  transform(card: SimpleCard, mode: 'short' | 'full', lang?: 'en' | 'pl'): unknown {
    const index = Ranks.findIndex((rank) => rank === card.rank);
    return mode === 'short' ? Ranks[index] : RanksFull[index];
  }
}
