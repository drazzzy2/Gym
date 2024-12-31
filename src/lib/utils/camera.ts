import QrScanner from 'react-qr-scanner';

export async function captureFrame(videoElement: HTMLVideoElement): Promise<string | null> {
  const canvas = document.createElement('canvas');
  canvas.width = videoElement.videoWidth;
  canvas.height = videoElement.videoHeight;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  
  ctx.drawImage(videoElement, 0, 0);
  return canvas.toDataURL('image/jpeg', 0.8);
}

export function getVideoElement(scanner: QrScanner | null): HTMLVideoElement | null {
  if (!scanner) return null;
  const video = scanner.el as HTMLVideoElement;
  return video.readyState === video.HAVE_ENOUGH_DATA ? video : null;
}