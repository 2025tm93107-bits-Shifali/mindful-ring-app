import { useState } from 'react';
import { Plus } from 'lucide-react';
import ProgressRing from '@/components/ProgressRing';
import HabitItem from '@/components/HabitItem';
import AddHabitDialog from '@/components/AddHabitDialog';

interface Habit {
  id: string;
  name: string;
  icon: string;
  completed: boolean;
}

const defaultHabits: Habit[] = [
  { id: '1', name: 'Drink 8 glasses of water', icon: '💧', completed: false },
  { id: '2', name: 'Morning run', icon: '🏃', completed: false },
  { id: '3', name: 'Read for 30 minutes', icon: '📖', completed: false },
  { id: '4', name: 'Meditate', icon: '🧘', completed: false },
  { id: '5', name: 'Sleep by 11 PM', icon: '💤', completed: false },
];

const Index = () => {
  const [habits, setHabits] = useState<Habit[]>(defaultHabits);
  const [dialogOpen, setDialogOpen] = useState(false);

  const completed = habits.filter((h) => h.completed).length;

  const toggleHabit = (id: string) => {
    setHabits((prev) =>
      prev.map((h) => (h.id === id ? { ...h, completed: !h.completed } : h))
    );
  };

  const addHabit = (name: string, icon: string) => {
    setHabits((prev) => [
      ...prev,
      { id: crypto.randomUUID(), name, icon, completed: false },
    ]);
  };

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-background px-5 pb-24 max-w-md mx-auto">
      {/* Header */}
      <header className="pt-12 pb-2">
        <p className="text-xs text-muted-foreground uppercase tracking-widest">{today}</p>
        <h1 className="text-2xl font-bold font-heading text-foreground mt-1">
          My Habits
        </h1>
      </header>

      {/* Progress */}
      <ProgressRing completed={completed} total={habits.length} />

      {/* Habit List */}
      <div className="space-y-3">
        {habits.map((habit) => (
          <HabitItem
            key={habit.id}
            id={habit.id}
            name={habit.name}
            icon={habit.icon}
            completed={habit.completed}
            onToggle={toggleHabit}
          />
        ))}
      </div>

      {/* FAB */}
      <button
        onClick={() => setDialogOpen(true)}
        className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
      >
        <Plus size={28} strokeWidth={2.5} />
      </button>

      <AddHabitDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onAdd={addHabit}
      />
    </div>
  );
};

export default Index;
