import { AllHandsNames } from '../related-constants/hand.constant';

type HandName = (typeof AllHandsNames)[number];
type HandDetails = {
  text: { name: HandName; description: string };
  visualElements: { slots: number; distinctGroups: number };
  details: string;
};

export { HandName, HandDetails };
