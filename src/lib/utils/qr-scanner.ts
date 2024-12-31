import { QRCode } from 'qrcode';

export interface ScannerConfig {
  minDecodingAttempts: number;
  scanInterval: number;
  rotationAngles: number[];
}

export const DEFAULT_SCANNER_CONFIG: ScannerConfig = {
  minDecodingAttempts: 3,
  scanInterval: 50,
  rotationAngles: [0, 90, 180, 270],
};

export function isValidQRCode(data: string): boolean {
  // Improved regex to be more flexible with different formats
  return /^M-\d{6}$/i.test(data.trim());
}

interface Point {
  x: number;
  y: number;
}

interface QRPosition {
  isGoodPosition: boolean;
  message?: string;
  confidence: number;
}

export function calculateQRPosition(result: any): QRPosition {
  if (!result?.points || result.points.length < 4) {
    return { isGoodPosition: false, confidence: 0 };
  }

  const points: Point[] = result.points;
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  // Calculate QR code dimensions and position
  const width = Math.max(
    Math.abs(points[1].x - points[0].x),
    Math.abs(points[2].x - points[3].x)
  );
  const height = Math.max(
    Math.abs(points[2].y - points[0].y),
    Math.abs(points[3].y - points[1].y)
  );

  // Calculate center point of QR code
  const centerX = points.reduce((sum, p) => sum + p.x, 0) / points.length;
  const centerY = points.reduce((sum, p) => sum + p.y, 0) / points.length;

  // Calculate relative position (0-1)
  const relativeX = centerX / viewportWidth;
  const relativeY = centerY / viewportHeight;

  // Calculate aspect ratio and skew
  const aspectRatio = width / height;
  const isSquare = Math.abs(aspectRatio - 1) < 0.2; // Allow 20% deviation

  // Calculate skew angle
  const angle = Math.atan2(
    points[1].y - points[0].y,
    points[1].x - points[0].x
  ) * (180 / Math.PI);
  const isLevel = Math.abs(angle % 90) < 15; // Allow 15 degrees deviation

  // Size checks with dynamic thresholds
  const viewportMin = Math.min(viewportWidth, viewportHeight);
  const minSize = viewportMin * 0.15; // 15% of viewport
  const maxSize = viewportMin * 0.75; // 75% of viewport
  const isSizeGood = width >= minSize && width <= maxSize && 
                    height >= minSize && height <= maxSize;

  // Position checks with dynamic tolerance
  const tolerance = viewportMin * 0.15; // 15% of viewport
  const targetX = viewportWidth / 2;
  const targetY = viewportHeight / 2;
  const isCentered = Math.abs(centerX - targetX) < tolerance && 
                    Math.abs(centerY - targetY) < tolerance;

  // Calculate confidence score (0-1)
  let confidence = 0;
  confidence += isSquare ? 0.3 : 0;
  confidence += isLevel ? 0.2 : 0;
  confidence += isSizeGood ? 0.3 : 0;
  confidence += isCentered ? 0.2 : 0;

  // Determine position quality and message
  if (!isSquare || !isLevel) {
    return {
      isGoodPosition: false,
      message: "Hold the QR code straight",
      confidence
    };
  }

  if (!isSizeGood) {
    if (width < minSize) {
      return {
        isGoodPosition: false,
        message: "Move closer to the QR code",
        confidence
      };
    }
    return {
      isGoodPosition: false,
      message: "Move further from the QR code",
      confidence
    };
  }

  if (!isCentered) {
    return {
      isGoodPosition: false,
      message: "Center the QR code",
      confidence
    };
  }

  return {
    isGoodPosition: true,
    confidence: 1
  };
}