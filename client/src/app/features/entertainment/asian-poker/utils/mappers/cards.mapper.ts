import { RanksWithHierarchyExtended, SuitsWithHierarchy } from '../../models/related-constants/card.constant';
import { Card } from '../../models/types/card.model';

function mapCardsToBackend(cards: Card[]): string[] {
  return cards.map(({ rank, suit }) => `${rank.desc}_${suit.name}`);
}

function mapCardsToFrontend(cards: string[]): Card[] {
  return cards.map((card) => {
    const [rankDesc, suitName] = card.split('_');
    const rank = RanksWithHierarchyExtended.find((rank) => rank.desc === rankDesc);
    const suit = SuitsWithHierarchy.find((suit) => suit.name === suitName);
    return { rank, suit } as Card;
  });
}

export function mapCardsTo<T>(dir: 'backend' | 'frontend', cards: any[]) {
  return (dir === 'backend' ? mapCardsToBackend(cards) : mapCardsToFrontend(cards)) as T;
}
