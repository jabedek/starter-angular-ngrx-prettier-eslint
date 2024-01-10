import { BettingHand } from '../../../../models/betting-process';

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
