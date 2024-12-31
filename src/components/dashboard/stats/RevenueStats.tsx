import { DollarSign } from "lucide-react";
import { StatCard } from "./StatCard";
import { useRevenueStats } from '@/hooks/use-revenue-stats';

export function RevenueStats() {
  const { stats, isLoading } = useRevenueStats();

  if (isLoading) {
    return null;
  }

  return (
    <>
      <StatCard
        title="Daily Revenue"
        value={`$${stats.daily.toLocaleString()}`}
        icon={DollarSign}
      />
      <StatCard
        title="Monthly Revenue"
        value={`$${stats.monthly.toLocaleString()}`}
        icon={DollarSign}
      />
      <StatCard
        title="Yearly Revenue"
        value={`$${stats.yearly.toLocaleString()}`}
        icon={DollarSign}
      />
    </>
  );
}