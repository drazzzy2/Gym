import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getMemberByUniqueId } from '@/lib/api/members';
import { createCheckIn, getActiveCheckIn, checkOut } from '@/lib/api/checkins';
import { Member } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { AutoStatusPopup } from './AutoStatusPopup';
import { SCANNER_TIMING } from '@/lib/utils/scanner-timing';

const qrcodeRegionId = "qr-reader";

export function QRScanner() {
  const [scanning, setScanning] = useState(false);
  const [member, setMember] = useState<Member | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [isCheckingIn, setIsCheckingIn] = useState(true);
  const html5QrCode = useRef<Html5Qrcode | null>(null);
  const processingRef = useRef(false);
  const { toast } = useToast();

  const initializeScanner = async () => {
    if (!html5QrCode.current) {
      html5QrCode.current = new Html5Qrcode(qrcodeRegionId);
    }
    
    try {
      await html5QrCode.current.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1
        },
        handleScan,
        () => {} // Ignore errors during scanning
      );
      setScanning(true);
    } catch (error) {
      setScanning(false);
      toast({
        variant: "destructive",
        title: "Camera Error",
        description: "Please check camera permissions.",
      });
    }
  };

  const stopScanning = async () => {
    if (html5QrCode.current?.isScanning) {
      await html5QrCode.current.stop();
      setScanning(false);
    }
  };

  const processCheckInOut = async (member: Member) => {
    if (!member.status === 'active') {
      toast({
        variant: "destructive",
        title: "Inactive Membership",
        description: "This membership is not active.",
      });
      return;
    }

    try {
      const activeCheckIn = await getActiveCheckIn(member.id);
      const isCheckinAction = !activeCheckIn;
      setIsCheckingIn(isCheckinAction);

      if (isCheckinAction) {
        await createCheckIn(member.id);
        toast({
          title: "Checked In",
          description: `Welcome, ${member.first_name}!`,
        });
      } else {
        await checkOut(activeCheckIn.id);
        toast({
          title: "Checked Out",
          description: `Goodbye, ${member.first_name}!`,
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to process check-in/out.",
      });
    }
  };

  const handleScan = async (decodedText: string) => {
    if (processingRef.current) return;
    processingRef.current = true;

    try {
      if (html5QrCode.current) {
        await html5QrCode.current.stop();
      }

      const verifiedMember = await getMemberByUniqueId(decodedText);
      setMember(verifiedMember);
      setShowPopup(true);

      // Process check-in/out after a small delay
      setTimeout(async () => {
        await processCheckInOut(verifiedMember);
        
        // Auto-hide popup after display duration
        setTimeout(() => {
          setShowPopup(false);
          setMember(null);
          processingRef.current = false;
          if (scanning) {
            initializeScanner();
          }
        }, SCANNER_TIMING.STATUS_DISPLAY_MS);
      }, SCANNER_TIMING.PROCESSING_DELAY_MS);
      
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Verification Failed",
        description: "Invalid QR code or member not found.",
      });
      processingRef.current = false;
      if (scanning) {
        initializeScanner();
      }
    }
  };

  useEffect(() => {
    if (scanning) {
      initializeScanner();
    }
    return () => {
      stopScanning();
    };
  }, [scanning]);

  return (
    <>
      <Card className="p-6 bg-zinc-800/50 border-zinc-700/50">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-white">QR Code Scanner</h3>
            <Button
              onClick={() => setScanning(!scanning)}
              variant={scanning ? "destructive" : "default"}
              className={scanning ? "bg-red-500 hover:bg-red-600" : "bg-teal-500 hover:bg-teal-600"}
            >
              {scanning ? "Stop Scanning" : "Start Scanning"}
            </Button>
          </div>

          <div className="relative mx-auto overflow-hidden rounded-lg bg-black" 
               style={{ aspectRatio: '1/1', maxWidth: '500px' }}>
            <div id={qrcodeRegionId} className="w-full h-full" />
          </div>

          {!scanning && (
            <p className="text-center text-zinc-400">
              Click "Start Scanning" to scan a member's QR code
            </p>
          )}
        </div>
      </Card>

      <AutoStatusPopup
        member={member}
        isOpen={showPopup}
        isCheckingIn={isCheckingIn}
      />
    </>
  );
}