export const HandsWithHierarchy = [
  { name: 'high-card', desc: 'a card' },
  { name: 'pair', desc: 'two same ranks' },
  { name: 'two-pairs', desc: 'two pairs' },
  { name: 'straight', desc: 'five cards of sequential rank, not all of the same suit ' },
  { name: 'three', desc: 'three same ranks' },
  { name: 'full-house', desc: 'five cards - combination of a Pair and a Three' },
  { name: 'color/flush', desc: 'five cards with same suit' },
  { name: 'four/quads', desc: 'four same ranks' },
  { name: 'poker/straight-flush', desc: 'five cards of sequential rank, all of the same suit' },
  { name: 'royal-flush', desc: 'five cards of sequential rank, all of the same suit, 10-to-Ace' },
] as const;

export const SuitsBlack = ['SPADES', 'CLUBS'] as const;
export const SuitsRed = ['HEARTS', 'DIAMONDS'] as const;

export const SuitsWithHierarchy = [
  { name: 'SPADES', pl: 'WINO/PIK', symbol: '♠' },
  { name: 'HEARTS', pl: 'CZERWO/KIER', symbol: '♥' },
  { name: 'DIAMONDS', pl: 'DZWONEK/KARO', symbol: '♦' },
  { name: 'CLUBS', pl: 'ŻOŁĘDŹ/TREFL', symbol: '♣' },
] as const;

export const RanksWithHierarchyStandard = [
  { name: '9', desc: 'NINE' },
  { name: '10', desc: 'TEN' },
  { name: 'J', desc: 'JACK' },
  { name: 'Q', desc: 'QUEEN' },
  { name: 'K', desc: 'KING' },
  { name: 'A', desc: 'ACE' },
] as const;

export const RanksWithHierarchyExtended = [
  { name: '8', desc: 'EIGHT' },
  { name: '9', desc: 'NINE' },
  { name: '10', desc: 'TEN' },
  { name: 'J', desc: 'JACK' },
  { name: 'Q', desc: 'QUEEN' },
  { name: 'K', desc: 'KING' },
  { name: 'A', desc: 'ACE' },
] as const;

export const RanksWithHierarchyFinale = [
  { name: '10', desc: 'TEN' },
  { name: 'J', desc: 'JACK' },
  { name: 'Q', desc: 'QUEEN' },
  { name: 'K', desc: 'KING' },
  { name: 'A', desc: 'ACE' },
] as const;

export const StandardDeckAmount = 24;
export const ExtendedDeckAmount = 28;
export const FinaleDeckAmount = 20;

export type RanksWithHierarchy = typeof RanksWithHierarchyExtended | typeof RanksWithHierarchyStandard;

export type BaseCard = {
  suit: (typeof SuitsWithHierarchy)[number];
  rank: RanksWithHierarchy[number];
};

export type CardSet = {
  kind: (typeof HandsWithHierarchy)[number];
  cards: BaseCard[];
};

export type AsianPokerSession = {
  turnsCounter: number;
  turnCycleCounter: number;
  turnPlayers: AsianPokerPlayerInfo[];
  turnHasStarted: boolean;
  currentPlayerIndex: number;
  currentDealerIndex: number;
  publicCards: BaseCard[];
  playerCalls: PlayerCall[];
};

interface AsianPokerPlayer {
  id: string;
  nickname: string;
  mandatoryDraws: number;
  hand: BaseCard[];
}

type PlayerCall = {
  turnCycleIndex: string;
  playerId: string;
  calledCardSet: CardSet;
};

export class AsianPokerPlayerInfo implements AsianPokerPlayer {
  id: string;
  nickname: string;
  mandatoryDraws = 1;
  hand: BaseCard[] = [];

  constructor(id: string, nickname: string, mandatoryDraws = 1) {
    this.id = id;
    this.nickname = nickname;
    this.mandatoryDraws = mandatoryDraws;
  }
}
