// Scanner timing constants
export const SCANNER_CONSTANTS = {
  COOLDOWN_MS: 5000, // 5 second cooldown
  RESULT_DISPLAY_MS: 2000,
} as const;

// Scanner states
export const SCANNER_STATES = {
  IDLE: 'idle',
  SCANNING: 'scanning',
  PROCESSING: 'processing',
  COOLDOWN: 'cooldown',
} as const;

export type ScannerState = typeof SCANNER_STATES[keyof typeof SCANNER_STATES];