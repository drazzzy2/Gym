import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface MembershipProgressProps {
  totalCapacity: number;
  currentMembers: number;
  renewalRate: number;
  retentionRate: number;
}

export function MembershipProgress({
  totalCapacity,
  currentMembers,
  renewalRate,
  retentionRate,
}: MembershipProgressProps) {
  // Ensure percentages are properly calculated and capped at 100
  const capacityPercentage = Math.min(Math.round((currentMembers / totalCapacity) * 100), 100);
  const renewalPercentage = Math.min(Math.round(renewalRate), 100);
  const retentionPercentage = Math.min(Math.round(retentionRate), 100);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-zinc-400">Capacity Utilization</span>
          <span className="text-white">{capacityPercentage}%</span>
        </div>
        <Progress value={capacityPercentage} className="bg-zinc-700/50" />
        <p className="text-xs text-zinc-500">{currentMembers} of {totalCapacity} members</p>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-zinc-400">Renewal Rate</span>
          <span className="text-white">{renewalPercentage}%</span>
        </div>
        <Progress value={renewalPercentage} className="bg-zinc-700/50" />
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-zinc-400">Member Retention</span>
          <span className="text-white">{retentionPercentage}%</span>
        </div>
        <Progress value={retentionPercentage} className="bg-zinc-700/50" />
      </div>
    </div>
  );
}