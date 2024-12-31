import { Html5Qrcode } from 'html5-qrcode';

export async function initializeScanner(
  elementId: string,
  onScan: (text: string) => void,
  onError: (error: string) => void
): Promise<Html5Qrcode> {
  const scanner = new Html5Qrcode(elementId);
  
  try {
    await scanner.start(
      { facingMode: "environment" },
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1
      },
      onScan,
      undefined
    );
    return scanner;
  } catch (err) {
    onError("Could not access camera. Please check permissions.");
    throw err;
  }
}

export async function stopScanner(scanner: Html5Qrcode | null): Promise<void> {
  if (scanner?.isScanning) {
    await scanner.stop();
  }
}

export function formatCountdown(milliseconds: number): string {
  return `${Math.ceil(milliseconds / 1000)}`;
}