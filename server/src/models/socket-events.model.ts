export enum Source {
  CLIENT = "CLIENT",
  SERVER = "SERVER",
}

export enum Transmission {
  broadcast = "broadcast",
  unicast = "unicast",
  multicast = "multicast",
}

export enum BasicEvent {
  ["connect"] = "connect",
  ["disconnect"] = "disconnect",
  ["create-room"] = "create-room",
  ["delete-room"] = "delete-room",
  ["join-room"] = "join-room",
  ["leave-room"] = "leave-room",
}

export enum SpecialEvent {
  ["sent-message"] = "sent-message",
}

export class SocketEvent<T = {}> {
  source: Source;
  transmission: Transmission;
  event: BasicEvent | SpecialEvent;
  timestamp: number;
  payload: T;
  constructor(
    source: Source,
    transmission: Transmission,
    event: BasicEvent | SpecialEvent,
    timestamp: number,
    payload: T
  ) {
    this.source = source;
    this.transmission = transmission;
    this.event = event;
    this.timestamp = timestamp;
    this.payload = payload;
  }
}
