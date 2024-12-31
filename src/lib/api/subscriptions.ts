import { supabase } from '../supabase';
import { Subscription } from '../types';

export async function getSubscriptions() {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .order('price', { ascending: true });

  if (error) throw error;
  return data as Subscription[];
}

export async function getSubscription(id: string) {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as Subscription;
}

export async function createSubscription(subscription: Omit<Subscription, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('subscriptions')
    .insert([subscription])
    .select()
    .single();

  if (error) throw error;
  return data as Subscription;
}

export async function updateSubscription(id: string, updates: Partial<Subscription>) {
  const { data, error } = await supabase
    .from('subscriptions')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Subscription;
}

export async function deleteSubscription(id: string) {
  const { error } = await supabase
    .from('subscriptions')
    .delete()
    .eq('id', id);

  if (error) throw error;
}