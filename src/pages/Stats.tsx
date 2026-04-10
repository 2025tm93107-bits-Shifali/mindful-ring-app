import { useMemo } from 'react';
import { Flame, Target, CheckCircle2, Calendar } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip } from 'recharts';
import BottomNav from '@/components/BottomNav';
import { useHabits } from '@/hooks/useHabits';

const heatColors = [
  'hsl(var(--muted))',
  'hsl(145 65% 20%)',
  'hsl(145 65% 35%)',
  'hsl(var(--primary))',
];

const Stats = () => {
  const { habits, completed } = useHabits();

  const totalHabits = habits.length;
  const maxStreak = Math.max(0, ...habits.map((h) => h.streak));
  const completionRate = totalHabits > 0 ? Math.round((completed / totalHabits) * 100) : 0;
  const totalCompleted = habits.filter((h) => h.completed).length;

  // Count total unique days any habit was completed
  const totalActiveDays = useMemo(() => {
    const allDates = new Set<string>();
    habits.forEach((h) => h.completionHistory?.forEach((d) => allDates.add(d)));
    return allDates.size;
  }, [habits]);

  // Weekly data from actual completion history
  const weeklyData = useMemo(() => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const now = new Date();
    const todayIdx = now.getDay() === 0 ? 6 : now.getDay() - 1;

    return days.map((day, i) => {
      // Calculate the date for this day of the week
      const diff = i - todayIdx;
      const date = new Date(now);
      date.setDate(date.getDate() + diff);
      const dateStr = date.toISOString().slice(0, 10);

      const count = habits.filter((h) => h.completionHistory?.includes(dateStr)).length;

      return {
        day,
        completed: count,
        isFuture: i > todayIdx,
      };
    });
  }, [habits]);

  // Monthly heatmap from actual completion history
  const monthlyData = useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    return Array.from({ length: daysInMonth }, (_, i) => {
      const dayNum = i + 1;
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
      const count = habits.filter((h) => h.completionHistory?.includes(dateStr)).length;
      const level = totalHabits > 0 ? Math.min(3, Math.round((count / totalHabits) * 3)) : 0;
      return { day: dayNum, level };
    });
  }, [habits, totalHabits]);

  const monthName = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="min-h-screen bg-background px-5 pb-28 max-w-md mx-auto">
      <header className="pt-12 pb-6">
        <h1 className="text-2xl font-bold font-heading text-foreground">Statistics</h1>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        <div className="bg-card rounded-xl p-4 text-center space-y-1">
          <Flame className="w-5 h-5 mx-auto text-orange-400" />
          <p className="text-2xl font-bold font-heading text-foreground">{maxStreak}</p>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Best Streak</p>
        </div>
        <div className="bg-card rounded-xl p-4 text-center space-y-1">
          <Target className="w-5 h-5 mx-auto text-primary" />
          <p className="text-2xl font-bold font-heading text-foreground">{completionRate}%</p>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Today's Rate</p>
        </div>
        <div className="bg-card rounded-xl p-4 text-center space-y-1">
          <CheckCircle2 className="w-5 h-5 mx-auto text-primary" />
          <p className="text-2xl font-bold font-heading text-foreground">{totalCompleted}</p>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Done Today</p>
        </div>
        <div className="bg-card rounded-xl p-4 text-center space-y-1">
          <Calendar className="w-5 h-5 mx-auto text-primary" />
          <p className="text-2xl font-bold font-heading text-foreground">{totalActiveDays}</p>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Active Days</p>
        </div>
      </div>

      {/* Weekly Chart */}
      <section className="mb-8">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">This Week</h2>
        <div className="bg-card rounded-xl p-4" style={{ height: 200 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyData} barCategoryGap="25%">
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: 'hsl(220,10%,50%)', fontSize: 11 }} />
              <YAxis hide domain={[0, totalHabits]} />
              <Tooltip
                cursor={false}
                contentStyle={{
                  background: 'hsl(220,18%,12%)',
                  border: '1px solid hsl(220,15%,20%)',
                  borderRadius: 8,
                  fontSize: 12,
                  color: 'hsl(220,10%,92%)',
                }}
                formatter={(value: number) => [`${value}/${totalHabits}`, 'Completed']}
              />
              <Bar dataKey="completed" radius={[6, 6, 0, 0]}>
                {weeklyData.map((entry, i) => (
                  <Cell key={i} fill={entry.isFuture ? 'hsl(220,15%,16%)' : 'hsl(145,65%,48%)'} opacity={entry.isFuture ? 0.3 : 1} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Monthly Heatmap */}
      <section>
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">{monthName}</h2>
        <div className="bg-card rounded-xl p-4">
          <div className="grid grid-cols-7 gap-1.5">
            {monthlyData.map((d) => (
              <div
                key={d.day}
                className="aspect-square rounded-md flex items-center justify-center text-[10px] font-medium"
                style={{ backgroundColor: heatColors[d.level], color: d.level >= 2 ? 'hsl(220,20%,7%)' : 'hsl(220,10%,50%)' }}
              >
                {d.day}
              </div>
            ))}
          </div>
          <div className="flex items-center justify-end gap-1.5 mt-3">
            <span className="text-[10px] text-muted-foreground mr-1">Less</span>
            {heatColors.map((c, i) => (
              <div key={i} className="w-3 h-3 rounded-sm" style={{ backgroundColor: c }} />
            ))}
            <span className="text-[10px] text-muted-foreground ml-1">More</span>
          </div>
        </div>
      </section>

      <BottomNav />
    </div>
  );
};

export default Stats;
