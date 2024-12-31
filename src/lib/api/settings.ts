import { supabase } from '../supabase';
import { GymSettings } from '../types/settings';

export async function getGymSettings() {
  const { data: { user } } = await supabase.auth.getUser();
  
  const { data, error } = await supabase
    .from('gym_settings')
    .select('*')
    .eq('user_id', user?.id)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data as GymSettings | null;
}

export async function updateGymSettings(settings: Partial<GymSettings>) {
  const { data: { user } } = await supabase.auth.getUser();
  
  const { data: existingSettings } = await supabase
    .from('gym_settings')
    .select('id')
    .eq('user_id', user?.id)
    .single();

  if (existingSettings) {
    // Update existing settings
    const { data, error } = await supabase
      .from('gym_settings')
      .update({
        ...settings,
        updated_at: new Date().toISOString()
      })
      .eq('id', existingSettings.id)
      .select()
      .single();

    if (error) throw error;
    return data as GymSettings;
  } else {
    // Insert new settings
    const { data, error } = await supabase
      .from('gym_settings')
      .insert([{
        user_id: user?.id,
        ...settings
      }])
      .select()
      .single();

    if (error) throw error;
    return data as GymSettings;
  }
}