import logger from "node-color-log";
import { Server, Socket } from "socket.io";
import {
  IOEngineEvent,
  IOEngineErrorCode,
} from "../../../../system-shared/models/io-events.model";
import {
  B,
  S,
  M,
  SocketEvent,
} from "../../../../system-shared/models/socket-events.model";
import { Game } from "../../../../system-shared/models/specific-events.model";
import { UserSocketSessionDataWithSocket } from "../../../../system-shared/models/user.model";
import { findAndParseRoomsToGameObjects } from "../utils/socket-helpers";
import { SocketEmitterService } from "./socket-emitter.service";

export class SocketListenerService {
  static __inits = 0;
  private static ioInstance: Server;

  public static init(ioInstance: Server) {
    SocketListenerService.ioInstance = ioInstance;
    SocketListenerService.listenToRoomBasicEvents();
    SocketListenerService.listenToIOEngineEvents();
    SocketListenerService.__inits++;
    console.log("inits", SocketListenerService.__inits);
  }

  /** Listen to room events provided by socket.io library */
  static listenToRoomBasicEvents(): void {
    SocketListenerService.ioInstance
      .of("/")
      .adapter.on(B["create-room"], (room) => {
        logger.fontColorLog("magenta", `[ROOM] room ${room} was created.`);
      });

    SocketListenerService.ioInstance
      .of("/")
      .adapter.on(B["delete-room"], (room) => {
        logger.fontColorLog("yellow", `[ROOM] room ${room} was deleted.`);
      });

    SocketListenerService.ioInstance
      .of("/")
      .adapter.on(B["join-room"], (room, id) => {
        logger.fontColorLog(
          "magenta",
          `[ROOM] sock ${id} has joined room ${room}.`
        );
      });

    SocketListenerService.ioInstance
      .of("/")
      .adapter.on(B["leave-room"], (room, id) => {
        logger.fontColorLog(
          "yellow",
          `[ROOM] sock ${id} has left room ${room}.`
        );
      });
  }

  /** Listen to io engine events provided by library */
  static listenToIOEngineEvents(): void {
    SocketListenerService.ioInstance.engine.on(
      IOEngineEvent.connection_error,
      (err: any) => {
        logger.error(err.req); // the request object
        logger.error(err.context); // some additional error context
        logger.error(`[${err.code}]`, IOEngineErrorCode[err.code]);
      }
    );
  }

  static listenToCreateGame(
    socket: Socket,
    usersData: Map<string, UserSocketSessionDataWithSocket>
  ): void {
    console.log("listenToCreateGame");

    socket.on(
      `${S.CLIENT}#${M.user_create_game}`,
      async (event: SocketEvent<Game>) => {
        // console.log(">>", event);

        const { gameId, createdByUserId, name, connectedSockets } =
          event.payload;
        socket.join(gameId);

        const user = usersData.get(createdByUserId);
        if (user) {
          user?.createdGames?.push(gameId);
        }

        const [game] = findAndParseRoomsToGameObjects(
          SocketListenerService.ioInstance,
          gameId
        );
        // console.log(">>>>", game);
        SocketEmitterService.sendCreatedGame(game);

        // SocketListenerService.ioInstance.emit(
        //   `${S.SERVER}#${M.user_create_game_response}`,
        //   game
        // );

        // sendActiveGames(SocketListenerService.ioInstance);
      }
    );
  }
}
