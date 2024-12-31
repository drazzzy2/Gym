import { Dialog, DialogContent } from "@/components/ui/dialog";
import { CheckCircle, XCircle } from "lucide-react";
import { Member } from "@/lib/types";
import { Button } from "@/components/ui/button";

interface StatusPopupProps {
  member: Member | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function StatusPopup({ member, isOpen, onClose, onConfirm }: StatusPopupProps) {
  if (!member) return null;
  const isActive = member.status === 'active';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-zinc-900 border-zinc-800">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-white">
              Member Status
            </h3>
            {isActive ? (
              <CheckCircle className="h-6 w-6 text-teal-500" />
            ) : (
              <XCircle className="h-6 w-6 text-red-500" />
            )}
          </div>

          <div className="space-y-4">
            <div className="pb-4 border-b border-zinc-800">
              <h4 className="text-lg font-medium text-white">
                {member.first_name} {member.last_name}
              </h4>
              <p className="text-zinc-400">{member.email}</p>
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
                Check In
              </Button>
            ) : (
              <p className="text-red-400 text-sm text-center">
                Cannot check in - membership is not active
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}