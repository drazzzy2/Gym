import { useMemo } from 'react';
import { Member } from '@/lib/types';

interface MonthlyData {
  month: string;
  members: number;
}

export function useMembershipData(members: Member[]): MonthlyData[] {
  return useMemo(() => {
    return members.reduce((acc: MonthlyData[], member) => {
      const date = new Date(member.created_at);
      const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
      
      const existingMonth = acc.find(item => item.month === monthYear);
      if (existingMonth) {
        existingMonth.members += 1;
      } else {
        acc.push({ month: monthYear, members: 1 });
      }
      
      return acc;
    }, []);
  }, [members]);
}