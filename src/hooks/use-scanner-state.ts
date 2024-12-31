import { useState, useCallback, useRef } from 'react';
import { SCANNER_CONSTANTS, SCANNER_STATES, ScannerState } from '@/lib/utils/scanner-constants';

interface ScannerStateHook {
  state: ScannerState;
  cooldownTime: number;
  isProcessing: boolean;
  canScan: boolean;
  startCooldown: () => void;
  resetState: () => void;
}

export function useScannerState(): ScannerStateHook {
  const [state, setState] = useState<ScannerState>(SCANNER_STATES.IDLE);
  const [cooldownTime, setCooldownTime] = useState(0);
  const cooldownInterval = useRef<number | null>(null);
  const isProcessing = useRef(false);

  const resetState = useCallback(() => {
    setState(SCANNER_STATES.IDLE);
    setCooldownTime(0);
    if (cooldownInterval.current) {
      clearInterval(cooldownInterval.current);
      cooldownInterval.current = null;
    }
    isProcessing.current = false;
  }, []);

  const startCooldown = useCallback(() => {
    setState(SCANNER_STATES.COOLDOWN);
    isProcessing.current = true;
    let timeLeft = SCANNER_CONSTANTS.COOLDOWN_MS;
    setCooldownTime(timeLeft);

    if (cooldownInterval.current) {
      clearInterval(cooldownInterval.current);
    }

    cooldownInterval.current = window.setInterval(() => {
      timeLeft -= 100; // Update every 100ms
      setCooldownTime(timeLeft);

      if (timeLeft <= 0) {
        resetState();
      }
    }, 100);

    return () => {
      if (cooldownInterval.current) {
        clearInterval(cooldownInterval.current);
      }
    };
  }, [resetState]);

  return {
    state,
    cooldownTime,
    isProcessing: isProcessing.current,
    canScan: state === SCANNER_STATES.IDLE,
    startCooldown,
    resetState,
  };
}