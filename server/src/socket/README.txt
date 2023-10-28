
## Short summary
Sockets hold `data`, `rooms` and can emit and listen to events.
socket.room
socket.data.username
socket.emit()
socket.on()

## https://socket.io/docs/v4/server-socket-instance/
Additional attributes
As long as you do not overwrite any existing attribute, you can attach any attribute to the Socket instance and use it later.
socket.user = ...
socket.whatever = ...