import { Users, CreditCard, UserPlus, UserMinus } from "lucide-react";
import { StatsCard } from "./StatsCard";

interface MembershipStatsProps {
  totalMembers: number;
  activeMembers: number;
  newMembers: number;
  revenue: number;
}

export function MembershipStats({ 
  totalMembers, 
  activeMembers, 
  newMembers, 
  revenue 
}: MembershipStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Total Members"
        value={totalMembers}
        icon={Users}
        iconColor="text-blue-500"
        bgColor="bg-blue-500/10"
      />
      <StatsCard
        title="Active Members"
        value={activeMembers}
        icon={UserPlus}
        iconColor="text-teal-500"
        bgColor="bg-teal-500/10"
      />
      <StatsCard
        title="New Members (This Month)"
        value={newMembers}
        icon={UserPlus}
        iconColor="text-purple-500"
        bgColor="bg-purple-500/10"
      />
      <StatsCard
        title="Monthly Revenue"
        value={`$${revenue.toLocaleString()}`}
        icon={CreditCard}
        iconColor="text-amber-500"
        bgColor="bg-amber-500/10"
      />
    </div>
  );
}