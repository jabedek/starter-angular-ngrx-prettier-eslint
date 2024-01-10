import { CardTuples, Suit, SuitSymbol, Suits, SuitsSymbols, SuitsWithHierarchy } from '../models/card.model';

type SuitWrapper = Suit | SuitSymbol;
export type SuitDisplayItem = SuitWrapper | Record<string, SuitWrapper>;

export function convertSuit(item: SuitDisplayItem, convertTo: 'name' | 'symbol' = 'symbol') {
  if (!item) {
    return '';
  }

  let foundMatch: { name: Suit; symbol: SuitSymbol } | undefined;

  if (typeof item === 'object') {
    Object.entries(item).forEach((entry) =>
      CardTuples.forEach((tuple) => {
        if (tuple.includes(entry[1])) {
          foundMatch = { name: tuple[0], symbol: tuple[1] };
        }
      }),
    );
  } else if (typeof item === 'string') {
    CardTuples.forEach((tuple) => {
      if (tuple.includes(item)) {
        foundMatch = { name: tuple[0], symbol: tuple[1] };
      }
    });
  }

  return foundMatch ? foundMatch[convertTo] : '';
}
