import { Trophy, Flame, Crown, Lock } from 'lucide-react';
import type { Habit } from '@/hooks/useHabits';

interface TrophyRoomProps {
  habits: Habit[];
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: typeof Trophy;
  earned: boolean;
  color: string;
}

const TrophyRoom = ({ habits }: TrophyRoomProps) => {
  const maxStreak = Math.max(0, ...habits.map((h) => h.streak));
  const hasFirstHabit = habits.length >= 1;
  const hasConsistent = maxStreak >= 3;
  const hasMaster = maxStreak >= 7;

  const badges: Badge[] = [
    {
      id: 'starter',
      name: 'Starter',
      description: 'Added your first habit',
      icon: Trophy,
      earned: hasFirstHabit,
      color: 'text-yellow-400',
    },
    {
      id: 'consistent',
      name: 'Consistent',
      description: '3-day streak',
      icon: Flame,
      earned: hasConsistent,
      color: 'text-orange-400',
    },
    {
      id: 'master',
      name: 'Master',
      description: '7-day streak',
      icon: Crown,
      earned: hasMaster,
      color: 'text-primary',
    },
  ];

  return (
    <section className="mb-8">
      <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">
        Trophy Room
      </h2>
      <div className="grid grid-cols-3 gap-3">
        {badges.map((badge) => {
          const Icon = badge.earned ? badge.icon : Lock;
          return (
            <div
              key={badge.id}
              className={`bg-card rounded-xl p-4 text-center space-y-2 border transition-all ${
                badge.earned
                  ? 'border-primary/30 shadow-[0_0_20px_-8px_hsl(var(--primary)/0.4)]'
                  : 'border-border/40 opacity-60'
              }`}
            >
              <div
                className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center ${
                  badge.earned ? 'bg-primary/10' : 'bg-muted'
                }`}
              >
                <Icon
                  size={22}
                  className={badge.earned ? badge.color : 'text-muted-foreground'}
                />
              </div>
              <div>
                <p className="text-xs font-semibold text-foreground">{badge.name}</p>
                <p className="text-[10px] text-muted-foreground leading-tight mt-0.5">
                  {badge.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default TrophyRoom;
