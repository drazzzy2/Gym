import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useCheckIns } from '@/hooks/use-checkins';
import { formatTime } from '@/lib/utils';
import { LogOut } from "lucide-react";

export function ActiveCheckIns() {
  const { checkIns, isLoading, checkOut } = useCheckIns();
  const activeCheckIns = checkIns.filter(checkIn => !checkIn.check_out_time);

  return (
    <Card className="bg-zinc-800/50 border-zinc-700/50">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-white">Active Check-ins</h3>
          <span className="text-sm text-zinc-400">
            {activeCheckIns.length} member{activeCheckIns.length !== 1 ? 's' : ''} checked in
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
                <TableHead className="text-zinc-400">Duration</TableHead>
                <TableHead className="text-zinc-400">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activeCheckIns.map((checkIn) => (
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
                    {getDuration(new Date(checkIn.check_in_time))}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => checkOut(checkIn.id)}
                      className="text-zinc-400 hover:text-white"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Check Out
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {activeCheckIns.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-zinc-400 py-8">
                    No active check-ins
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </Card>
  );
}

function getDuration(startTime: Date): string {
  const now = new Date();
  const diff = now.getTime() - startTime.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}