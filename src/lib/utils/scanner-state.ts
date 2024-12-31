export interface ScannerState {
  isScanning: boolean;
  lastScanTime: number;
}

export const SCANNER_CONSTANTS = {
  COOLDOWN_MS: 3000, // 3 second cooldown
  MIN_SCAN_INTERVAL: 500, // Minimum time between scans
} as const;

export function canProcessScan(lastScanTime: number): boolean {
  const now = Date.now();
  return now - lastScanTime >= SCANNER_CONSTANTS.MIN_SCAN_INTERVAL;
}