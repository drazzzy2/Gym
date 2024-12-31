import { useState, useEffect } from 'react';
import { Subscription } from '@/lib/types';
import { getSubscriptions } from '@/lib/api/subscriptions';
import { useToast } from './use-toast';

export function useSubscriptions() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function loadSubscriptions() {
      try {
        const data = await getSubscriptions();
        setSubscriptions(data);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error loading subscriptions",
          description: "Please try again later.",
        });
      } finally {
        setIsLoading(false);
      }
    }

    loadSubscriptions();
  }, [toast]);

  return { subscriptions, isLoading };
}