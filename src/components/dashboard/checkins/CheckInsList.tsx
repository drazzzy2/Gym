import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { CheckIn } from '@/lib/types';
import { formatDate } from '@/lib/utils';

interface CheckInsListProps {
  checkIns: CheckIn[];
  onCheckOut: (checkInId: string) => void;
}

export function CheckInsList({ checkIns, onCheckOut }: CheckInsListProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="border-zinc-700/50">
          <TableHead className="text-zinc-400">Member ID</TableHead>
          <TableHead className="text-zinc-400">Name</TableHead>
          <TableHead className="text-zinc-400">Check-in Time</TableHead>
          <TableHead className="text-zinc-400">Check-out Time</TableHead>
          <TableHead className="text-zinc-400">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {checkIns.map((checkIn) => (
          <TableRow key={checkIn.id} className="border-zinc-700/50">
            <TableCell className="text-zinc-300">
              {checkIn.member?.unique_id}
            </TableCell>
            <TableCell className="text-white">
              {checkIn.member?.first_name} {checkIn.member?.last_name}
            </TableCell>
            <TableCell className="text-zinc-300">
              {new Date(checkIn.check_in_time).toLocaleTimeString()}
            </TableCell>
            <TableCell className="text-zinc-300">
              {checkIn.check_out_time 
                ? new Date(checkIn.check_out_time).toLocaleTimeString()
                : '-'}
            </TableCell>
            <TableCell>
              {!checkIn.check_out_time && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onCheckOut(checkIn.id)}
                  className="text-zinc-400 hover:text-white"
                >
                  Check Out
                </Button>
              )}
            </TableCell>
          </TableRow>
        ))}
        {checkIns.length === 0 && (
          <TableRow>
            <TableCell colSpan={5} className="text-center text-zinc-400 py-8">
              No check-ins today
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}