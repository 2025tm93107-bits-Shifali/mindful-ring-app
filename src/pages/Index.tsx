import { useState } from 'react';
import { Plus, LogOut, ListChecks } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ProgressRing from '@/components/ProgressRing';
import HabitItem from '@/components/HabitItem';
import AddHabitDialog from '@/components/AddHabitDialog';
import BottomNav from '@/components/BottomNav';
import { useHabits } from '@/hooks/useHabits';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const DISPLAY_NAME_KEY = 'habit-tracker-display-name';

const Index = () => {
  const { habits, completed, toggleHabit, addHabit, toggleReminder, deleteHabit, editHabit } = useHabits();
  const [dialogOpen, setDialogOpen] = useState(false);
  const navigate = useNavigate();

  const displayName = localStorage.getItem(DISPLAY_NAME_KEY) || '';

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
      <header className="pt-12 pb-2 flex items-start justify-between">
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-widest">{today}</p>
          <h1 className="text-2xl font-bold font-heading text-foreground mt-1">
            {displayName ? `Hi, ${displayName}` : 'My Habits'}
          </h1>
        </div>
        <button
          onClick={handleLogout}
          className="mt-1 p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
          aria-label="Sign out"
        >
          <LogOut size={18} />
        </button>
      </header>

      {/* Progress */}
      {habits.length > 0 && <ProgressRing completed={completed} total={habits.length} />}

      {/* Habit List */}
      {habits.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-5">
          <div className="w-24 h-24 rounded-full bg-muted/50 flex items-center justify-center">
            <ListChecks size={44} className="text-muted-foreground/40" />
          </div>
          <div className="text-center space-y-2">
            <h2 className="text-lg font-semibold text-foreground">No habits yet</h2>
            <p className="text-sm text-muted-foreground max-w-[240px]">
              Start building better routines by adding your first habit
            </p>
          </div>
          <Button
            onClick={() => setDialogOpen(true)}
            className="gap-2 font-medium"
          >
            <Plus size={18} /> Add Your First Habit
          </Button>
        </div>
      ) : (
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
              onEdit={editHabit}
              onDelete={deleteHabit}
            />
          ))}
        </div>
      )}

      {/* FAB */}
      {habits.length > 0 && (
        <button
          onClick={() => setDialogOpen(true)}
          className="fixed bottom-20 right-6 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform z-50"
        >
          <Plus size={28} strokeWidth={2.5} />
        </button>
      )}

      <AddHabitDialog open={dialogOpen} onOpenChange={setDialogOpen} onAdd={addHabit} />
      <BottomNav />
    </div>
  );
};

export default Index;
