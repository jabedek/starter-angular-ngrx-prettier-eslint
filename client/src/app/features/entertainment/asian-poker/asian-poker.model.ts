import { Flatten } from 'frotsi';

export const HandsWithHierarchy = [
  { namePL: 'wysoka karta', descPL: 'pojedyncza karta', nameEN: 'high card', descEN: 'a card' },
  { namePL: 'para', descPL: '', nameEN: 'pair', descEN: 'two same ranks' },
  { namePL: 'dwie pary', descPL: '', nameEN: 'two pairs', descEN: 'two pairs' },
  { namePL: 'strit', descPL: '', nameEN: 'straight', descEN: 'five cards of sequential rank, not all of the same suit ' },
  { namePL: 'trójka', descPL: '', nameEN: 'three', descEN: 'three same ranks' },
  { namePL: 'full', descPL: '', nameEN: 'full house', descEN: 'five cards - combination of a Pair and a Three' },
  { namePL: 'kolor', descPL: '', nameEN: 'color/flush', descEN: 'five cards with same suit' },
  { namePL: 'kareta', descPL: '', nameEN: 'four/quads', descEN: 'four same ranks' },
  { namePL: 'poker', descPL: '', nameEN: 'poker/straight flush', descEN: 'five cards of sequential rank, all of the same suit' },
  // {
  //   namePL: 'poker królewski',
  //   descPL: '',
  //   nameEN: 'royal flush',
  //   descEN: 'five cards of sequential rank, all of the same suit, 10-to-Ace',
  // },
] as const;

export const SuitsBlack = ['SPADES', 'CLUBS'] as const;
export const SuitsRed = ['HEARTS', 'DIAMONDS'] as const;

export const Suits = ['SPADES', 'HEARTS', 'DIAMONDS', 'CLUBS'] as const;
export const Ranks = ['8', '9', '10', 'J', 'Q', 'K', 'A'] as const;

export const SuitsSymbols = ['♠', '♥', '♦', '♣'];
export const RanksFull = ['EIGHT', 'NINE', 'TEN', 'JACK', 'QUEEN', 'KING', 'ACE'] as const;

export type SimpleSuit = Flatten<(typeof Suits)[number]>;
export type SimpleRank = Flatten<(typeof Ranks)[number]>;

export type SimpleCard = {
  suit: SimpleSuit;
  rank: SimpleRank;
};

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

export type GameState = 'ready' | 'running' | 'paused' | 'finished';

export type AsianPokerSession = {
  id: string;
  gameState: GameState;
  turnsCounter: number;
  turnCycleCounter: number;
  turnPlayers: AsianPokerPlayerInfo[];
  currentPlayerIndex: number;
  currentDealerIndex: number;
  publicCards: BaseCard[];
  playersCalls: PlayAction[];
};

interface AsianPokerPlayer {
  id: string;
  nickname: string;
  handSize: number;
  hand: BaseCard[];
}

export class AsianPokerPlayerInfo implements AsianPokerPlayer {
  id: string;
  nickname: string;
  handSize = 1;
  hand: BaseCard[] = [];

  constructor(id: string, nickname: string, handSize = 1) {
    this.id = id;
    this.nickname = nickname;
    this.handSize = handSize;
  }
}

export enum PlayerActions {
  SESSION_START = 'SESSION_START',
  PLAY_CALL = 'PLAY_CALL',
  PLAY_CHECK = 'PLAY_CHECK',
  PAUSE_PROPOSE = 'PAUSE_PROPOSE',
  PAUSE_VOTE_YES = 'PAUSE_VOTE_YES',
  PAUSE_VOTE_NO = 'PAUSE_VOTE_NO',
}

export type PlayAction =
  | {
      type: PlayerActions.PLAY_CALL;
      data: {
        turnCycleIndex: number;
        playerId: string;
        playerIndex: number;
        calledCardSet: CardSet;
      };
    }
  | {
      type: PlayerActions.PLAY_CHECK;
      data: {
        turnCycleIndex: number;
        playerId: string;
        playerIndex: number;
      };
    };
