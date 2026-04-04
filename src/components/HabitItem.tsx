import { Check } from 'lucide-react';

interface HabitItemProps {
  id: string;
  name: string;
  icon: string;
  completed: boolean;
  onToggle: (id: string) => void;
}

const iconMap: Record<string, React.ReactNode> = {};

const HabitItem = ({ id, name, icon, completed, onToggle }: HabitItemProps) => {
  return (
    <button
      onClick={() => onToggle(id)}
      className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-300 ${
        completed
          ? 'bg-primary/10 border border-primary/20'
          : 'bg-card border border-border hover:border-muted-foreground/20'
      }`}
    >
      <div
        className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
          completed
            ? 'bg-primary text-primary-foreground scale-110'
            : 'bg-muted text-muted-foreground'
        }`}
      >
        {completed ? (
          <Check size={20} strokeWidth={3} />
        ) : (
          <span className="text-lg">{icon}</span>
        )}
      </div>

      <span
        className={`flex-1 text-left text-sm font-medium transition-all duration-300 ${
          completed ? 'text-primary line-through opacity-70' : 'text-foreground'
        }`}
      >
        {name}
      </span>

      <div
        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
          completed
            ? 'border-primary bg-primary'
            : 'border-muted-foreground/30'
        }`}
      >
        {completed && <Check size={14} className="text-primary-foreground" />}
      </div>
    </button>
  );
};

export default HabitItem;
