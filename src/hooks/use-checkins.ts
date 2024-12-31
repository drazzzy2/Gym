import { useState, useEffect } from 'react';
import { CheckIn } from '@/lib/types';
import { getTodayCheckIns, createCheckIn, checkOut } from '@/lib/api/checkins';
import { useToast } from './use-toast';

export function useCheckIns() {
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const loadCheckIns = async () => {
    try {
      const data = await getTodayCheckIns();
      setCheckIns(data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error loading check-ins",
        description: "Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCheckIns();
  }, []);

  const handleCheckIn = async (memberId: string) => {
    try {
      await createCheckIn(memberId);
      await loadCheckIns();
      toast({
        title: "Check-in successful",
        description: "Member has been checked in.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error checking in",
        description: "Please try again.",
      });
    }
  };

  const handleCheckOut = async (checkInId: string) => {
    try {
      await checkOut(checkInId);
      await loadCheckIns();
      toast({
        title: "Check-out successful",
        description: "Member has been checked out.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error checking out",
        description: "Please try again.",
      });
    }
  };

  return {
    checkIns,
    isLoading,
    checkIn: handleCheckIn,
    checkOut: handleCheckOut,
    refresh: loadCheckIns
  };
}