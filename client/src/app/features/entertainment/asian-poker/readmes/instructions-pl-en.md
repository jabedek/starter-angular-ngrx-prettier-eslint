Stworzyłem grę bazującą na pokerze. Nazywa się Azjatycki Poker.
Główne różnie między Azjatyckim a zwykłym pokerem to:

# I. Hierarchia kart

W Azjatyckim, istnieje trochę inna hierarchia układów kart. Idąc od najsłabszego do najmocniejszego:

- wysoka karta
- parta
- dwie pary
- strit
- trójka
- ful
- kolor
- kareta
- poker
- poker królewski

Jak widać - strit zamienił się z trójką oraz ful z kolorem.

# II. Przebieg gry

- Każdy z graczy rozpoczyna grę z 1 kartą w ręku. Kolejne karty gracze dostają kiedy przegrają rundę w grze.
- Na stole są również kładzione "publiczne" karty z widocznym awersem - 2 dopóki wszyscy gracze mają mniej niż 2 swoje karty w ręku - jeśli wszyscy mają 2 i więcej to na stole jest kładziona 1 "publiczna" karta.
- Gra odbywa się zegarowo - każda runda zaczyna się od "kolejnej" osoby przy stole. Osoba ta rozpoczyna rundę licytacją. Na początku każdej rundy są rozdawane karty graczom - każdy gracz widzi tylko swoje karty oraz publiczne. Osoba rozpoczynająca zawsze musi licytować. Nastepnie każda inna osoba, nawet po zapętleniu, może albo Licytować albo Sprawdzić. Są to dwie możliwe Akcje do wykonania.
- Akcja - Licytacja albo Sprawdzenie.
- Licytacja - zadeklarowanie przez gracza układu, który gracz uważa (bądź blefuje), że istnieje pośród kart wszystkich graczy przy stole i kart publicznych. Gracz bazuje swój wybór na podstawie swoich kart, kart publicznych, domysłów odnośnie zakrytych kart innych graczy oraz na podstawie akcji innych graczy. Gracz może blefować.
  [Przykładowo:
  W rozgrywce jest 4 graczy. Każdy z nich ma po 1 karcie, na stole są 2 publiczne karty.
  Gracz 1 ma 10-kę Czerwo.
  Gracz 2 ma Damę Wino.
  Gracz 3 ma Króla Dzwonek.
  Gracz 4 ma 10-kę Wino.
  Na stole są: As Wino oraz 9-ka Żołędź.
  Gracz 1 rozpoczyna grę, licytuje wybierając: Para 9-ek (nie wie na pewno czy są dwie 9-ki w puli wszystkich użytych kart ale ryzykuje - albo - blefuje, próbując wmówić innym graczom że on ma drugą 9-kę)]
- Sprawdzenie - weryfikacja Licytacji poprzedniego gracza. Gdy gracz sprawdzi poprzedniego gracza, następuje koniec rundy i odbywa się weryfikacja licytowanego układu. Jeśli okaże się że licytowany układ istnieje - gracz sprawdzający otrzymuję 1 kartą więcej w kolejnych rundach. Jeśli okaże się że licytowany układ nie istnieje - gracz który licytował otrzymuję 1 kartą więcej.
- Kolejna runda odbywa się z rozdaniem odpowiedniej ilości kart dla osób które otrzymały dodatkowe karty.
- Gracz odpada z gry gdy mając łącznie 5 kart przegra po raz kolejny.

///

Asian Poker is a game based on traditional poker but with several unique rules. The hierarchy of card combinations differs slightly, with the order being high card, pair, two pairs, straight, three of a kind, full house, flush, four of a kind, straight flush, and royal flush, where straight and three of a kind, as well as full house and flush, are swapped in their ranks compared to traditional poker.

- The game starts with each player holding one card. Additional cards are received by players as they lose rounds.
- There are also visible "public" cards on the table, the number of which depends on the number of cards each player holds. As long as there is a player with 1 card - the number of public cards is 2, otherwise it is 1.
- The gameplay involves rounds that start with a player's bet and proceed clockwise.
- Players can either bet or check previous player, where betting involves declaring a hand that the player believes exists among all cards in play.
- If a player checks, it leads to the verification of the previously declared hand.
  If check fails (declared hand was not found) - additional card is given to declaring player.
  If check succeeds - additional card is given to player who did the check.
- Players are eliminated from the game if they have five cards in total and lose another round.

Additional rules:

- Game should hold 3-5 players

Additional and optional rules:

- When there is a shortage of cards (extreme example when all 6 players have 5 cards + 1 on table === 31)
- When there are only 2 players left, the deck should be reduced to 20 cards - by removing 8's and 9's

CONCEPTS & TODOS

# Vocabulary

- Leaving / to leave (session/game) - is an umbrella term for:
  -- Exit: leaving by closing tab/window
  -- Quit: leaving by clicking 'leave' button
- Players:
  -- Regular Player - user who plays Asian Poker
  -- (OG) Host - player who had a title of a host in session/game. OG is who actually created and stayed for play.
  -- Invitee - player who got invited to the game
  -- Kickee - player who got kicked from the game
  -- Any Player - all types of players - host, regular, invited
- Lock a spot - declare playing spot

# Session - Waiting Room

- User who created the session is a host
- Host can invite/kick specified players (in both cases subjected user receives a toaster popup)
- Inviting is done by clicking empty player slot and providing invitee email
- Waiting room has a chat section
- Game can be started when there are min. 3 players
- Game starts automatically when exptected number of players join
- When Any player joins CAN lock his spot (host's place is locked automatically). It serves a couple of purposes:
  -- It shows which players are committed to playing
  -- It prevents taking slot by other player in case the player is disconnected (case for 20 sec. elaborated below)
- If Any player Leaves:
  -- he's considered a victim of faulty connection and he's slot (only if was locked) waits for him for next 20 seconds (countdown is visible); if they re-join in this period, they get back their spot. If player don't re-join in 20 seconds, his spot gets unlocked for public. Also If player was a host, player after him becomes the host
  -- each player got 1 chance to rejoin locked place with waiting time
- If session gets completely empty - no one joined and host has left, it waits for 10 seconds and if still empty, it is automatically closed

# Game

- If Any player is considered afk/disconnected - he has one-per-round possibility to quickly re-join in again - 20 seconds. In other case, he gets kicked and the current round restarts.
