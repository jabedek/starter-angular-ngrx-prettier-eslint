import { Injectable } from '@angular/core';
import { shuffleCollection } from '@shared/helpers/collections.utils';
import { generateDocumentId } from 'frotsi';
import { PlayerWithHand, PlayerAction } from '../models/game.model';
import { Card } from '../models/card.model';
import { createNewDeck, drawCards } from '../utils/game.utils';

@Injectable({
  providedIn: 'root',
})
export class GameManagerService {
  constructor() {}

  // initGameAndStartRoung(players: PlayerWithHand[]) {
  //   const shuffledPlayers = shuffleCollection(players);

  //   const newSession: AsianPokerGameDTO = {
  //     id: generateDocumentId(),
  //     sessionId: 'TODO',
  //     turnsCounter: 0,
  //     deckVariant: 'standard',
  //     turnCycleCounter: 0,
  //     currentPlayerIndex: 2,
  //     currentDealerIndex: 0,
  //     turnPlayers: [...shuffledPlayers],
  //     gameState: 'ready',
  //     publicCards: [],
  //     playersCalls: [],
  //   };

  //   const { cards, deckVariant } = createNewDeck(newSession.turnPlayers);
  //   const shuffledCards = shuffleCollection<Card>(cards);
  //   const { playersCards, publicCards, undealt } = drawCards(shuffledCards, newSession.turnPlayers);

  //   newSession.deckVariant = deckVariant;
  //   newSession.turnPlayers.forEach((player) => (player.hand = playersCards[player.id]));
  //   newSession.publicCards = publicCards;
  //   this.sessions.set(newSession.id, newSession);

  //     const session = this.sessionGameData.get(sessionId);
  //     if (session) {
  //       session.gameState = 'running';
  //     }

  //   return newSession.id;
  // }

  // play(sessionId: string, action: PlayerAction) {
  //   const session = this.sessionGameData.get(sessionId);
  //   if (session) {
  //     const { turnsCounter, turnCycleCounter, currentPlayerIndex, currentDealerIndex } = session;

  //     session.playersCalls.push(action);
  //     session.currentPlayerIndex = currentPlayerIndex + 1;

  //     if (session.currentPlayerIndex === session.turnPlayers.length) {
  //       session.currentPlayerIndex = 0;
  //       session.turnCycleCounter = turnCycleCounter + 1;
  //     }
  //     // session.turnsCounter = turnsCounter + 1;
  //     // session.currentDealerIndex = currentDealerIndex + 1;
  //   }
  // }
}
