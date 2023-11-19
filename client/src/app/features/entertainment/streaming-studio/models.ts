// from lib.dom.d.ts

interface MediaTrackSettings {
  // general
  deviceId?: string;
  groupId?: string;
  // video
  aspectRatio?: number;
  facingMode?: string;
  frameRate?: number;
  height?: number;
  width?: number;
  // audio
  autoGainControl?: boolean;
  channelCount?: number;
  echoCancellation?: boolean;
  noiseSuppression?: boolean;
  sampleRate?: number;
  sampleSize?: number;
  // shared screen tracks
  displaySurface?: string;
}
