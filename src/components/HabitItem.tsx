import { useState } from 'react';
import { Check, Bell, BellRing, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface HabitItemProps {
  id: string;
  name: string;
  icon: string;
  completed: boolean;
  reminder: boolean;
  streak: number;
  onToggle: (id: string) => void;
  onToggleReminder: (id: string) => void;
  onEdit: (id: string, name: string, icon: string) => void;
  onDelete: (id: string) => void;
}

const HabitItem = ({ id, name, icon, completed, reminder, streak, onToggle, onToggleReminder, onEdit, onDelete }: HabitItemProps) => {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editName, setEditName] = useState(name);
  const [editIcon, setEditIcon] = useState(icon);

  const handleSaveEdit = () => {
    if (editName.trim()) {
      onEdit(id, editName.trim(), editIcon || '✅');
      setEditOpen(false);
    }
  };

  return (
    <>
      <div
        className={`w-full flex items-center gap-3 p-4 rounded-xl transition-all duration-300 ${
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

        <button
          onClick={() => onToggleReminder(id)}
          className={`flex-shrink-0 p-1.5 rounded-lg transition-colors ${
            reminder ? 'text-primary' : 'text-muted-foreground/40 hover:text-muted-foreground'
          }`}
          title={reminder ? 'Reminder on' : 'Set reminder'}
        >
          {reminder ? <BellRing size={16} /> : <Bell size={16} />}
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex-shrink-0 p-1.5 rounded-lg text-muted-foreground/40 hover:text-muted-foreground transition-colors">
              <MoreVertical size={16} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-36">
            <DropdownMenuItem onClick={() => { setEditName(name); setEditIcon(icon); setEditOpen(true); }}>
              <Pencil size={14} className="mr-2" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setDeleteOpen(true)} className="text-destructive focus:text-destructive">
              <Trash2 size={14} className="mr-2" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Edit Habit</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="flex gap-3">
              <Input
                value={editIcon}
                onChange={(e) => setEditIcon(e.target.value)}
                className="w-16 text-center text-lg"
                maxLength={2}
                placeholder="🎯"
              />
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Habit name"
                className="flex-1"
                onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit()}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveEdit} disabled={!editName.trim()}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete "{name}"?</AlertDialogTitle>
            <AlertDialogDescription>This will permanently remove the habit and its streak data.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => onDelete(id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default HabitItem;
