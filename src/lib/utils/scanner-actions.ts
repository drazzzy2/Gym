import { Member } from '@/lib/types';
import { createCheckIn, getActiveCheckIn, checkOut } from '@/lib/api/checkins';

export interface ScanResult {
  member: Member;
  isCheckingIn: boolean;
  message: string;
}

export async function processMemberScan(member: Member): Promise<ScanResult> {
  if (member.status !== 'active') {
    return {
      member,
      isCheckingIn: true,
      message: 'Membership is not active'
    };
  }

  const activeCheckIn = await getActiveCheckIn(member.id);
  const isCheckingIn = !activeCheckIn;

  if (isCheckingIn) {
    await createCheckIn(member.id);
    return {
      member,
      isCheckingIn: true,
      message: `Welcome, ${member.first_name}!`
    };
  } else {
    await checkOut(activeCheckIn.id);
    return {
      member,
      isCheckingIn: false,
      message: `Goodbye, ${member.first_name}!`
    };
  }
}