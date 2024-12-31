// Camera utility functions
export function getOptimalResolution(): { width: number; height: number } {
  // Get device pixel ratio for high DPI displays
  const dpr = window.devicePixelRatio || 1;
  const maxDimension = Math.min(window.innerWidth, window.innerHeight) * dpr;
  
  // Round to nearest multiple of 16 for better video encoding
  const dimension = Math.floor(maxDimension / 16) * 16;
  
  return {
    width: dimension,
    height: dimension
  };
}

export function getSupportedConstraints(deviceId?: string) {
  const resolution = getOptimalResolution();
  
  return {
    audio: false,
    video: {
      deviceId: deviceId ? { exact: deviceId } : undefined,
      facingMode: 'environment',
      width: { ideal: resolution.width },
      height: { ideal: resolution.height },
      aspectRatio: { exact: 1 },
      frameRate: { ideal: 30, min: 15 },
      focusMode: { ideal: 'continuous' },
      exposureMode: { ideal: 'continuous' },
      whiteBalanceMode: { ideal: 'continuous' }
    }
  };
}

export async function getBestCamera(): Promise<string | undefined> {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const cameras = devices.filter(device => device.kind === 'videoinput');
    
    // Prefer back camera
    const backCamera = cameras.find(camera => 
      camera.label.toLowerCase().includes('back') ||
      camera.label.toLowerCase().includes('rear')
    );
    
    return backCamera?.deviceId;
  } catch (error) {
    console.error('Error getting cameras:', error);
    return undefined;
  }
}