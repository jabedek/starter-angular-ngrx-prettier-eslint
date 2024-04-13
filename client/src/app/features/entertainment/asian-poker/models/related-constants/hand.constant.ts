import { HandName, HandDetails } from '../types/hand.model';

/** Hands names and hierarchy */
export const HighHandsNames = [
  'royal-poker',
  'regular-poker',
  'queen-poker',
  'four',
  'color',
  'full-house',
  'three',
  'high-straight',
  'regular-straight',
  'low-straight',
] as const;
export const LowHandsNames = ['double-pair', 'pair', 'high-card'] as const;
export const AllHandsNames = [...HighHandsNames, ...LowHandsNames] as const;

export const CHOICE_SUB_SET = {
  small: ['8', '9', '10', 'J', 'Q'],
  regular: ['9', '10', 'J', 'Q', 'K'],
  big: ['10', 'J', 'Q', 'K', 'A'],
};

/** Hands label, descriptions and card content */
export const HandsDetails: Record<HandName, HandDetails> = {
  'royal-poker': {
    text: { name: 'royal-poker', description: 'Poker \n królewski \n (10-A)' },
    visualElements: {
      slots: 5,
      distinctGroups: 1, // grouped by 1 suit
    },
    details: 'color(10-A)',
  },
  'regular-poker': {
    text: { name: 'regular-poker', description: 'Poker \n prosty \n (9-K)' },
    visualElements: {
      slots: 5,
      distinctGroups: 1, // grouped by 1 suit
    },
    details: 'color(9-K)',
  },
  'queen-poker': {
    text: { name: 'queen-poker', description: 'Poker \n królowej \n (8-Q)' },
    visualElements: {
      slots: 5,
      distinctGroups: 1, // grouped by 1 suit
    },
    details: 'color(8-Q)',
  },
  four: {
    text: { name: 'four', description: 'Kareta' },
    visualElements: {
      slots: 4,
      distinctGroups: 1, // grouped by 1 rank
    },
    details: 'all',
  },
  color: {
    text: { name: 'color', description: 'Kolor' },
    visualElements: {
      slots: 5,
      distinctGroups: 1, // grouped by 1 suit
    },
    details: 'color(all)',
  },
  'full-house': {
    text: { name: 'full-house', description: 'Full' },
    visualElements: {
      slots: 5,
      distinctGroups: 2, // grouped by 2 different ranks
    },
    details: 'all/all-1',
  },
  three: {
    text: { name: 'three', description: 'Trójka' },
    visualElements: {
      slots: 3,
      distinctGroups: 1, // grouped by 1 suit
    },
    details: 'all',
  },
  'high-straight': {
    text: { name: 'high-straight', description: 'Strit \n wysoki \n (10-A)' },
    visualElements: {
      slots: 5,
      distinctGroups: 1, // not really grouped but simplified into predefined general choice, without specifying ranks or suits
    },
    details: '10-A',
  },
  'regular-straight': {
    text: { name: 'regular-straight', description: 'Strit \n prosty \n (9-K)' },
    visualElements: {
      slots: 5,
      distinctGroups: 1, // not really grouped but simplified into predefined general choice, without specifying ranks or suits
    },
    details: '9-K',
  },
  'low-straight': {
    text: { name: 'low-straight', description: 'Strit \n niski \n (8-Q)' },
    visualElements: {
      slots: 5,
      distinctGroups: 1, // not really grouped but simplified into predefined general choice, without specifying ranks or suits
    },
    details: '8-Q',
  },

  'double-pair': {
    text: { name: 'double-pair', description: 'Dwie \n pary' },
    visualElements: {
      slots: 4,
      distinctGroups: 2, // grouped by 2 different ranks
    },
    details: 'all/all-1',
  },
  pair: {
    text: { name: 'pair', description: 'Para' },
    visualElements: {
      slots: 2,
      distinctGroups: 1, // grouped by 1 rank
    },
    details: 'all',
  },
  'high-card': {
    text: { name: 'high-card', description: 'Wysoka \n karta' },
    visualElements: {
      slots: 1,
      distinctGroups: 1, // single card
    },
    details: 'all',
  },
};
