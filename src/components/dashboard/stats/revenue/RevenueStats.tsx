import { RevenueCard } from "./RevenueCard";
import { useRevenueStats } from '@/hooks/use-revenue-stats';

export function RevenueStats() {
  const { stats, isLoading } = useRevenueStats();

  if (isLoading) {
    return null;
  }

  return (
    <>
      <RevenueCard title="Daily Revenue" amount={stats.daily} />
      <RevenueCard title="Monthly Revenue" amount={stats.monthly} />
      <RevenueCard title="Yearly Revenue" amount={stats.yearly} />
    </>
  );
}