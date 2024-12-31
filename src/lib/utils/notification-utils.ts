import { Member } from '../types';

interface NotificationConfig {
  title: string;
  description: string;
  duration: number;
}

export function getScanSuccessNotification(member: Member, isCheckingIn: boolean): NotificationConfig {
  const action = isCheckingIn ? 'checked in' : 'checked out';
  const emoji = isCheckingIn ? '👋' : '👋';
  
  return {
    title: `Successfully ${action}!`,
    description: `${emoji} ${member.first_name} ${member.last_name} has been ${action}`,
    duration: 3000
  };
}

export function getScanErrorNotification(error: unknown): NotificationConfig {
  if (error instanceof Error) {
    if (error.message.includes('already has an active check-in')) {
      return {
        title: 'Already Checked In',
        description: '⚠️ This member is already checked in',
        duration: 3000
      };
    }
  }

  return {
    title: 'Scan Error',
    description: '❌ Please try scanning again',
    duration: 3000
  };
}

export function getCameraErrorNotification(): NotificationConfig {
  return {
    title: 'Camera Error',
    description: '📸 Please check camera permissions',
    duration: 3000
  };
}