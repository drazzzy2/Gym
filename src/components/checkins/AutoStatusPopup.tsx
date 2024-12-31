import { Dialog, DialogContent } from "@/components/ui/dialog";
import { CheckCircle, XCircle, LogIn, LogOut } from "lucide-react";
import { Member } from "@/lib/types";

interface AutoStatusPopupProps {
  member: Member | null;
  isOpen: boolean;
  isCheckingIn: boolean;
}

export function AutoStatusPopup({ member, isOpen, isCheckingIn }: AutoStatusPopupProps) {
  if (!member) return null;
  const isActive = member.status === 'active';

  return (
    <Dialog open={isOpen}>
      <DialogContent className="bg-zinc-900/95 border-zinc-800 p-6">
        <div className="flex flex-col items-center space-y-4">
          {isActive ? (
            <CheckCircle className="h-12 w-12 text-teal-500" />
          ) : (
            <XCircle className="h-12 w-12 text-red-500" />
          )}
          
          <h3 className="text-xl font-semibold text-white text-center">
            {member.first_name} {member.last_name}
          </h3>

          {isActive ? (
            <div className="flex items-center space-x-2 text-teal-500">
              {isCheckingIn ? (
                <>
                  <LogIn className="h-5 w-5" />
                  <span>Checking in...</span>
                </>
              ) : (
                <>
                  <LogOut className="h-5 w-5" />
                  <span>Checking out...</span>
                </>
              )}
            </div>
          ) : (
            <p className="text-red-400">Membership not active</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}