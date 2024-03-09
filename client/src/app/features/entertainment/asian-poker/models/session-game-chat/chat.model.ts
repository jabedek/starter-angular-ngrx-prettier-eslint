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
