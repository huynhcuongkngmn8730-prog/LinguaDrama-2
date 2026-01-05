export interface ScriptLine {
  speaker: 'Lukas' | 'Felix';
  german: string;
  stageDirection: string;
  english: string;
}

export interface GeneratedScript {
  topic: string;
  lines: ScriptLine[];
}

export enum AppState {
  IDLE = 'IDLE',
  PROCESSING_TEXT = 'PROCESSING_TEXT',
  REVIEW_SCRIPT = 'REVIEW_SCRIPT',
  PROCESSING_AUDIO = 'PROCESSING_AUDIO',
  PLAYBACK = 'PLAYBACK',
  ERROR = 'ERROR',
}

export interface AudioState {
  buffer: AudioBuffer | null;
  blob: Blob | null;
  url: string | null;
}
