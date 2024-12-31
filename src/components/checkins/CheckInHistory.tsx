import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useCheckIns } from '@/hooks/use-checkins';
import { formatDate, formatTime } from '@/lib/utils';
import { Calendar } from "@/components/ui/calendar";

export function CheckInHistory() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { checkIns, isLoading } = useCheckIns();

  const filteredCheckIns = checkIns.filter(checkIn => {
    const checkInDate = new Date(checkIn.check_in_time);
    return (
      checkInDate.getDate() === selectedDate.getDate() &&
      checkInDate.getMonth() === selectedDate.getMonth() &&
      checkInDate.getFullYear() === selectedDate.getFullYear()
    );
  });

  return (
    <div className="grid md:grid-cols-[300px,1fr] gap-6">
      <Card className="p-6 bg-zinc-800/50 border-zinc-700/50 h-fit">
        <h3 className="text-lg font-medium text-white mb-4">Select Date</h3>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(date) => date && setSelectedDate(date)}
          className="bg-zinc-800/50 border-zinc-700/50 rounded-lg"
        />
      </Card>

      <Card className="bg-zinc-800/50 border-zinc-700/50">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-white">
              Check-in History - {formatDate(selectedDate.toISOString())}
            </h3>
            <span className="text-sm text-zinc-400">
              {filteredCheckIns.length} check-in{filteredCheckIns.length !== 1 ? 's' : ''}
            </span>
          </div>

          {isLoading ? (
            <div className="text-center text-zinc-400 py-8">Loading...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-zinc-700/50">
                  <TableHead className="text-zinc-400">Member ID</TableHead>
                  <TableHead className="text-zinc-400">Name</TableHead>
                  <TableHead className="text-zinc-400">Check-in Time</TableHead>
                  <TableHead className="text-zinc-400">Check-out Time</TableHead>
                  <TableHead className="text-zinc-400">Duration</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCheckIns.map((checkIn) => (
                  <TableRow key={checkIn.id} className="border-zinc-700/50">
                    <TableCell className="font-mono text-zinc-300">
                      {checkIn.member?.unique_id}
                    </TableCell>
                    <TableCell className="text-white">
                      {checkIn.member?.first_name} {checkIn.member?.last_name}
                    </TableCell>
                    <TableCell className="text-zinc-300">
                      {formatTime(checkIn.check_in_time)}
                    </TableCell>
                    <TableCell className="text-zinc-300">
                      {checkIn.check_out_time ? formatTime(checkIn.check_out_time) : '-'}
                    </TableCell>
                    <TableCell className="text-zinc-300">
                      {getDuration(
                        new Date(checkIn.check_in_time),
                        checkIn.check_out_time ? new Date(checkIn.check_out_time) : null
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {filteredCheckIns.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-zinc-400 py-8">
                      No check-ins found for this date
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </Card>
    </div>
  );
}

function getDuration(startTime: Date, endTime: Date | null): string {
  const end = endTime || new Date();
  const diff = end.getTime() - startTime.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}