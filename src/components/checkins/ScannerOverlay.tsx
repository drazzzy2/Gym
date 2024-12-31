import { cn } from "@/lib/utils";
import { Loader2, MoveHorizontal, ArrowUpDown, ZoomIn, ZoomOut, Square } from "lucide-react";
import type { ScannerStatus } from '@/hooks/use-scanner-logic';
import { Progress } from "@/components/ui/progress";

interface ScannerOverlayProps {
  status: ScannerStatus;
  positioningMessage?: string;
  confidence: number;
}

export function ScannerOverlay({ status, positioningMessage, confidence }: ScannerOverlayProps) {
  const getIcon = () => {
    if (!positioningMessage) return null;
    switch (positioningMessage.toLowerCase()) {
      case "move closer to the qr code": return <ZoomIn className="h-8 w-8 text-yellow-500" />;
      case "move further from the qr code": return <ZoomOut className="h-8 w-8 text-yellow-500" />;
      case "center the qr code": return <MoveHorizontal className="h-8 w-8 text-yellow-500" />;
      case "align qr code to be more square": return <Square className="h-8 w-8 text-yellow-500" />;
      default: return <ArrowUpDown className="h-8 w-8 text-yellow-500" />;
    }
  };

  return (
    <>
      <div
        className={cn(
          "absolute inset-0 border-2 transition-all duration-300",
          status === 'idle' && "border-teal-500/50 animate-pulse",
          status === 'active' && "border-green-500 border-4",
          status === 'inactive' && "border-red-500 border-4",
          status === 'loading' && "border-yellow-500 border-4",
          status === 'positioning' && "border-yellow-500 border-4"
        )}
      />

      {/* Scanner guides */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-white/20" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-white/10" />
      </div>

      {status !== 'idle' && (
        <div className={cn(
          "absolute inset-0 flex items-center justify-center",
          "bg-black/50 backdrop-blur-sm"
        )}>
          {status === 'loading' ? (
            <div className="flex flex-col items-center space-y-2">
              <Loader2 className="h-8 w-8 text-yellow-500 animate-spin" />
              <div className="text-lg font-semibold px-4 py-2 rounded-lg bg-yellow-500/20 text-yellow-400">
                Verifying...
              </div>
            </div>
          ) : status === 'positioning' ? (
            <div className="flex flex-col items-center space-y-2">
              {getIcon()}
              <div className="text-lg font-semibold px-4 py-2 rounded-lg bg-yellow-500/20 text-yellow-400">
                {positioningMessage}
              </div>
              <div className="w-48">
                <Progress value={confidence * 100} className="h-2 bg-yellow-500/20" />
              </div>
            </div>
          ) : (
            <div className={cn(
              "text-lg font-semibold px-4 py-2 rounded-lg",
              status === 'active' && "bg-green-500/20 text-green-400",
              status === 'inactive' && "bg-red-500/20 text-red-400"
            )}>
              {status === 'active' ? 'Active Member' : 'Inactive Member'}
            </div>
          )}
        </div>
      )}
    </>
  );
}