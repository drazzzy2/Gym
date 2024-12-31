import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Member } from '@/lib/types';
import { EditMemberForm } from './EditMemberForm';

interface EditMemberDialogProps {
  member: Member | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function EditMemberDialog({ member, open, onOpenChange, onSuccess }: EditMemberDialogProps) {
  if (!member) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-zinc-900 border-zinc-800">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-white">
            Edit Member - {member.unique_id}
          </DialogTitle>
        </DialogHeader>
        <EditMemberForm member={member} onSuccess={onSuccess} />
      </DialogContent>
    </Dialog>
  );
}