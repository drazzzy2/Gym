import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { MemberList } from '@/components/members/MemberList';
import { AddMemberDialog } from '@/components/members/AddMemberDialog';
import { EditMemberDialog } from '@/components/members/EditMemberDialog';
import { useMembers } from '@/hooks/use-members';
import { Member } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { deleteMember } from '@/lib/api/members';

export function MembersPage() {
  const { members, isLoading, refresh } = useMembers();
  const { toast } = useToast();
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [deletingMemberId, setDeletingMemberId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEdit = (member: Member) => {
    setEditingMember(member);
    setIsEditDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingMemberId) return;
    
    setIsDeleting(true);
    try {
      await deleteMember(deletingMemberId);
      toast({
        title: "Success",
        description: "Member has been deleted successfully.",
      });
      refresh();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete member. Please try again.",
      });
    } finally {
      setIsDeleting(false);
      setDeletingMemberId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Members</h2>
          <p className="text-zinc-400">Manage your gym members</p>
        </div>
        <AddMemberDialog onMemberAdded={refresh} />
      </div>

      <Card className="bg-zinc-800/50 border-zinc-700/50">
        <div className="p-6">
          {isLoading ? (
            <div className="text-center text-zinc-400 py-8">Loading...</div>
          ) : (
            <MemberList 
              members={members} 
              onEdit={handleEdit}
              onDelete={(id) => setDeletingMemberId(id)}
            />
          )}
        </div>
      </Card>

      <EditMemberDialog
        member={editingMember}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSuccess={() => {
          setIsEditDialogOpen(false);
          refresh();
        }}
      />

      <AlertDialog open={!!deletingMemberId} onOpenChange={() => setDeletingMemberId(null)}>
        <AlertDialogContent className="bg-zinc-900 border-zinc-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-400">
              Are you sure you want to delete this member? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              className="bg-zinc-800 text-white hover:bg-zinc-700"
              disabled={isDeleting}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600"
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}