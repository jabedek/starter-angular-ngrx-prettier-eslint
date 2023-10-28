import logger from "node-color-log";
import { Server, Socket } from "socket.io";
import { IdGenerator } from "../../../system-shared/helpers/id-gen";
import {
  IOEngineErrorCode,
  IOEngineEvent,
  IOEvent,
} from "../../../system-shared/models/io-events.model";
import {
  B,
  M,
  S,
  G,
  GT,
  SocketEvent,
} from "../../../system-shared/models/socket-events.model";
import { Game } from "../../../system-shared/models/specific-events.model";
import {
  UsersDataMap,
  UserSocketSessionDataWithSocket,
  UserSocketSessionDataWithSocketID,
} from "../../../system-shared/models/user.model";
import {
  decoupleUser,
  findAndParseRoomsToGameObjects,
} from "./utils/socket-helpers";

export type IOInstanceData = {
  started: Date;
  ended: Date | undefined;
  id: string;
  ioInstance: Server;
};

export class SocketHandlerService2 {
  private ioInstanceData: IOInstanceData | undefined;
  private ioInstance: Server | undefined;
  private usersData: UsersDataMap = new Map<
    string,
    UserSocketSessionDataWithSocket
  >();

  constructor(http: any, origin: string[]) {
    this.ioInstanceData = this.prepareIOInstance(http, origin);
    this.ioInstance = this.ioInstanceData.ioInstance;

    this.listenToRoomBasicEvents();
    this.listenToIOEngineEvents();

    this.ioInstance.on(IOEvent.connection, (socket: Socket): void => {
      this.coupleSocketListenersToUser(socket);
      this.listenToUserJoinedGame(socket);

      this.sendActiveUsers();
      this.sendActiveGames();
    });
  }

  private prepareIOInstance(http: any, origin: string[]): IOInstanceData {
    const entity: IOInstanceData = {
      id: IdGenerator.generateId("io"),
      ended: undefined,
      started: new Date(),
      ioInstance: new Server(http, {
        cors: {
          origin,
        },
      }),
    };

    return entity;
  }

  private coupleSocketListenersToUser(socket: Socket) {
    const socketUserData: UserSocketSessionDataWithSocket = {
      createdGames: [],
      userId: socket.handshake.query.userId as unknown as string,
      currentSocket: socket,
      atGameId: undefined,
    };

    const userId = socketUserData.userId;
    const previouslySet = userId ? this.usersData.get(userId) : false;

    if (previouslySet) {
      previouslySet.currentSocket = socket;
    } else if (userId) {
      decoupleUser(userId, this.usersData);

      this.usersData.set(userId, socketUserData);

      const setUser = this.usersData.get(userId);
      const setUserSocket = setUser?.currentSocket as Socket;

      if (setUser && setUserSocket) {
        this.listenToCreateGame(setUserSocket, this.usersData);

        setUserSocket.on(B.disconnect, () => {
          decoupleUser(userId, this.usersData);

          logger
            .dim()
            .italic()
            .color("green")
            .log("User disconnected", [
              ...(this.ioInstance?.of("/").adapter.rooms || []),
            ]);
        });
      }
    }

    logger.info(
      `Client socket [${socket.id}] has connected for user with id [${userId}].`,
      `Total: ${this.ioInstance?.of("/").sockets.size}.`
    );
  }

  /** This method makes the matching Socket instances join the specified rooms. */
  private socketsJoin(
    socketOrRoomId: string | null,
    targetRoomIds: string[],
    namespace?: string
  ) {
    if (!this.ioInstance) {
      throw new Error("No IO instance! (socketsJoin)");
    }

    if (socketOrRoomId === null) {
      // make all Socket instances join provided rooms
      this.ioInstance.socketsJoin(targetRoomIds);
    } else if (socketOrRoomId.includes("game")) {
      // make all Socket instances in the a room X join provided rooms
      this.ioInstance.in(socketOrRoomId).socketsJoin(targetRoomIds);
    } else {
      // make a single Socket join provided rooms
      this.ioInstance.in(socketOrRoomId).socketsJoin(targetRoomIds);
    }
  }

  /** This method makes the matching Socket instances leave the specified rooms. */
  private socketsLeave(
    socketOrRoomId: string | null,
    targetRoomIds: string[],
    namespace?: string
  ) {
    if (!this.ioInstance) {
      throw new Error("No IO instance! (socketsLeave)");
    }

    if (socketOrRoomId === null) {
      // make all Socket instances join provided rooms
      this.ioInstance.socketsLeave(targetRoomIds);
    } else if (socketOrRoomId.includes("game")) {
      // make all Socket instances in the a room X join provided rooms
      this.ioInstance.in(socketOrRoomId).socketsLeave(targetRoomIds);
    } else {
      // make a single Socket join provided rooms
      this.ioInstance.in(socketOrRoomId).socketsLeave(targetRoomIds);
    }
  }

  /** This method makes the matching Socket instances disconnect. */
  private disconnectSockets(socketOrRoomId: string | null, namespace?: string) {
    if (!this.ioInstance) {
      throw new Error("No IO instance! (disconnectSockets)");
    }

    if (socketOrRoomId === null) {
      // make all Socket instances join provided rooms
      this.ioInstance.disconnectSockets();
    } else if (socketOrRoomId.includes("game")) {
      // make all Socket instances in the a room X join provided rooms
      this.ioInstance.in(socketOrRoomId).disconnectSockets();
    } else {
      // make a single Socket join provided rooms
      this.ioInstance.in(socketOrRoomId).disconnectSockets();
    }
  }

