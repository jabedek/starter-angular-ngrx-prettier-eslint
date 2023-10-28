import logger from "node-color-log";
import { Server, Socket } from "socket.io";
import { IdGenerator } from "../../../system-shared/helpers/id-gen";
import { IOEvent } from "../../../system-shared/models/io-events.model";
import { B } from "../../../system-shared/models/socket-events.model";
import { UserSocketSessionDataWithSocket } from "../../../system-shared/models/user.model";
import { SocketEmitterService } from "./services/socket-emitter.service";
import { SocketListenerService } from "./services/socket-listener.service";

export type IOInstanceData = {
  started: Date;
  ended: Date | undefined;
  id: string;
  ioInstance: Server;
};

export class SocketHandlerService {
  private ioInstanceData: IOInstanceData | undefined;
  private ioInstance: Server | undefined;
  private usersData = new Map<string, UserSocketSessionDataWithSocket>();

  constructor(http: any, origin: string[]) {
    this.ioInstanceData = this.prepareIOInstance(http, origin);
    this.ioInstance = this.ioInstanceData.ioInstance;
    SocketListenerService.init(this.ioInstanceData.ioInstance);
    SocketEmitterService.init(this.ioInstanceData.ioInstance);

    this.ioInstance.on(IOEvent.connection, (socket: Socket): void => {
      this.coupleSocketListenersToUser(socket);
      SocketEmitterService.sendActiveGames();
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
      this.usersData
        .get(userId)
        ?.currentSocket?.removeAllListeners()
        .disconnect();
      this.usersData.set(userId, socketUserData);

      const setUser = this.usersData.get(userId);
      const setUserSocket = setUser?.currentSocket as Socket;

      if (setUser && setUserSocket) {
        SocketListenerService.listenToCreateGame(setUserSocket, this.usersData);

        setUserSocket.on(B.disconnect, () => {
          this.usersData
            .get(userId)
            ?.currentSocket?.removeAllListeners()
            .disconnect();
          this.usersData.delete(userId);

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
}
