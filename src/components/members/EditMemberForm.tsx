import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { FormField } from '@/components/auth/FormField';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSubscriptions } from '@/hooks/use-subscriptions';
import { updateMember } from '@/lib/api/members';
import { useToast } from '@/hooks/use-toast';
import { Member } from '@/lib/types';
import { addMonths } from '@/lib/utils';

interface EditMemberFormProps {
  member: Member;
  onSuccess: () => void;
}

export function EditMemberForm({ member, onSuccess }: EditMemberFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: member.first_name,
    last_name: member.last_name,
    email: member.email,
    phone: member.phone || '',
    subscription_id: member.subscription_id,
    status: member.status,
  });

  const { subscriptions } = useSubscriptions();
  const { toast } = useToast();

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
      const subscription = subscriptions.find(s => s.id === formData.subscription_id);
      if (!subscription) throw new Error('Please select a subscription plan');

      const startDate = new Date();
      const endDate = addMonths(startDate, subscription.duration_months);

      await updateMember(member.id, {
        ...formData,
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
      });

      toast({
        title: "Success",
        description: "Member has been updated successfully.",
      });
      onSuccess();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update member. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
      <div className="grid grid-cols-2 gap-4">
        <FormField
          id="first_name"
          label="First Name"
          value={formData.first_name}
          onChange={handleChange}
          placeholder="John"
        />
        <FormField
          id="last_name"
          label="Last Name"
          value={formData.last_name}
          onChange={handleChange}
          placeholder="Doe"
        />
      </div>

      <FormField
        id="email"
        label="Email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="john@example.com"
      />

      <FormField
        id="phone"
        label="Phone"
        value={formData.phone}
        onChange={handleChange}
        placeholder="+1 (555) 000-0000"
      />

      <div className="space-y-2">
        <label className="text-sm font-medium text-white">
          Status
        </label>
        <Select
          value={formData.status}
          onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as 'active' | 'inactive' | 'expired' }))}
        >
          <SelectTrigger className="bg-zinc-800/50 border-zinc-700/50 text-white">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent className="bg-zinc-800 border-zinc-700">
            <SelectItem 
              value="active"
              className="text-white hover:bg-zinc-700 focus:bg-zinc-700"
            >
              Active
            </SelectItem>
            <SelectItem 
              value="inactive"
              className="text-white hover:bg-zinc-700 focus:bg-zinc-700"
            >
              Inactive
            </SelectItem>
            <SelectItem 
              value="expired"
              className="text-white hover:bg-zinc-700 focus:bg-zinc-700"
            >
              Expired
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-white">
          Subscription Plan
        </label>
        <Select
          value={formData.subscription_id}
          onValueChange={(value) => setFormData(prev => ({ ...prev, subscription_id: value }))}
        >
          <SelectTrigger className="bg-zinc-800/50 border-zinc-700/50 text-white">
            <SelectValue placeholder="Select a plan" />
          </SelectTrigger>
          <SelectContent className="bg-zinc-800 border-zinc-700">
            {subscriptions.map((subscription) => (
              <SelectItem 
                key={subscription.id} 
                value={subscription.id}
                className="text-white hover:bg-zinc-700 focus:bg-zinc-700"
              >
                {subscription.name} - ${subscription.price}/month
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button 
        type="submit" 
        className="w-full bg-teal-500 hover:bg-teal-600"
        disabled={isLoading}
      >
        {isLoading ? "Updating..." : "Update Member"}
      </Button>
    </form>
  );
}