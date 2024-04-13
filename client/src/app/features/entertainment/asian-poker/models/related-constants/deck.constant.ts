export const DeckAmountStandard = 24;
export const DeckAmountExtended = 28;
export const DeckAmountFinale = 20;
export type DeckVariant = 'finale' | 'standard' | 'extended';

/**
 * `Extreme situation` means that 6-players game is approaching to having all players holding 5 cards each, which would be 30 cards in total, which is more than 28 cards-deck (the largest variant - `DeckAmountExtended`).
 *
 * Extreme situation should be recognized when there are `4 cards in each player's hand.`
 *
 * In this case, cards limit should be set to `MaxCardsInHandExtremeSituation`. After any player drops off, cards limit should return to `MaxCardsInHandStandard`.
 */
export const MaxCardsInHandExtremeSituation = 4;
export const MaxCardsInHandStandard = 5;
