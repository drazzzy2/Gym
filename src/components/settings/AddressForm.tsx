import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FormField } from '@/components/auth/FormField';
import { useToast } from '@/hooks/use-toast';
import { GymSettings } from '@/lib/types/settings';

interface AddressFormProps {
  settings: GymSettings;
  onSave: (data: Partial<GymSettings>) => Promise<boolean>;
}

export function AddressForm({ settings, onSave }: AddressFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    address: settings.address || '',
    city: settings.city || '',
    state: settings.state || '',
    zip_code: settings.zip_code || '',
    country: settings.country || '',
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
          description: "Address has been updated.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6 bg-zinc-800/50 border-zinc-700/50">
      <h3 className="text-lg font-medium text-white mb-4">Address</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          id="address"
          label="Street Address"
          value={formData.address}
          onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
          placeholder="123 Main St"
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            id="city"
            label="City"
            value={formData.city}
            onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
            placeholder="New York"
          />
          <FormField
            id="state"
            label="State"
            value={formData.state}
            onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
            placeholder="NY"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            id="zip_code"
            label="ZIP Code"
            value={formData.zip_code}
            onChange={(e) => setFormData(prev => ({ ...prev, zip_code: e.target.value }))}
            placeholder="10001"
          />
          <FormField
            id="country"
            label="Country"
            value={formData.country}
            onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
            placeholder="United States"
          />
        </div>
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