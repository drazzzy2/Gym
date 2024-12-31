import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, QrCode } from "lucide-react";
import { Member } from '@/lib/types';
import { MemberStatusBadge } from './MemberStatusBadge';
import { MemberQRCode } from './MemberQRCode';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState } from 'react';
import { formatDate } from '@/lib/utils';

interface MemberListProps {
  members: Member[];
  onEdit: (member: Member) => void;
  onDelete: (memberId: string) => void;
}

export function MemberList({ members, onEdit, onDelete }: MemberListProps) {
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow className="border-zinc-700/50">
            <TableHead className="text-zinc-400">Member ID</TableHead>
            <TableHead className="text-zinc-400">Name</TableHead>
            <TableHead className="text-zinc-400">Email</TableHead>
            <TableHead className="text-zinc-400">Status</TableHead>
            <TableHead className="text-zinc-400">Plan</TableHead>
            <TableHead className="text-zinc-400">End Date</TableHead>
            <TableHead className="text-zinc-400">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member) => (
            <TableRow key={member.id} className="border-zinc-700/50">
              <TableCell className="font-mono text-zinc-300">
                {member.unique_id}
              </TableCell>
              <TableCell className="text-white">
                {member.first_name} {member.last_name}
              </TableCell>
              <TableCell className="text-zinc-300">{member.email}</TableCell>
              <TableCell>
                <MemberStatusBadge status={member.status} />
              </TableCell>
              <TableCell className="text-zinc-300">
                {member.subscription?.name}
              </TableCell>
              <TableCell className="text-zinc-300">
                {formatDate(member.end_date)}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedMember(member)}
                    className="h-8 w-8 text-zinc-400 hover:text-white"
                  >
                    <QrCode className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(member)}
                    className="h-8 w-8 text-zinc-400 hover:text-white"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(member.id)}
                    className="h-8 w-8 text-zinc-400 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {members.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-zinc-400 py-8">
                No members found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Dialog open={!!selectedMember} onOpenChange={() => setSelectedMember(null)}>
        <DialogContent className="sm:max-w-[425px] bg-zinc-900 border-zinc-800">
          {selectedMember && (
            <MemberQRCode
              memberId={selectedMember.unique_id}
              firstName={selectedMember.first_name}
              lastName={selectedMember.last_name}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}