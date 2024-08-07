/**
 * * `session-created` - session was just opened, at lobby page
 * * `game-created` - session's game was just started, session is moving from Wait page to the Game page and the game is being initialized
 * * `game-ready` - in Game page - game is initialized and ready to start
 * * `running` - game was initalized and is running in game page, players are making their moves
 * * `finished` - game was finished, session gathered last informations about the game
 */
const SessionStatuses = ['session-created', 'game-created', 'game-ready', 'running', 'finished'] as const;

/**
 * * `session-created` - session was just opened, at lobby page
 * * `game-created` - session's game was just started, session is moving from Wait page to the Game page and the game is being initialized
 * * `game-ready` - in Game page - game is initialized and ready to start
 * * `running` - game was initalized and is running in game page, players are making their moves
 * * `finished` - game was finished, session gathered last informations about the game
 */
type SessionStatus = (typeof SessionStatuses)[number];

const AllSessionStatuses = ['session-created', 'game-created', 'game-ready', 'running', 'finished'] as SessionStatus[];
const JoinableSessionStatuses = ['session-created', 'game-created'] as SessionStatus[];
const WatchableSessionStatuses = ['game-created', 'game-ready', 'running', 'finished'] as SessionStatus[];

export { SessionStatus, AllSessionStatuses, SessionStatuses, JoinableSessionStatuses, WatchableSessionStatuses };
