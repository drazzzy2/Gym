import { useState, useEffect } from 'react';
import { Member } from '@/lib/types';
import { getMembers } from '@/lib/api/members';
import { useToast } from './use-toast';
import { useAuth } from '@/lib/auth';

export function useMembers() {
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();

  const loadMembers = async () => {
    if (!isAuthenticated) return;
    
    try {
      const data = await getMembers();
      setMembers(data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error loading members",
        description: "Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMembers();
  }, [isAuthenticated, toast]);

  return {
    members,
    isLoading,
    refresh: loadMembers
  };
}