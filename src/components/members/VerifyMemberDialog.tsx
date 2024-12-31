import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FormField } from '@/components/auth/FormField';
import { useToast } from '@/hooks/use-toast';
import { getMemberByUniqueId } from '@/lib/api/members';
import { createCheckIn } from '@/lib/api/checkins';
import { Member } from '@/lib/types';
import { Card } from "@/components/ui/card";
import { CheckCircle2, XCircle } from "lucide-react";
import { formatDate } from '@/lib/utils';

interface VerifyMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function VerifyMemberDialog({ open, onOpenChange, onSuccess }: VerifyMemberDialogProps) {
  const [memberId, setMemberId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [member, setMember] = useState<Member | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const { toast } = useToast();

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberId.trim()) return;
    
    setIsLoading(true);
    setVerificationStatus('idle');
    setMember(null);

    try {
      const verifiedMember = await getMemberByUniqueId(memberId);
      setMember(verifiedMember);
      setVerificationStatus(verifiedMember.status === 'active' ? 'success' : 'error');
    } catch (error) {
      setVerificationStatus('error');
      toast({
        variant: "destructive",
        title: "Verification Failed",
        description: "Member ID not found.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckIn = async () => {
    if (!member) return;
    setIsLoading(true);

    try {
      await createCheckIn(member.id);
      toast({
        title: "Check-in Successful",
        description: `${member.first_name} ${member.last_name} has been checked in.`,
      });
      onSuccess();
      onOpenChange(false);
      setMemberId('');
      setMember(null);
      setVerificationStatus('idle');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to check in. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setMemberId('');
    setMember(null);
    setVerificationStatus('idle');
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[400px] bg-zinc-900 border-zinc-800">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-white">
            Verify Member
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleVerify} className="space-y-4 mt-4">
          <FormField
            id="memberId"
            label="Member ID"
            value={memberId}
            onChange={(e) => setMemberId(e.target.value.toUpperCase())}
            placeholder="M-000000"
            className="font-mono"
          />
          <Button 
            type="submit" 
            className="w-full bg-teal-500 hover:bg-teal-600"
            disabled={isLoading || !memberId.trim()}
          >
            {isLoading ? "Verifying..." : "Verify Member"}
          </Button>
        </form>

        {member && (
          <Card className="mt-6 p-4 bg-zinc-800/50 border-zinc-700/50">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-white">
                  {member.first_name} {member.last_name}
                </h3>
                {verificationStatus === 'success' ? (
                  <CheckCircle2 className="h-5 w-5 text-teal-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Membership Status</span>
                  <span className={`font-medium ${
                    member.status === 'active' ? 'text-teal-500' : 'text-red-500'
                  }`}>
                    {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Plan</span>
                  <span className="text-white">{member.subscription?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Expiry Date</span>
                  <span className="text-white">{formatDate(member.end_date)}</span>
                </div>
              </div>

              {verificationStatus === 'success' ? (
                <Button
                  onClick={handleCheckIn}
                  className="w-full bg-teal-500 hover:bg-teal-600"
                  disabled={isLoading}
                >
                  {isLoading ? "Checking in..." : "Check In"}
                </Button>
              ) : (
                <p className="text-red-400 text-sm text-center">
                  Cannot check in - membership is not active
                </p>
              )}
            </div>
          </Card>
        )}
      </DialogContent>
    </Dialog>
  );
}