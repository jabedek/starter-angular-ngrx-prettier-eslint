type AsianPokerChatDTO = {
  id: string;
  sessionId: string;
  messages: AsianPokerChatMessageDTO[];
};

type AsianPokerChatMessageDTO = {
  id: string;
  senderId: string;
  senderNickname: string;
  sentAtMS: number;
  content: string;
};

export { AsianPokerChatDTO, AsianPokerChatMessageDTO };
