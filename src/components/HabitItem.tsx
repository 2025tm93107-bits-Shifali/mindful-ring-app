import { Check, Bell, BellRing } from 'lucide-react';

interface HabitItemProps {
  id: string;
  name: string;
  icon: string;
  completed: boolean;
  reminder: boolean;
  streak: number;
  onToggle: (id: string) => void;
  onToggleReminder: (id: string) => void;
}

const HabitItem = ({ id, name, icon, completed, reminder, streak, onToggle, onToggleReminder }: HabitItemProps) => {
  return (
    <div
      className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-300 ${
        completed
          ? 'bg-primary/10 border border-primary/20'
          : 'bg-card border border-border hover:border-muted-foreground/20'
      }`}
    >
      <button
        onClick={() => onToggle(id)}
        className="flex-1 flex items-center gap-4 min-w-0"
      >
        <div
          className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
            completed
              ? 'bg-primary text-primary-foreground scale-110'
              : 'bg-muted text-muted-foreground'
          }`}
        >
          {completed ? <Check size={20} strokeWidth={3} /> : <span className="text-lg">{icon}</span>}
        </div>

        <div className="flex-1 min-w-0 text-left">
          <span
            className={`block text-sm font-medium transition-all duration-300 truncate ${
              completed ? 'text-primary line-through opacity-70' : 'text-foreground'
            }`}
          >
            {name}
          </span>
          {streak > 0 && (
            <span className="text-[10px] text-muted-foreground">🔥 {streak} day streak</span>
          )}
        </div>

        <div
          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
            completed ? 'border-primary bg-primary' : 'border-muted-foreground/30'
          }`}
        >
          {completed && <Check size={14} className="text-primary-foreground" />}
        </div>
      </button>

      {/* Reminder bell */}
      <button
        onClick={() => onToggleReminder(id)}
        className={`flex-shrink-0 p-1.5 rounded-lg transition-colors ${
          reminder ? 'text-primary' : 'text-muted-foreground/40 hover:text-muted-foreground'
        }`}
        title={reminder ? 'Reminder on' : 'Set reminder'}
      >
        {reminder ? <BellRing size={16} /> : <Bell size={16} />}
      </button>
    </div>
  );
};

export default HabitItem;
