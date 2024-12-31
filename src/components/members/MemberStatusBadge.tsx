interface MemberStatusBadgeProps {
  status: 'active' | 'inactive' | 'expired';
}

export function MemberStatusBadge({ status }: MemberStatusBadgeProps) {
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-500/10 text-teal-500">
      {status}
    </span>
  );
}