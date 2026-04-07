import { useState } from 'react';
import { Plus, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ProgressRing from '@/components/ProgressRing';
import HabitItem from '@/components/HabitItem';
import AddHabitDialog from '@/components/AddHabitDialog';
import BottomNav from '@/components/BottomNav';
import { useHabits } from '@/hooks/useHabits';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const Index = () => {
  const { habits, completed, toggleHabit, addHabit, toggleReminder } = useHabits();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success('Signed out');
    navigate('/auth');
  };


  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-background px-5 pb-28 max-w-md mx-auto">
      {/* Header */}
      <header className="pt-12 pb-2">
        <p className="text-xs text-muted-foreground uppercase tracking-widest">{today}</p>
        <h1 className="text-2xl font-bold font-heading text-foreground mt-1">My Habits</h1>
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
            reminder={habit.reminder}
            streak={habit.streak}
            onToggle={toggleHabit}
            onToggleReminder={toggleReminder}
          />
        ))}
      </div>

      {/* FAB */}
      <button
        onClick={() => setDialogOpen(true)}
        className="fixed bottom-20 right-6 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform z-50"
      >
        <Plus size={28} strokeWidth={2.5} />
      </button>

      <AddHabitDialog open={dialogOpen} onOpenChange={setDialogOpen} onAdd={addHabit} />
      <BottomNav />
    </div>
  );
};

export default Index;
