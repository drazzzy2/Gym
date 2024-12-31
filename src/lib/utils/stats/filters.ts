import { Member } from '@/lib/types';

export function getActiveMembers(members: Member[]): Member[] {
  return members.filter(m => m.status === 'active');
}

export function getInactiveMembers(members: Member[]): Member[] {
  return members.filter(m => m.status === 'inactive' || m.status === 'expired');
}

export function getNewMembers(members: Member[], currentMonth: number, currentYear: number): Member[] {
  return members.filter(m => {
    const createdDate = new Date(m.created_at);
    return createdDate.getMonth() === currentMonth && 
           createdDate.getFullYear() === currentYear;
  });
}

export function getNonNewMembers(members: Member[], currentMonth: number, currentYear: number): Member[] {
  return members.filter(m => {
    const createdDate = new Date(m.created_at);
    return createdDate.getMonth() !== currentMonth || 
           createdDate.getFullYear() !== currentYear;
  });
}

export function getMembersUpForRenewal(members: Member[], months: number = 3): Member[] {
  const now = new Date();
  const threeMonthsAgo = new Date(now.setMonth(now.getMonth() - months));
  
  return members.filter(m => {
    const endDate = new Date(m.end_date);
    return endDate >= threeMonthsAgo && endDate <= now;
  });
}