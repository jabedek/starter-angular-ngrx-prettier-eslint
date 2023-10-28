import { Server } from "socket.io";
import { CustomSocketEmitter } from "../../../../system-shared/custom-emitter";
import { M, S } from "../../../../system-shared/models/socket-events.model";
import { Game } from "../../../../system-shared/models/specific-events.model";
import { findAndParseRoomsToGameObjects } from "../utils/socket-helpers";

export class SocketEmitterService {
  static __inits = 0;
  private static socketEmitter = new CustomSocketEmitter(S.SERVER);
  private static ioInstance: Server;

  public static init(ioInstance: Server) {
    SocketEmitterService.ioInstance = ioInstance;
    SocketEmitterService.__inits++;
    console.log("inits", SocketEmitterService.__inits);
  }

  public static sendActiveGames(message?: M): void {
    const rooms = findAndParseRoomsToGameObjects(
      SocketEmitterService.ioInstance
    );
    console.log("sendActiveGames", rooms);

    SocketEmitterService.ioInstance.emit(
      `${S.SERVER}#${message || M.send_active_games}`,
      rooms
    );
  }

  public static sendCreatedGame(game: Game) {
    console.log("sendCreatedGame");

    SocketEmitterService.ioInstance.emit(
      `${S.SERVER}#${M.user_create_game_response}`,
      game
    );

    SocketEmitterService.sendActiveGames();
  }
}
