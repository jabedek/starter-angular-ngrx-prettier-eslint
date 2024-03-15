export function getNextStatus(currentStatus: string | undefined | null) {
  switch (currentStatus) {
    case 'session-created':
      return 'game-entered';
    case 'game-entered':
      return 'game-ready';
    case 'game-ready':
      return 'running';
    case 'running':
      return 'finished';
    case 'finished':
      return 'finished';
    default:
      return 'session-created';
  }
}
