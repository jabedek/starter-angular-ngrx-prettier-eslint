import { CHOICE_SUB_SET } from '@features/entertainment/asian-poker/models/related-constants/hand.constant';
import { RanksPropositions, SelectionPropositions, SuitsPropositions, VariantPropositionsPoker } from './hand-picker.constant';
import { BettingHand } from './hand-picker.model';

export function getEmptyBettingSlotsGroups(slotsData: { slots: number; distinctGroups: number }) {
  const { slots, distinctGroups } = slotsData;
  const groups: { slots: BettingHand[]; value: undefined }[] = [];

  if (distinctGroups === 1) {
    for (let i = 0; i < distinctGroups; i++) {
      groups.push({ slots: getEmptySlots(slots), value: undefined });
    }
  }

  if (distinctGroups === 2) {
    groups.push({ slots: getEmptySlots(2), value: undefined });
    groups.push({ slots: getEmptySlots(slots - 2), value: undefined });
  }

  return groups;
}

export function getEmptySlots(amount: number) {
  const slots: BettingHand[] = [
    { suit: undefined, rank: undefined },
    { suit: undefined, rank: undefined },
    { suit: undefined, rank: undefined },
    { suit: undefined, rank: undefined },
    { suit: undefined, rank: undefined },
  ];

  return [...slots].splice(0, amount);
}

export function getChoiceSubSet(forHand: string) {
  if (['queen-poker', 'low-straight'].includes(forHand)) {
    return CHOICE_SUB_SET.small;
  }
  if (['regular-poker', 'regular-straight'].includes(forHand)) {
    return CHOICE_SUB_SET.regular;
  }

  return CHOICE_SUB_SET.big;
}

export function getPropositionsKeys(step: 'selection' | 'variant' | 'rank' | 'suit'): number[] {
  switch (step) {
    case 'selection':
      return SelectionPropositions.map(({ key }) => key);
    case 'variant':
      return VariantPropositionsPoker.map(({ key }) => key);
    case 'rank':
      return RanksPropositions.filter(({ key }) => key !== -1).map(({ key }) => key);
    case 'suit':
      return SuitsPropositions.filter(({ key }) => key !== -1).map(({ key }) => key);
    default:
      return [];
  }
}
