import { Card } from "@/components/ui/card";
import { CheckInsList } from './CheckInsList';
import { useCheckIns } from '@/hooks/use-checkins';

export function TodayCheckIns() {
  const { checkIns, isLoading, checkOut } = useCheckIns();

  return (
    <Card className="bg-zinc-800/50 border-zinc-700/50">
      <div className="p-6">
        <h3 className="text-lg font-medium text-white mb-4">Today's Check-ins</h3>
        {isLoading ? (
          <div className="text-center text-zinc-400 py-8">Loading...</div>
        ) : (
          <CheckInsList checkIns={checkIns} onCheckOut={checkOut} />
        )}
      </div>
    </Card>
  );
}