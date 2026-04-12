import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Profile {
  displayName: string;
  email: string;
}

export const useProfile = () => {
  const [profile, setProfile] = useState<Profile>({ displayName: '', email: '' });
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { setLoading(false); return; }

    const { data, error } = await supabase
      .from('profiles')
      .select('display_name, email')
      .eq('user_id', session.user.id)
      .maybeSingle();

    if (data) {
      setProfile({
        displayName: data.display_name || '',
        email: data.email || session.user.email || '',
      });
    } else if (!error || error.code === 'PGRST116') {
      // Profile doesn't exist yet (existing user before trigger) — create it
      const name = session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || '';
      const email = session.user.email || '';
      await supabase.from('profiles').insert({
        user_id: session.user.id,
        display_name: name,
        email,
      });
      setProfile({ displayName: name, email });
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchProfile(); }, [fetchProfile]);

  const updateDisplayName = useCallback(async (name: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { error } = await supabase
      .from('profiles')
      .update({ display_name: name.trim() })
      .eq('user_id', session.user.id);

    if (!error) {
      setProfile(prev => ({ ...prev, displayName: name.trim() }));
    }
    return error;
  }, []);

  return { profile, loading, updateDisplayName, refetch: fetchProfile };
};
