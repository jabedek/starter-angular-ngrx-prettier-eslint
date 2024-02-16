// updated on every Player action

import { GameActivityTickLogDTO } from './game.model';
import { AsianPokerSessionSettings, AsianPokerSessionActivity, SessionInvitation } from './session.model';

export type AsianPokerSessionDTO = {
  id: string;
  gameId: string;
  chatId: string;
  sessionSettings: AsianPokerSessionSettings;
  sessionActivity: AsianPokerSessionActivity;
};

export type AsianPokerGameDTO = {
  id: string;
  sessionId: string;
  ticks: GameActivityTickLogDTO[];
};

export type AsianPokerChatDTO = {
  id: string;
  sessionId: string;
  messages: AsianPokerChatMessageDTO[];
};

export type AsianPokerChatMessageDTO = {
  id: string;
  senderId: string;
  senderNickname: string;
  sentAtMS: number;
  content: string;
};
