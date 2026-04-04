import { useState, useEffect, useCallback } from 'react';

export interface Habit {
  id: string;
  name: string;
  icon: string;
  completed: boolean;
  reminder: boolean;
  streak: number;
  lastCompletedDate: string | null;
}

const STORAGE_KEY = 'habit-tracker-habits';
const DATE_KEY = 'habit-tracker-date';

const defaultHabits: Habit[] = [
  { id: '1', name: 'Drink 8 glasses of water', icon: '💧', completed: false, reminder: false, streak: 0, lastCompletedDate: null },
  { id: '2', name: 'Morning run', icon: '🏃', completed: false, reminder: false, streak: 0, lastCompletedDate: null },
  { id: '3', name: 'Read for 30 minutes', icon: '📖', completed: false, reminder: false, streak: 0, lastCompletedDate: null },
  { id: '4', name: 'Meditate', icon: '🧘', completed: false, reminder: false, streak: 0, lastCompletedDate: null },
  { id: '5', name: 'Sleep by 11 PM', icon: '💤', completed: false, reminder: false, streak: 0, lastCompletedDate: null },
];

const todayStr = () => new Date().toISOString().slice(0, 10);

const loadHabits = (): Habit[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultHabits;
    const habits: Habit[] = JSON.parse(raw);

    // Reset completions if it's a new day
    const savedDate = localStorage.getItem(DATE_KEY);
    const today = todayStr();
    if (savedDate !== today) {
      localStorage.setItem(DATE_KEY, today);
      return habits.map((h) => ({ ...h, completed: false }));
    }
    return habits;
  } catch {
    return defaultHabits;
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
        const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
        let streak = h.streak;
        if (nowCompleted) {
          streak = h.lastCompletedDate === yesterday ? h.streak + 1 : 1;
        } else {
          streak = Math.max(0, h.streak - 1);
        }
        return {
          ...h,
          completed: nowCompleted,
          streak,
          lastCompletedDate: nowCompleted ? today : h.lastCompletedDate,
        };
      })
    );
  }, []);

  const addHabit = useCallback((name: string, icon: string) => {
    setHabits((prev) => [
      ...prev,
      { id: crypto.randomUUID(), name, icon, completed: false, reminder: false, streak: 0, lastCompletedDate: null },
    ]);
  }, []);

  const toggleReminder = useCallback((id: string) => {
    setHabits((prev) =>
      prev.map((h) => (h.id === id ? { ...h, reminder: !h.reminder } : h))
    );
  }, []);

  const completed = habits.filter((h) => h.completed).length;

  return { habits, completed, toggleHabit, addHabit, toggleReminder };
};
