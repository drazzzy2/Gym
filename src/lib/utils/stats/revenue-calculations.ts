import { Member } from '@/lib/types';

export function calculateMonthlyRevenue(activeMembers: Member[]): number {
  return activeMembers.reduce((total, member) => {
    return total + (member.subscription?.price || 0);
  }, 0);
}