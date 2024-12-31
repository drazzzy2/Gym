import { useState } from 'react';
import { DashboardHeader } from "@/components/dashboard/layout/DashboardHeader";
import { DashboardCard } from "@/components/dashboard/cards/DashboardCard";
import { StatCard } from "@/components/dashboard/stats/StatCard";
import { RevenueCard } from "@/components/dashboard/stats/revenue/RevenueCard";
import { MembershipProgress } from "@/components/dashboard/stats/MembershipProgress";
import { MembershipTrends } from "@/components/dashboard/charts/MembershipTrends";
import { TodayCheckIns } from "@/components/dashboard/checkins/TodayCheckIns";
import { VerifyMemberDialog } from "@/components/members/VerifyMemberDialog";
import { useDashboardStats } from "@/hooks/use-dashboard-stats";
import { useMembers } from "@/hooks/use-members";
import { Users, UserPlus, UserMinus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export function DashboardHome() {
  const { stats, isLoading } = useDashboardStats();
  const { members } = useMembers();
  const [isVerifyDialogOpen, setIsVerifyDialogOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-48 bg-zinc-800" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32 bg-zinc-800" />
          ))}
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {[...Array(2)].map((_, i) => (
            <Skeleton key={i} className="h-[400px] bg-zinc-800" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className="space-y-6"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <DashboardHeader onVerifyMember={() => setIsVerifyDialogOpen(true)} />

      <motion.div 
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
        variants={item}
      >
        <StatCard
          title="Total Members"
          value={stats.totalMembers}
          icon={Users}
          trend={stats.memberTrends}
          description="All registered members"
        />
        <StatCard
          title="Active Members"
          value={stats.activeMembers}
          icon={UserPlus}
          trend={stats.activeTrends}
          description="Currently active memberships"
        />
        <RevenueCard />
        <StatCard
          title="Expired Members"
          value={stats.expiredMembers}
          icon={UserMinus}
          trend={stats.expiredTrends}
          description="Potential for reactivation"
        />
      </motion.div>

      {/* Rest of the component remains unchanged */}
    </motion.div>
  );
}