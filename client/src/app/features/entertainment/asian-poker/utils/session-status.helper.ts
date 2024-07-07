export function getNextStatus(currentStatus: string | undefined | null) {
  switch (currentStatus) {
    case 'session-created':
      return 'game-created';
    case 'game-created':
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
