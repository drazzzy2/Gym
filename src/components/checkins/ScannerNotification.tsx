import { toast } from '@/hooks/use-toast';
import { Member } from '@/lib/types';
import { getScanSuccessNotification, getScanErrorNotification, getCameraErrorNotification } from '@/lib/utils/notification-utils';

export function useScannerNotifications() {
  const showSuccessNotification = (member: Member, isCheckingIn: boolean) => {
    const config = getScanSuccessNotification(member, isCheckingIn);
    toast(config);
  };

  const showErrorNotification = (error: unknown) => {
    const config = getScanErrorNotification(error);
    toast({
      variant: "destructive",
      ...config
    });
  };

  const showCameraErrorNotification = () => {
    const config = getCameraErrorNotification();
    toast({
      variant: "destructive",
      ...config
    });
  };

  return {
    showSuccessNotification,
    showErrorNotification,
    showCameraErrorNotification
  };
}