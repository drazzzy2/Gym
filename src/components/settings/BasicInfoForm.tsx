import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FormField } from '@/components/auth/FormField';
import { useToast } from '@/hooks/use-toast';
import { GymSettings } from '@/lib/types/settings';

interface BasicInfoFormProps {
  settings: GymSettings;
  onSave: (data: Partial<GymSettings>) => Promise<boolean>;
}

export function BasicInfoForm({ settings, onSave }: BasicInfoFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: settings.name || '',
    email: settings.email || '',
    phone: settings.phone || '',
    description: settings.description || '',
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await onSave(formData);
      if (success) {
        toast({
          title: "Success",
          description: "Basic information has been updated.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6 bg-zinc-800/50 border-zinc-700/50">
      <h3 className="text-lg font-medium text-white mb-4">Basic Information</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          id="name"
          label="Gym Name"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          placeholder="My Awesome Gym"
        />
        <FormField
          id="email"
          label="Contact Email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          placeholder="contact@mygym.com"
        />
        <FormField
          id="phone"
          label="Contact Phone"
          value={formData.phone}
          onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
          placeholder="+1 (555) 000-0000"
        />
        <FormField
          id="description"
          label="Description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="A brief description of your gym"
        />
        <Button 
          type="submit" 
          className="w-full bg-teal-500 hover:bg-teal-600"
          disabled={isLoading}
        >
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </Card>
  );
}