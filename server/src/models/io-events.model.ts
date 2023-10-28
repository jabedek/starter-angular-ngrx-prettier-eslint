export enum IOEvent {
  connection = "connection",
}

export enum IOEngineEvent {
  connection_error = "connection_error",
  initial_headers = "initial_headers",
  headers = "headers",
}

export enum IOEngineErrorCode {
  "Transport unknown",
  "Session ID unknown",
  "Bad handshake method",
  "Bad request",
  "Forbidden",
  "Unsupported protocol version",
}
