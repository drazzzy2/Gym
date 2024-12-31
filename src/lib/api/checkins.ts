import { supabase } from '../supabase';
import { CheckIn } from '../types';

export async function getTodayCheckIns() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const { data, error } = await supabase
    .from('check_ins')
    .select(`
      *,
      member:members(*)
    `)
    .gte('check_in_time', today.toISOString())
    .order('check_in_time', { ascending: false });

  if (error) throw error;
  return data as CheckIn[];
}

export async function getActiveCheckIn(memberId: string) {
  const { data: member } = await supabase
    .from('members')
    .select('status')
    .eq('id', memberId)
    .single();

  if (member?.status !== 'active') {
    throw new Error('Member is not active');
  }

  const { data, error } = await supabase
    .from('check_ins')
    .select()
    .eq('member_id', memberId)
    .is('check_out_time', null)
    .maybeSingle();

  if (error && error.code !== 'PGRST116') throw error;
  return data as CheckIn | null;
}

export async function createCheckIn(memberId: string) {
  // First verify member is active
  const { data: member } = await supabase
    .from('members')
    .select('status')
    .eq('id', memberId)
    .single();

  if (member?.status !== 'active') {
    throw new Error('Cannot check in - membership is not active');
  }

  // Check if there's an active check-in
  const activeCheckIn = await getActiveCheckIn(memberId);
  if (activeCheckIn) {
    throw new Error('Member already has an active check-in');
  }

  const { data, error } = await supabase
    .from('check_ins')
    .insert([{
      member_id: memberId,
      check_in_time: new Date().toISOString()
    }])
    .select()
    .single();

  if (error) throw error;
  return data as CheckIn;
}

export async function checkOut(checkInId: string) {
  // First verify the member is still active
  const { data: checkIn } = await supabase
    .from('check_ins')
    .select('member_id')
    .eq('id', checkInId)
    .single();

  if (checkIn) {
    const { data: member } = await supabase
      .from('members')
      .select('status')
      .eq('id', checkIn.member_id)
      .single();

    if (member?.status !== 'active') {
      throw new Error('Cannot check out - membership is not active');
    }
  }

  const { data, error } = await supabase
    .from('check_ins')
    .update({ check_out_time: new Date().toISOString() })
    .eq('id', checkInId)
    .select()
    .single();

  if (error) throw error;
  return data as CheckIn;
}