  /** TThis method returns the matching Socket instances. */
  async fetchSockets(socketOrRoomId: string | null, namespace?: string) {
    if (!this.ioInstance) {
      throw new Error("No IO instance! (fetchSockets)");
    }

    let sockets: unknown[];

    if (socketOrRoomId === null) {
      // return all Socket instances of the main namespace
      sockets = await this.ioInstance.fetchSockets();
    } else {
      // return all Socket instances in the provided room of the main namespace
      sockets = await this.ioInstance.in(socketOrRoomId).fetchSockets();

      // return all Socket instances in the provided room of the "admin" namespace
      // sockets = await this.ioInstance.of(namespace).in(socketOrRoomId).fetchSockets();

      // return single Socket
      sockets = await this.ioInstance.in(socketOrRoomId).fetchSockets();
    }
  }

  // ## Listeners ##

  /** Listen to room events provided by socket.io library */
  private listenToRoomBasicEvents(): void {
    if (this.ioInstance) {
      this.ioInstance.of("/").adapter.on(B["create-room"], (room) => {
        logger.fontColorLog("magenta", `[ROOM] room ${room} was created.`);
        this.sendActiveGames();
        this.sendActiveUsers();
      });

      this.ioInstance.of("/").adapter.on(B["delete-room"], (room) => {
        logger.fontColorLog("yellow", `[ROOM] room ${room} was deleted.`);
        this.sendActiveGames();
        this.sendActiveUsers();
      });

      this.ioInstance.of("/").adapter.on(B["join-room"], (room, id) => {
        logger.fontColorLog(
          "magenta",
          `[USER] sock ${id} has joined room ${room}.`
        );
        this.sendActiveGames();
        this.sendActiveUsers();
      });

      this.ioInstance.of("/").adapter.on(B["leave-room"], (room, id) => {
        let userId: string | undefined;
        this.usersData.forEach(
          (value: UserSocketSessionDataWithSocket, key) => {
            const socketUserId = id;
            const socketID = value.currentSocket?.id;
            if (socketID === socketUserId) {
              userId = value.userId;
            }

            if (userId) {
              decoupleUser(userId, this.usersData);
            }
          }
        );

        logger.fontColorLog(
          "yellow",
          `[USER] sock ${id} has left room ${room}.`
        );
        this.sendActiveGames();
        this.sendActiveUsers();
      });
    }
  }

  /** Listen to io engine events provided by library */
  private listenToIOEngineEvents(): void {
    if (this.ioInstance) {
      this.ioInstance.engine.on(IOEngineEvent.connection_error, (err: any) => {
        logger.error(err.req); // the request object
        logger.error(err.context); // some additional error context
        logger.error(`[${err.code}]`, IOEngineErrorCode[err.code]);
      });
    }
  }

  private listenToCreateGame(
    socket: Socket,
    usersData: Map<string, UserSocketSessionDataWithSocket>
  ): void {
    console.log("listenToCreateGame");
    socket.on(
      `${S.CLIENT}#${M.user_create_game}`,
      async (event: SocketEvent<Game>) => {
        if (this.ioInstance) {
          const { gameId, createdByUserId, name, connectedSockets } =
            event.payload;

          this.socketsJoin(socket.id, [gameId]);

          const user = usersData.get(createdByUserId);
          if (user) {
            user?.createdGames?.push(gameId);
            user.atGameId = gameId;
            console.log("$#$$#$", gameId);
          }

          const [game] = findAndParseRoomsToGameObjects(
            this.ioInstance,
            gameId
          );
          this.sendCreatedGame(game);

          this.ioInstance.to(gameId).emit("message", "Hello!");
        }
      }
    );
  }

  private listenToUserJoinedGame(socket: Socket) {
    socket.on(
      `${S.CLIENT}#${M.user_joined_game}`,
      async (event: SocketEvent<{ game: Game; userId: string }>) => {
        if (this.ioInstance) {
          const targetGame = event.payload.game;
          const userId = event.payload.userId;
          this.socketsJoin(socket.id, [targetGame.gameId]);
          const user = this.usersData.get(`user:${userId}`);
          if (user) {
            user.atGameId = targetGame.gameId;
            this.sendJoinedGame(targetGame);
            this.sendActiveUsers();

            const messageType: GT = `${targetGame.gameId}_${G.game_broadcast_hello}`;
            this.ioInstance.to(targetGame.gameId).emit(messageType, "Hello!");
          }
        }
      }
    );
  }

  // ## Emissions ##

  private sendActiveUsers(): void {
    if (this.ioInstance) {
      const array: UserSocketSessionDataWithSocketID[] = [];
      this.usersData.forEach((value: UserSocketSessionDataWithSocket, key) => {
        const { userId, createdGames, atGameId } = value;
        array.push({
          userId,
          createdGames,
          atGameId,
          currentSocketId: value.currentSocket?.id,
        });
      });
      this.ioInstance.emit(`${S.SERVER}#${M.send_active_users}`, array);
    }
  }

  private sendActiveGames(): void {
    if (this.ioInstance) {
      const games = findAndParseRoomsToGameObjects(this.ioInstance);
      this.ioInstance.emit(`${S.SERVER}#${M.send_active_games}`, games);
    }
  }

  private sendCreatedGame(game: Game) {
    if (this.ioInstance) {
      this.ioInstance.emit(`${S.SERVER}#${M.user_create_game_response}`, game);
    }
  }

  private sendJoinedGame(game: Game) {
    if (this.ioInstance) {
      this.ioInstance.emit(`${S.SERVER}#${M.user_joined_game_response}`, game);
    }
  }
}
