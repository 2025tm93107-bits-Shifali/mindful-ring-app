import { useState, useEffect, useCallback } from 'react';

export interface Habit {
  id: string;
  name: string;
  icon: string;
  completed: boolean;
  reminder: boolean;
  streak: number;
  lastCompletedDate: string | null;
  completionHistory: string[]; // array of date strings "YYYY-MM-DD"
}

const STORAGE_KEY = 'habit-tracker-habits';
const DATE_KEY = 'habit-tracker-date';

const todayStr = () => new Date().toISOString().slice(0, 10);
const yesterdayStr = () => new Date(Date.now() - 86400000).toISOString().slice(0, 10);

const loadHabits = (): Habit[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const habits: Habit[] = JSON.parse(raw);

    // Migrate old habits missing completionHistory
    const migrated = habits.map((h) => ({
      ...h,
      completionHistory: h.completionHistory || [],
    }));

    // Reset today's completion if it's a new day
    const savedDate = localStorage.getItem(DATE_KEY);
    const today = todayStr();
    const yesterday = yesterdayStr();

    if (savedDate !== today) {
      localStorage.setItem(DATE_KEY, today);
      return migrated.map((h) => {
        // Reset streak if last completed date wasn't yesterday or today
        const streakBroken = h.lastCompletedDate !== yesterday && h.lastCompletedDate !== savedDate;
        return {
          ...h,
          completed: false,
          streak: streakBroken ? 0 : h.streak,
        };
      });
    }
    return migrated;
  } catch {
    return [];
  }
};

export const useHabits = () => {
  const [habits, setHabits] = useState<Habit[]>(loadHabits);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
    localStorage.setItem(DATE_KEY, todayStr());
  }, [habits]);

  const toggleHabit = useCallback((id: string) => {
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== id) return h;
        const nowCompleted = !h.completed;
        const today = todayStr();
        const yesterday = yesterdayStr();

        let streak = h.streak;
        let history = [...h.completionHistory];

        if (nowCompleted) {
          // Add today to history if not already there
          if (!history.includes(today)) history.push(today);
          // Increment streak: consecutive if yesterday was completed, otherwise start at 1
          streak = h.lastCompletedDate === yesterday ? h.streak + 1 : 1;
        } else {
          // Remove today from history
          history = history.filter((d) => d !== today);
          streak = Math.max(0, h.streak - 1);
        }

        return {
          ...h,
          completed: nowCompleted,
          streak,
          lastCompletedDate: nowCompleted ? today : h.lastCompletedDate,
          completionHistory: history,
        };
      })
    );
  }, []);

  const addHabit = useCallback((name: string, icon: string): string | null => {
    let error: string | null = null;
    setHabits((prev) => {
      const trimmed = name.trim();
      if (!trimmed) {
        error = 'Habit name cannot be empty';
        return prev;
      }
      if (prev.some((h) => h.name.toLowerCase() === trimmed.toLowerCase())) {
        error = `"${trimmed}" already exists`;
        return prev;
      }
      return [
        ...prev,
        {
          id: crypto.randomUUID(),
          name: trimmed,
          icon,
          completed: false,
          reminder: false,
          streak: 0,
          lastCompletedDate: null,
          completionHistory: [],
        },
      ];
    });
    return error;
  }, []);

  const toggleReminder = useCallback((id: string) => {
    setHabits((prev) =>
      prev.map((h) => (h.id === id ? { ...h, reminder: !h.reminder } : h))
    );
  }, []);

  const deleteHabit = useCallback((id: string) => {
    setHabits((prev) => prev.filter((h) => h.id !== id));
  }, []);

  const editHabit = useCallback((id: string, name: string, icon: string) => {
    setHabits((prev) =>
      prev.map((h) => (h.id === id ? { ...h, name, icon } : h))
    );
  }, []);

  const completed = habits.filter((h) => h.completed).length;

  return { habits, completed, toggleHabit, addHabit, toggleReminder, deleteHabit, editHabit };
};
