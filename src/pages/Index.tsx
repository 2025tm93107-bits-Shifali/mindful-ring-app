import { useState, useEffect, useRef } from 'react';
import { Plus, LogOut, ListChecks, RefreshCw, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ProgressRing from '@/components/ProgressRing';
import HabitItem from '@/components/HabitItem';
import AddHabitDialog from '@/components/AddHabitDialog';
import BottomNav from '@/components/BottomNav';
import HabitsSkeleton from '@/components/HabitsSkeleton';
import { useHabits } from '@/hooks/useHabits';
import { useProfile } from '@/hooks/useProfile';
import { useDailyReminder } from '@/hooks/useDailyReminder';
import { usePullToRefresh } from '@/hooks/usePullToRefresh';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { fireConfetti } from '@/lib/confetti';

const Index = () => {
  const { habits, completed, loading, toggleHabit, addHabit, toggleReminder, deleteHabit, editHabit, refresh } = useHabits();
  const { profile } = useProfile();
  const [dialogOpen, setDialogOpen] = useState(false);
  const navigate = useNavigate();
  useDailyReminder(habits.length - completed, loading);

  const { pullDistance, refreshing, threshold } = usePullToRefresh({
    onRefresh: async () => {
      await refresh();
      toast.success('Refreshed');
    },
    disabled: loading,
  });

  // Fire confetti when reaching 100% completion (but not on initial load)
  const prevAllDone = useRef(false);
  useEffect(() => {
    if (loading || habits.length === 0) {
      prevAllDone.current = false;
      return;
    }
    const allDone = completed === habits.length;
    if (allDone && !prevAllDone.current) {
      fireConfetti();
    }
    prevAllDone.current = allDone;
  }, [completed, habits.length, loading]);

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

  if (loading) {
    return <HabitsSkeleton />;
  }

  const pullProgress = Math.min(pullDistance / threshold, 1);

  return (
    <div
      className="min-h-screen bg-background px-5 pb-28 max-w-md mx-auto relative"
      style={{ transform: `translateY(${pullDistance}px)`, transition: refreshing || pullDistance === 0 ? 'transform 0.2s ease' : 'none' }}
    >
      {/* Pull-to-refresh indicator */}
      {(pullDistance > 0 || refreshing) && (
        <div
          className="absolute left-0 right-0 flex items-center justify-center pointer-events-none"
          style={{ top: -50, height: 50 }}
        >
          <div
            className="w-10 h-10 rounded-full bg-card border border-border shadow-lg flex items-center justify-center"
            style={{ opacity: refreshing ? 1 : pullProgress }}
          >
            {refreshing ? (
              <Loader2 size={18} className="text-primary animate-spin" />
            ) : (
              <RefreshCw
                size={18}
                className="text-primary"
                style={{ transform: `rotate(${pullProgress * 360}deg)`, transition: 'transform 0.05s linear' }}
              />
            )}
          </div>
        </div>
      )}

      {/* Header */}
      <header className="pt-12 pb-2 flex items-start justify-between">
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-widest">{today}</p>
          <h1 className="text-2xl font-bold font-heading text-foreground mt-1">
            {profile.displayName ? `Hi, ${profile.displayName}` : 'My Habits'}
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

      {/* Quick Add FAB */}
      {habits.length > 0 && (
        <button
          onClick={() => setDialogOpen(true)}
          aria-label="Quick add habit"
          className="fixed bottom-24 right-5 h-14 pl-4 pr-5 rounded-full bg-primary text-primary-foreground shadow-xl shadow-primary/40 flex items-center gap-2 font-heading font-semibold hover:scale-105 active:scale-95 transition-transform z-50"
        >
          <Plus size={22} strokeWidth={2.5} />
          <span className="text-sm">Quick Add</span>
        </button>
      )}

      <AddHabitDialog open={dialogOpen} onOpenChange={setDialogOpen} onAdd={addHabit} />
      <BottomNav />
    </div>
  );
};

export default Index;
