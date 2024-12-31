import { Member } from '@/lib/types';

interface MembershipStatusProps {
  member: Member;
}

export function MembershipStatus({ member }: MembershipStatusProps) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-zinc-400">Membership Status</span>
      <span className={`
        px-2 py-1 rounded-full text-xs font-medium
        ${member.status === 'active' 
          ? 'bg-teal-500/10 text-teal-500' 
          : 'bg-red-500/10 text-red-500'
        }
      `}>
        {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
      </span>
    </div>
  );
}