import { useState, useRef, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const ICONS = ['💧', '🏃', '📖', '🧘', '💤', '🥗', '💊', '✍️', '🎵', '🧹', '🌿', '💪'];

interface AddHabitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (name: string, icon: string) => string | null;
}

const AddHabitDialog = ({ open, onOpenChange, onAdd }: AddHabitDialogProps) => {
  const [name, setName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('💧');
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setError('');
      setName('');
      setSelectedIcon('💧');
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter a habit name');
      return;
    }
    const result = onAdd(name.trim(), selectedIcon);
    if (result) {
      setError(result);
    } else {
      setName('');
      setSelectedIcon('💧');
      setError('');
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border max-w-sm mx-auto">
        <DialogHeader>
          <DialogTitle className="font-heading text-foreground">New Habit</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <Input
              ref={inputRef}
              placeholder="Habit name..."
              value={name}
              onChange={(e) => { setName(e.target.value); setError(''); }}
              className="bg-muted border-border text-foreground placeholder:text-muted-foreground"
            />
            {error && (
              <p className="text-xs text-destructive">{error}</p>
            )}
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wider">Icon</p>
            <div className="grid grid-cols-6 gap-2">
              {ICONS.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setSelectedIcon(icon)}
                  className={`text-xl p-2 rounded-lg transition-all ${
                    selectedIcon === icon
                      ? 'bg-primary/20 ring-2 ring-primary scale-110'
                      : 'bg-muted hover:bg-secondary'
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>
          <Button
            type="submit"
            disabled={!name.trim()}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-heading"
          >
            Add Habit
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddHabitDialog;
