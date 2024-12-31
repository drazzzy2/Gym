import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FormField } from '@/components/auth/FormField';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from '@/hooks/use-toast';
import { createSubscription, updateSubscription } from '@/lib/api/subscriptions';
import { Subscription } from '@/lib/types';

interface AddEditSubscriptionDialogProps {
  subscription?: Subscription;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function AddEditSubscriptionDialog({ 
  subscription, 
  open, 
  onOpenChange,
  onSuccess 
}: AddEditSubscriptionDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: subscription?.name || '',
    price: subscription?.price.toString() || '',
    description: subscription?.description || '',
    duration_months: subscription?.duration_months.toString() || '1'
  });

  const { toast } = useToast();
  const isEditing = !!subscription;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const subscriptionData = {
        name: formData.name,
        price: parseFloat(formData.price),
        description: formData.description,
        duration_months: parseInt(formData.duration_months)
      };

      if (isEditing && subscription) {
        await updateSubscription(subscription.id, subscriptionData);
        toast({
          title: "Success",
          description: "Subscription plan has been updated.",
        });
      } else {
        await createSubscription(subscriptionData);
        toast({
          title: "Success",
          description: "New subscription plan has been created.",
        });
      }
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save subscription plan. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-zinc-900 border-zinc-800">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-white">
            {isEditing ? 'Edit Subscription Plan' : 'New Subscription Plan'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <FormField
            id="name"
            label="Plan Name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g., Monthly Premium"
          />

          <div className="space-y-2">
            <Label htmlFor="price" className="text-white">Price</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">$</span>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={handleChange}
                placeholder="0.00"
                className="pl-8 bg-zinc-800/50 border-zinc-700/50 text-white placeholder:text-zinc-400"
              />
            </div>
          </div>

          <FormField
            id="description"
            label="Description"
            value={formData.description}
            onChange={handleChange}
            placeholder="e.g., Full access including classes and pool"
          />

          <div className="space-y-2">
            <Label htmlFor="duration_months" className="text-white">Duration (months)</Label>
            <Input
              id="duration_months"
              name="duration_months"
              type="number"
              min="1"
              value={formData.duration_months}
              onChange={handleChange}
              className="bg-zinc-800/50 border-zinc-700/50 text-white"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-teal-500 hover:bg-teal-600"
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : (isEditing ? "Update Plan" : "Create Plan")}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}