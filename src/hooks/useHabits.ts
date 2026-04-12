import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Habit {
  id: string;
  name: string;
  icon: string;
  completed: boolean;
  reminder: boolean;
  streak: number;
  lastCompletedDate: string | null;
  completionHistory: string[];
  frequency: string;
}

const todayStr = () => new Date().toISOString().slice(0, 10);
const yesterdayStr = () => new Date(Date.now() - 86400000).toISOString().slice(0, 10);

const mapRow = (row: any): Habit => {
  const history: string[] = Array.isArray(row.completion_history) ? row.completion_history : [];
  return {
    id: row.id,
    name: row.name,
    icon: row.icon,
    completed: row.completed,
    reminder: row.reminder,
    streak: row.streak,
    lastCompletedDate: row.last_completed_date,
    completionHistory: history,
    frequency: row.frequency || 'daily',
  };
};

export const useHabits = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch habits from DB
  const fetchHabits = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { setLoading(false); return; }

    const { data, error } = await supabase
      .from('habits')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Failed to load habits:', error);
      setLoading(false);
      return;
    }

    const today = todayStr();
    const yesterday = yesterdayStr();
    const mapped = (data || []).map(mapRow);

    // Reset daily completion & streaks for a new day
    const needsReset = mapped.filter(h => h.completed && h.lastCompletedDate !== today);
    if (needsReset.length > 0) {
      await Promise.all(needsReset.map(async (h) => {
        const streakBroken = h.lastCompletedDate !== yesterday && h.lastCompletedDate !== today;
        await supabase.from('habits').update({
          completed: false,
          streak: streakBroken ? 0 : h.streak,
        }).eq('id', h.id);
      }));
      // Re-fetch after reset
      const { data: freshData } = await supabase
        .from('habits')
        .select('*')
        .order('created_at', { ascending: true });
      setHabits((freshData || []).map(mapRow));
    } else {
      setHabits(mapped);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchHabits();
  }, [fetchHabits]);

  const toggleHabit = useCallback(async (id: string) => {
    const habit = habits.find(h => h.id === id);
    if (!habit) return;

    const nowCompleted = !habit.completed;
    const today = todayStr();
    const yesterday = yesterdayStr();

    let streak = habit.streak;
    let history = [...habit.completionHistory];

    if (nowCompleted) {
      if (!history.includes(today)) history.push(today);
      streak = habit.lastCompletedDate === yesterday ? habit.streak + 1 : 1;
    } else {
      history = history.filter(d => d !== today);
      streak = Math.max(0, habit.streak - 1);
    }

    const updates = {
      completed: nowCompleted,
      streak,
      last_completed_date: nowCompleted ? today : habit.lastCompletedDate,
      completion_history: history,
    };

    // Optimistic update
    setHabits(prev => prev.map(h => h.id === id ? {
      ...h,
      completed: nowCompleted,
      streak,
      lastCompletedDate: nowCompleted ? today : h.lastCompletedDate,
      completionHistory: history,
    } : h));

    const { error } = await supabase.from('habits').update(updates).eq('id', id);
    if (error) {
      toast.error('Failed to update habit');
      fetchHabits(); // rollback
    }
  }, [habits, fetchHabits]);

  const addHabit = useCallback(async (name: string, icon: string): Promise<string | null> => {
    const trimmed = name.trim();
    if (!trimmed) return 'Habit name cannot be empty';
    if (habits.some(h => h.name.toLowerCase() === trimmed.toLowerCase())) {
      return `"${trimmed}" already exists`;
    }

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return 'Not authenticated';

    const { error } = await supabase.from('habits').insert({
      user_id: session.user.id,
      name: trimmed,
      icon,
    });

    if (error) {
      console.error(error);
      return 'Failed to add habit';
    }

    await fetchHabits();
    return null;
  }, [habits, fetchHabits]);

  const toggleReminder = useCallback(async (id: string) => {
    const habit = habits.find(h => h.id === id);
    if (!habit) return;

    setHabits(prev => prev.map(h => h.id === id ? { ...h, reminder: !h.reminder } : h));

    const { error } = await supabase.from('habits').update({ reminder: !habit.reminder }).eq('id', id);
    if (error) {
      toast.error('Failed to update reminder');
      fetchHabits();
    }
  }, [habits, fetchHabits]);

  const deleteHabit = useCallback(async (id: string) => {
    setHabits(prev => prev.filter(h => h.id !== id));

    const { error } = await supabase.from('habits').delete().eq('id', id);
    if (error) {
      toast.error('Failed to delete habit');
      fetchHabits();
    }
  }, [fetchHabits]);

  const editHabit = useCallback(async (id: string, name: string, icon: string) => {
    setHabits(prev => prev.map(h => h.id === id ? { ...h, name, icon } : h));

    const { error } = await supabase.from('habits').update({ name, icon }).eq('id', id);
    if (error) {
      toast.error('Failed to edit habit');
      fetchHabits();
    }
  }, [fetchHabits]);

  const completed = habits.filter(h => h.completed).length;

  return { habits, completed, loading, toggleHabit, addHabit, toggleReminder, deleteHabit, editHabit };
};
