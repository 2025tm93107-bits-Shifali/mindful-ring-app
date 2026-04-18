import { useMemo } from 'react';
import type { Habit } from '@/hooks/useHabits';

interface ConsistencyHeatmapProps {
  habits: Habit[];
}

const heatColors = [
  'hsl(var(--muted))',
  'hsl(145 65% 20%)',
  'hsl(145 65% 32%)',
  'hsl(145 65% 42%)',
  'hsl(var(--primary))',
];

const WEEKS = 26; // ~6 months for compact view

const ConsistencyHeatmap = ({ habits }: ConsistencyHeatmapProps) => {
  const totalHabits = habits.length;

  const { cells, monthLabels } = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    // Find the most recent Sunday (end of current week column)
    const dayOfWeek = today.getDay(); // 0 = Sun
    const endDate = new Date(today);
    endDate.setDate(today.getDate() + (6 - dayOfWeek));

    const totalDays = WEEKS * 7;
    const startDate = new Date(endDate);
    startDate.setDate(endDate.getDate() - totalDays + 1);

    const cells: { date: string; level: number; isFuture: boolean; dayIdx: number; weekIdx: number }[] = [];
    const monthLabels: { weekIdx: number; label: string }[] = [];
    let lastMonth = -1;

    for (let i = 0; i < totalDays; i++) {
      const d = new Date(startDate);
      d.setDate(startDate.getDate() + i);
      const dateStr = d.toISOString().slice(0, 10);
      const count = habits.filter((h) => h.completionHistory?.includes(dateStr)).length;
      const ratio = totalHabits > 0 ? count / totalHabits : 0;
      const level = count === 0 ? 0 : Math.min(4, Math.ceil(ratio * 4));
      const weekIdx = Math.floor(i / 7);
      const dayIdx = i % 7;

      cells.push({
        date: dateStr,
        level,
        isFuture: d > today,
        dayIdx,
        weekIdx,
      });

      // Track first week of each month for labels
      if (dayIdx === 0 && d.getMonth() !== lastMonth) {
        lastMonth = d.getMonth();
        monthLabels.push({
          weekIdx,
          label: d.toLocaleDateString('en-US', { month: 'short' }),
        });
      }
    }

    return { cells, monthLabels };
  }, [habits, totalHabits]);

  // Group cells into columns (weeks)
  const weeks: typeof cells[] = [];
  for (let w = 0; w < WEEKS; w++) {
    weeks.push(cells.filter((c) => c.weekIdx === w));
  }

  return (
    <section className="mb-8">
      <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">
        Consistency
      </h2>
      <div className="bg-card rounded-xl p-4 overflow-x-auto">
        {/* Month labels */}
        <div className="flex gap-[3px] mb-1.5 ml-6 min-w-fit">
          {weeks.map((_, wi) => {
            const label = monthLabels.find((m) => m.weekIdx === wi);
            return (
              <div key={wi} className="w-[10px] text-[9px] text-muted-foreground">
                {label?.label ?? ''}
              </div>
            );
          })}
        </div>

        <div className="flex gap-[3px] min-w-fit">
          {/* Day labels */}
          <div className="flex flex-col gap-[3px] mr-1 text-[9px] text-muted-foreground justify-around">
            <span>Mon</span>
            <span>Wed</span>
            <span>Fri</span>
          </div>

          {/* Heatmap grid */}
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-[3px]">
              {week.map((cell) => (
                <div
                  key={cell.date}
                  className="w-[10px] h-[10px] rounded-[2px]"
                  style={{
                    backgroundColor: cell.isFuture ? 'hsl(220 15% 12%)' : heatColors[cell.level],
                    opacity: cell.isFuture ? 0.4 : 1,
                  }}
                  title={`${cell.date}: ${cell.level === 0 ? 'no activity' : `level ${cell.level}`}`}
                />
              ))}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-end gap-1.5 mt-3">
          <span className="text-[10px] text-muted-foreground mr-1">Less</span>
          {heatColors.map((c, i) => (
            <div key={i} className="w-2.5 h-2.5 rounded-[2px]" style={{ backgroundColor: c }} />
          ))}
          <span className="text-[10px] text-muted-foreground ml-1">More</span>
        </div>
      </div>
    </section>
  );
};

export default ConsistencyHeatmap;
