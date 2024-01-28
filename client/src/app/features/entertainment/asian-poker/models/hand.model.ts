import { AllHandsNames } from '../constants/hand.constant';

export type HandName = (typeof AllHandsNames)[number];
export type HandDetails = {
  text: { name: HandName; description: string };
  visualElements: { slots: number; distinctGroups: number };
  details: string;
};
