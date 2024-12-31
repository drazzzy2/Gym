import { Member } from '@/lib/types';

export function getActiveMembers(members: Member[]): Member[] {
  return members.filter(m => m.status === 'active');
}

export function getExpiredMembers(members: Member[]): Member[] {
  return members.filter(m => m.status === 'expired');
}

export function getNewMembers(members: Member[], currentMonth: number, currentYear: number): Member[] {
  return members.filter(m => {
    const createdDate = new Date(m.created_at);
    return createdDate.getMonth() === currentMonth && 
           createdDate.getFullYear() === currentYear && 
           m.status === 'active';
  });
}

export function getMembersUpForRenewal(members: Member[], month: number, year: number): Member[] {
  return members.filter(m => {
    const endDate = new Date(m.end_date);
    return endDate.getMonth() === month && 
           endDate.getFullYear() === year;
  });
}

export function getNonNewMembers(members: Member[], currentMonth: number, currentYear: number): Member[] {
  return members.filter(m => {
    const createdDate = new Date(m.created_at);
    return (createdDate.getMonth() !== currentMonth || 
            createdDate.getFullYear() !== currentYear) &&
            m.status === 'active';
  });
}