import { useState, useEffect } from 'react';
import { GymSettings } from '@/lib/types/settings';
import { getGymSettings, updateGymSettings } from '@/lib/api/settings';
import { useToast } from './use-toast';

const DEFAULT_SETTINGS: GymSettings = {
  name: '',
  email: '',
  phone: '',
  description: '',
  address: '',
  city: '',
  state: '',
  zip_code: '',
  country: '',
  max_capacity: 300
};

export function useSettings() {
  const [settings, setSettings] = useState<GymSettings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const loadSettings = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getGymSettings();
      setSettings(data || DEFAULT_SETTINGS);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load settings';
      setError(message);
      toast({
        variant: "destructive",
        title: "Error",
        description: message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateSettings = async (data: Partial<GymSettings>) => {
    try {
      const updatedSettings = await updateGymSettings({
        ...settings,
        ...data
      });
      setSettings(updatedSettings);
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update settings';
      toast({
        variant: "destructive",
        title: "Error",
        description: message,
      });
      return false;
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  return {
    settings,
    isLoading,
    error,
    updateSettings,
    refresh: loadSettings
  };
}