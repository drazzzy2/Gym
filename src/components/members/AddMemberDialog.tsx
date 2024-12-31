import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { AddMemberForm } from './AddMemberForm';

interface AddMemberDialogProps {
  onMemberAdded: () => void;
}

export function AddMemberDialog({ onMemberAdded }: AddMemberDialogProps) {
  const [open, setOpen] = useState(false);

  const handleSuccess = () => {
    setOpen(false);
    onMemberAdded();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-teal-500 hover:bg-teal-600">
          <UserPlus className="mr-2 h-4 w-4" />
          Add Member
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-zinc-900 border-zinc-800">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-white">Add New Member</DialogTitle>
        </DialogHeader>
        <AddMemberForm onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
}