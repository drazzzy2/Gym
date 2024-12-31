import { useState, useCallback, useRef } from 'react';
import { useToast } from './use-toast';
import { getMemberByUniqueId } from '@/lib/api/members';
import { createCheckIn, getActiveCheckIn, checkOut } from '@/lib/api/checkins';
import { isValidQRCode, calculateQRPosition } from '@/lib/utils/qr-scanner';
import { SCANNER_CONFIG } from '@/lib/utils/scanner-config';
import { updateScannerStatus, canProcessScan } from '@/lib/utils/scanner-state';

export type ScannerStatus = 'idle' | 'active' | 'inactive' | 'loading' | 'positioning';

export function useScannerLogic() {
  const [scannerStatus, setScannerStatus] = useState<ScannerStatus>('idle');
  const [positioningMessage, setPositioningMessage] = useState<string>('');
  const [confidence, setConfidence] = useState(0);
  const lastScanRef = useRef<string>('');
  const processingRef = useRef(false);
  const scanAttemptsRef = useRef(0);
  const lastScanTimeRef = useRef<number>(0);
  const confidenceThresholdRef = useRef(0.7); // Minimum confidence required
  const { toast } = useToast();

  const resetScanner = useCallback(() => {
    setScannerStatus('idle');
    setPositioningMessage('');
    setConfidence(0);
    lastScanRef.current = '';
    processingRef.current = false;
    scanAttemptsRef.current = 0;
  }, []);

  const handleScanResult = async (result: any) => {
    if (!result?.text) return;

    // Check cooldown period and duplicate scans
    if (!canProcessScan(
      lastScanTimeRef.current,
      SCANNER_CONFIG.COOLDOWN_MS,
      lastScanRef.current,
      result.text
    )) {
      return;
    }

    // Skip position check if we're already processing
    if (!processingRef.current) {
      const position = calculateQRPosition(result);
      setConfidence(position.confidence);

      if (!position.isGoodPosition || position.confidence < confidenceThresholdRef.current) {
        updateScannerStatus(setScannerStatus, 'positioning');
        setPositioningMessage(position.message || 'Adjust QR code position');
        return;
      }
    }

    if (!isValidQRCode(result.text)) {
      scanAttemptsRef.current++;
      if (scanAttemptsRef.current >= SCANNER_CONFIG.MIN_ATTEMPTS) {
        toast({
          variant: "destructive",
          title: "Invalid QR Code",
          description: "Please ensure you're scanning a valid member QR code.",
          duration: 2000,
        });
        scanAttemptsRef.current = 0;
      }
      return;
    }

    // Update scan tracking
    lastScanTimeRef.current = Date.now();
    lastScanRef.current = result.text;

    // Prevent concurrent processing of the same code
    if (processingRef.current) return;
    processingRef.current = true;
    
    try {
      updateScannerStatus(setScannerStatus, 'loading');
      const member = await getMemberByUniqueId(result.text);
      
      if (member.status !== 'active') {
        updateScannerStatus(setScannerStatus, 'inactive', SCANNER_CONFIG.RESET_DELAY_MS);
        toast({
          variant: "destructive",
          title: "Invalid Membership",
          description: "This membership is not active.",
          duration: 2000,
        });
        return;
      }

      updateScannerStatus(setScannerStatus, 'active');
      const activeCheckIn = await getActiveCheckIn(member.id);

      if (activeCheckIn) {
        await checkOut(activeCheckIn.id);
        toast({
          title: "Check-out Successful",
          description: `Goodbye, ${member.first_name}!`,
          duration: 2000,
        });
      } else {
        await createCheckIn(member.id);
        toast({
          title: "Check-in Successful",
          description: `Welcome, ${member.first_name}!`,
          duration: 2000,
        });
      }

      // Reset status after successful scan
      updateScannerStatus(setScannerStatus, 'idle', SCANNER_CONFIG.RESET_DELAY_MS);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Scanning Error",
        description: "Please try scanning again.",
        duration: 2000,
      });
      updateScannerStatus(setScannerStatus, 'idle');
    } finally {
      processingRef.current = false;
    }
  };

  return {
    scannerStatus,
    positioningMessage,
    confidence,
    handleScanResult,
    resetScanner
  };
}