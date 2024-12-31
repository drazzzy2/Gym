import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FormField } from '@/components/auth/FormField';
import { useToast } from '@/hooks/use-toast';
import { getMemberByUniqueId } from '@/lib/api/members';
import { createCheckIn } from '@/lib/api/checkins';
import { Member } from '@/lib/types';
import { CheckCircle2, XCircle, Search } from "lucide-react";
import { formatDate } from '@/lib/utils';
import { MembershipStatus } from './MembershipStatus';

export function MemberVerification() {
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
      
      if (verifiedMember.status !== 'active') {
        toast({
          variant: "destructive",
          title: "Inactive Membership",
          description: "This membership is not active. Check-in is not allowed.",
        });
      }
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
      if (member.status !== 'active') {
        throw new Error('Cannot check in - membership is not active');
      }

      await createCheckIn(member.id);
      toast({
        title: "Check-in Successful",
        description: `${member.first_name} ${member.last_name} has been checked in.`,
      });
      setMemberId('');
      setMember(null);
      setVerificationStatus('idle');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to check in. Please try again.';
      toast({
        variant: "destructive",
        title: "Error",
        description: message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card className="p-6 bg-zinc-800/50 border-zinc-700/50">
        <h3 className="text-lg font-medium text-white mb-4">Member Verification</h3>
        <form onSubmit={handleVerify} className="space-y-4">
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
            {isLoading ? (
              "Verifying..."
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Verify Member
              </>
            )}
          </Button>
        </form>
      </Card>

      {member && (
        <Card className="p-6 bg-zinc-800/50 border-zinc-700/50">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-white">Member Details</h3>
              {verificationStatus === 'success' ? (
                <CheckCircle2 className="h-5 w-5 text-teal-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
            </div>
            
            <div className="space-y-4">
              <div className="pb-4 border-b border-zinc-700/50">
                <h4 className="text-lg font-medium text-white">
                  {member.first_name} {member.last_name}
                </h4>
                <p className="text-zinc-400">{member.email}</p>
              </div>
              
              <div className="space-y-3 text-sm">
                <MembershipStatus member={member} />
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
          </div>
        </Card>
      )}
    </div>
  );
}