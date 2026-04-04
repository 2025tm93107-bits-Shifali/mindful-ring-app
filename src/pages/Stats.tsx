import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Flame, Target, CheckCircle2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip } from 'recharts';

// --- Mock data generators (replace with real data later) ---
const generateWeeklyData = () => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const today = new Date().getDay(); // 0=Sun
  const todayIdx = today === 0 ? 6 : today - 1;
  return days.map((day, i) => ({
    day,
    completed: i <= todayIdx ? Math.floor(Math.random() * 5) + 1 : 0,
    total: 5,
    isFuture: i > todayIdx,
  }));
};

const generateMonthlyData = () => {
  const now = new Date();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  return Array.from({ length: daysInMonth }, (_, i) => {
    const isPast = i + 1 <= now.getDate();
    return {
      day: i + 1,
      level: isPast ? Math.floor(Math.random() * 4) : 0, // 0-3
    };
  });
};

const heatColors = [
  'hsl(var(--muted))',
  'hsl(145 65% 20%)',
  'hsl(145 65% 35%)',
  'hsl(var(--primary))',
];

const Stats = () => {
  const navigate = useNavigate();
  const weeklyData = useMemo(generateWeeklyData, []);
  const monthlyData = useMemo(generateMonthlyData, []);

  const streak = 7;
  const completionRate = 82;
  const totalCompleted = 143;

  const monthName = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="min-h-screen bg-background px-5 pb-24 max-w-md mx-auto">
      {/* Header */}
      <header className="pt-12 pb-6 flex items-center gap-3">
        <button
          onClick={() => navigate('/')}
          className="w-9 h-9 rounded-full bg-card flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <h1 className="text-2xl font-bold font-heading text-foreground">Statistics</h1>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        <div className="bg-card rounded-xl p-4 text-center space-y-1">
          <Flame className="w-5 h-5 mx-auto text-orange-400" />
          <p className="text-2xl font-bold font-heading text-foreground">{streak}</p>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Streak</p>
        </div>
        <div className="bg-card rounded-xl p-4 text-center space-y-1">
          <Target className="w-5 h-5 mx-auto text-primary" />
          <p className="text-2xl font-bold font-heading text-foreground">{completionRate}%</p>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Rate</p>
        </div>
        <div className="bg-card rounded-xl p-4 text-center space-y-1">
          <CheckCircle2 className="w-5 h-5 mx-auto text-primary" />
          <p className="text-2xl font-bold font-heading text-foreground">{totalCompleted}</p>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Done</p>
        </div>
      </div>

      {/* Weekly Chart */}
      <section className="mb-8">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">This Week</h2>
        <div className="bg-card rounded-xl p-4" style={{ height: 200 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyData} barCategoryGap="25%">
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'hsl(220,10%,50%)', fontSize: 11 }}
              />
              <YAxis hide domain={[0, 5]} />
              <Tooltip
                cursor={false}
                contentStyle={{
                  background: 'hsl(220,18%,12%)',
                  border: '1px solid hsl(220,15%,20%)',
                  borderRadius: 8,
                  fontSize: 12,
                  color: 'hsl(220,10%,92%)',
                }}
                formatter={(value: number) => [`${value}/5`, 'Completed']}
              />
              <Bar dataKey="completed" radius={[6, 6, 0, 0]}>
                {weeklyData.map((entry, i) => (
                  <Cell
                    key={i}
                    fill={entry.isFuture ? 'hsl(220,15%,16%)' : 'hsl(145,65%,48%)'}
                    opacity={entry.isFuture ? 0.3 : 1}
                  />
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
          {/* Legend */}
          <div className="flex items-center justify-end gap-1.5 mt-3">
            <span className="text-[10px] text-muted-foreground mr-1">Less</span>
            {heatColors.map((c, i) => (
              <div key={i} className="w-3 h-3 rounded-sm" style={{ backgroundColor: c }} />
            ))}
            <span className="text-[10px] text-muted-foreground ml-1">More</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Stats;
