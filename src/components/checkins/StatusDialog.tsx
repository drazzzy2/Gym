import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Member } from "@/lib/types";
import { useEffect } from "react";

interface StatusDialogProps {
  member: Member | null;
  isCheckingIn: boolean;
  message: string;
  onClose: () => void;
  isWaiting?: boolean;
  waitingMessage?: string;
}

export function StatusDialog({ 
  member, 
  isCheckingIn, 
  message,
  onClose, 
  isWaiting,
  waitingMessage = "Please wait before scanning another code..."
}: StatusDialogProps) {
  const isActive = member?.status === 'active';

  // Auto-close dialog after 2 seconds if not in waiting state
  useEffect(() => {
    if (member && !isWaiting) {
      const timer = setTimeout(onClose, 2000);
      return () => clearTimeout(timer);
    }
  }, [member, onClose, isWaiting]);

  if (!member && !isWaiting) return null;

  return (
    <Dialog open={!!member || isWaiting} onOpenChange={onClose}>
      <DialogContent className="bg-zinc-900 border-zinc-800">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-white">
            {isWaiting ? "Scanner Cooldown" : "Scan Result"}
          </DialogTitle>
        </DialogHeader>
        
        {isWaiting ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center">
              <Loader2 className="h-8 w-8 text-teal-500 animate-spin" />
            </div>
            <p className="text-center text-white">
              {waitingMessage}
            </p>
          </div>
        ) : member && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-white">
                {member.first_name} {member.last_name}
              </h3>
              {isActive ? (
                <CheckCircle className="h-5 w-5 text-teal-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-zinc-400">Status</span>
                <span className={`font-medium ${
                  isActive ? 'text-teal-500' : 'text-red-500'
                }`}>
                  {message}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Plan</span>
                <span className="text-white">{member.subscription?.name}</span>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}