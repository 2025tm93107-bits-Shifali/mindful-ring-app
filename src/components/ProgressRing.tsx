interface ProgressRingProps {
  completed: number;
  total: number;
}

const ProgressRing = ({ completed, total }: ProgressRingProps) => {
  const percentage = total === 0 ? 0 : (completed / total) * 100;
  const radius = 80;
  const stroke = 8;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-3 py-8">
      <div className="relative">
        <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
          <circle
            stroke="hsl(var(--progress-track))"
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          <circle
            stroke="hsl(var(--primary))"
            fill="transparent"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${circumference} ${circumference}`}
            style={{
              strokeDashoffset,
              transition: 'stroke-dashoffset 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
              filter: percentage > 0 ? 'drop-shadow(0 0 8px hsl(var(--progress-glow) / 0.4))' : 'none',
            }}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold font-heading text-foreground">
            {completed}/{total}
          </span>
          <span className="text-xs text-muted-foreground uppercase tracking-wider">
            completed
          </span>
        </div>
      </div>
      <p className="text-sm text-muted-foreground">
        {percentage === 100 ? "All done! 🎉" : "Keep going, you got this!"}
      </p>
    </div>
  );
};

export default ProgressRing;
