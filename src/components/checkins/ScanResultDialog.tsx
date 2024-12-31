import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";
import { Member } from "@/lib/types";

interface ScanResultDialogProps {
  member: Member | null;
  isActive: boolean;
  isCheckingIn: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export function ScanResultDialog({ 
  member, 
  isActive, 
  isCheckingIn,
  onConfirm, 
  onClose 
}: ScanResultDialogProps) {
  if (!member) return null;

  return (
    <Dialog open={!!member} onOpenChange={onClose}>
      <DialogContent className="bg-zinc-900 border-zinc-800">
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
              <span className="text-zinc-400">Membership Status</span>
              <span className={`font-medium ${
                isActive ? 'text-teal-500' : 'text-red-500'
              }`}>
                {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Plan</span>
              <span className="text-white">{member.subscription?.name}</span>
            </div>
          </div>

          {isActive ? (
            <Button
              onClick={onConfirm}
              className="w-full bg-teal-500 hover:bg-teal-600"
            >
              {isCheckingIn ? "Check In" : "Check Out"}
            </Button>
          ) : (
            <p className="text-red-400 text-sm text-center">
              Cannot check in - membership is not active
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}