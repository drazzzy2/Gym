import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Subscription } from '@/lib/types';
import { SubscriptionList } from '@/components/subscriptions/SubscriptionList';
import { AddEditSubscriptionDialog } from '@/components/subscriptions/AddEditSubscriptionDialog';
import { useSubscriptions } from '@/hooks/use-subscriptions';
import { useToast } from '@/hooks/use-toast';
import { deleteSubscription } from '@/lib/api/subscriptions';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

export function SubscriptionsPage() {
  const { subscriptions, isLoading, refresh } = useSubscriptions();
  const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const handleDelete = async () => {
    if (!deletingId) return;
    
    setIsDeleting(true);
    try {
      await deleteSubscription(deletingId);
      toast({
        title: "Success",
        description: "Subscription plan has been deleted.",
      });
      refresh();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete subscription plan. Please try again.",
      });
    } finally {
      setIsDeleting(false);
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Subscriptions</h2>
          <p className="text-zinc-400">Manage membership plans</p>
        </div>
        <Button 
          onClick={() => {
            setEditingSubscription(null);
            setIsDialogOpen(true);
          }}
          className="bg-teal-500 hover:bg-teal-600"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Plan
        </Button>
      </div>

      <Card className="bg-zinc-800/50 border-zinc-700/50">
        <div className="p-6">
          {isLoading ? (
            <div className="text-center text-zinc-400 py-8">Loading...</div>
          ) : (
            <SubscriptionList 
              subscriptions={subscriptions}
              onEdit={(subscription) => {
                setEditingSubscription(subscription);
                setIsDialogOpen(true);
              }}
              onDelete={(id) => setDeletingId(id)}
            />
          )}
        </div>
      </Card>

      <AddEditSubscriptionDialog
        subscription={editingSubscription || undefined}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSuccess={refresh}
      />

      <AlertDialog open={!!deletingId} onOpenChange={() => setDeletingId(null)}>
        <AlertDialogContent className="bg-zinc-900 border-zinc-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-400">
              Are you sure you want to delete this subscription plan? This action cannot be undone.
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