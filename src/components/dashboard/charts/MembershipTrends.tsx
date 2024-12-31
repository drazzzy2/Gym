import { Card } from "@/components/ui/card";
import { LineChart, Line, CartesianGrid, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Member } from '@/lib/types';
import { ChartAxis } from './ChartAxis';
import { ChartTooltip } from './ChartTooltip';
import { useMembershipData } from '@/hooks/use-membership-data';

interface MembershipTrendsProps {
  members: Member[];
}

export function MembershipTrends({ members }: MembershipTrendsProps) {
  const monthlyData = useMembershipData(members);

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={monthlyData}>
          <defs>
            <linearGradient id="memberGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#14B8A6" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#14B8A6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <ChartAxis 
            xAxisDataKey="month" 
            xAxisLabel="Month"
            yAxisLabel="Members"
          />
          <ChartTooltip />
          <Area
            type="monotone"
            dataKey="members"
            stroke="#14B8A6"
            strokeWidth={2}
            fill="url(#memberGradient)"
            dot={{ fill: '#14B8A6' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}