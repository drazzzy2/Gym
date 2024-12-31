import { useMemo } from 'react';
import { useMembers } from './use-members';
import { MAX_GYM_CAPACITY } from '@/lib/constants';
import { 
  getActiveMembers,
  getExpiredMembers,
  getNewMembers,
  getMembersUpForRenewal,
  getNonNewMembers 
} from '@/lib/utils/stats/member-filters';
import { calculateGrowthPercentage, calculatePercentage } from '@/lib/utils/stats/percentage-utils';
import { calculateMonthlyRevenue } from '@/lib/utils/stats/revenue-calculations';

interface DashboardStats {
  totalMembers: number;
  activeMembers: number;
  expiredMembers: number;
  newMembers: number;
  revenue: number;
  capacityUtilization: number;
  renewalRate: number;
  retentionRate: number;
  memberTrends: { value: number; isPositive: boolean; };
  activeTrends: { value: number; isPositive: boolean; };
  expiredTrends: { value: number; isPositive: boolean; };
}

export function useDashboardStats(): { stats: DashboardStats; isLoading: boolean } {
  const { members, isLoading } = useMembers();
  
  const stats = useMemo(() => {
    if (!members.length) {
      return {
        totalMembers: 0,
        activeMembers: 0,
        expiredMembers: 0,
        newMembers: 0,
        revenue: 0,
        capacityUtilization: 0,
        renewalRate: 0,
        retentionRate: 0,
        memberTrends: { value: 0, isPositive: true },
        activeTrends: { value: 0, isPositive: true },
        expiredTrends: { value: 0, isPositive: true }
      };
    }

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    // Get filtered member lists
    const activeMembers = getActiveMembers(members);
    const expiredMembers = getExpiredMembers(members);
    const newMembers = getNewMembers(members, currentMonth, currentYear);
    const nonNewMembers = getNonNewMembers(members, currentMonth, currentYear);

    // Get last month's stats for trends
    const lastMonthMembers = members.filter(m => {
      const createdDate = new Date(m.created_at);
      return createdDate.getMonth() <= lastMonth && 
             createdDate.getFullYear() <= lastMonthYear;
    });

    const lastMonthActive = getActiveMembers(lastMonthMembers);
    const lastMonthExpired = getExpiredMembers(lastMonthMembers);

    // Calculate trends using the new utility
    const memberTrends = calculateGrowthPercentage(members.length, lastMonthMembers.length);
    const activeTrends = calculateGrowthPercentage(activeMembers.length, lastMonthActive.length);
    const expiredTrends = calculateGrowthPercentage(expiredMembers.length, lastMonthExpired.length);

    // Calculate revenue
    const revenue = calculateMonthlyRevenue(activeMembers);

    // Calculate rates using the new utility
    const capacityUtilization = calculatePercentage(activeMembers.length, MAX_GYM_CAPACITY);

    const membersUpForRenewal = getMembersUpForRenewal(members, currentMonth, currentYear);
    const renewedMembers = membersUpForRenewal.filter(m => m.status === 'active');
    const renewalRate = calculatePercentage(renewedMembers.length, membersUpForRenewal.length);

    const activeNonNewMembers = nonNewMembers.filter(m => m.status === 'active');
    const retentionRate = calculatePercentage(activeNonNewMembers.length, nonNewMembers.length);

    return {
      totalMembers: members.length,
      activeMembers: activeMembers.length,
      expiredMembers: expiredMembers.length,
      newMembers: newMembers.length,
      revenue,
      capacityUtilization,
      renewalRate,
      retentionRate,
      memberTrends,
      activeTrends,
      expiredTrends
    };
  }, [members]);

  return { stats, isLoading };
}