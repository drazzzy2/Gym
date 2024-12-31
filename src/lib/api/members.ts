import { supabase } from '../supabase';
import { Member } from '../types';

export async function getMembers() {
  const { data: { user } } = await supabase.auth.getUser();
  
  const { data, error } = await supabase
    .from('members')
    .select(`
      *,
      subscription:subscriptions(*)
    `)
    .eq('user_id', user?.id)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Member[];
}

export async function getMember(id: string) {
  const { data: { user } } = await supabase.auth.getUser();
  
  const { data, error } = await supabase
    .from('members')
    .select(`
      *,
      subscription:subscriptions(*)
    `)
    .eq('id', id)
    .eq('user_id', user?.id)
    .single();

  if (error) throw error;
  return data as Member;
}

export async function getMemberByUniqueId(uniqueId: string) {
  const { data: { user } } = await supabase.auth.getUser();
  
  const { data, error } = await supabase
    .from('members')
    .select(`
      *,
      subscription:subscriptions(*)
    `)
    .eq('unique_id', uniqueId)
    .eq('user_id', user?.id)
    .single();

  if (error) throw error;
  return data as Member;
}

export async function createMember(member: Omit<Member, 'id' | 'created_at' | 'updated_at' | 'unique_id'>) {
  const { data: { user } } = await supabase.auth.getUser();
  
  const { data, error } = await supabase
    .from('members')
    .insert([{ ...member, user_id: user?.id }])
    .select()
    .single();

  if (error) throw error;
  return data as Member;
}

export async function updateMember(id: string, updates: Partial<Member>) {
  const { data: { user } } = await supabase.auth.getUser();
  
  const { data, error } = await supabase
    .from('members')
    .update(updates)
    .eq('id', id)
    .eq('user_id', user?.id)
    .select()
    .single();

  if (error) throw error;
  return data as Member;
}

export async function deleteMember(id: string) {
  const { data: { user } } = await supabase.auth.getUser();
  
  const { error } = await supabase
    .from('members')
    .delete()
    .eq('id', id)
    .eq('user_id', user?.id);

  if (error) throw error;
}