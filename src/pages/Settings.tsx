import { useState, useEffect } from 'react';
import { Moon, Sun, ArrowLeft, Info, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import BottomNav from '@/components/BottomNav';

const DISPLAY_NAME_KEY = 'habit-tracker-display-name';
const THEME_KEY = 'habit-tracker-theme';

const Settings = () => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem(THEME_KEY) !== 'light';
  });
  const [displayName, setDisplayName] = useState(() => {
    return localStorage.getItem(DISPLAY_NAME_KEY) || '';
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.remove('light');
      localStorage.setItem(THEME_KEY, 'dark');
    } else {
      document.documentElement.classList.add('light');
      localStorage.setItem(THEME_KEY, 'light');
    }
  }, [darkMode]);

  const handleSaveName = () => {
    localStorage.setItem(DISPLAY_NAME_KEY, displayName.trim());
    toast.success('Display name updated');
  };

  return (
    <div className="min-h-screen bg-background px-5 pb-28 max-w-md mx-auto">
      <header className="pt-12 pb-6 flex items-center gap-3">
        <button
          onClick={() => navigate('/')}
          className="p-2 -ml-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold font-heading text-foreground">Settings</h1>
      </header>

      <div className="space-y-6">
        {/* Theme Toggle */}
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {darkMode ? <Moon size={20} className="text-primary" /> : <Sun size={20} className="text-primary" />}
              <div>
                <p className="text-sm font-medium text-foreground">Dark Mode</p>
                <p className="text-xs text-muted-foreground">Toggle between dark and light theme</p>
              </div>
            </div>
            <Switch checked={darkMode} onCheckedChange={setDarkMode} />
          </div>
        </div>

        {/* Display Name */}
        <div className="bg-card border border-border rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-3">
            <User size={20} className="text-primary" />
            <div>
              <p className="text-sm font-medium text-foreground">Display Name</p>
              <p className="text-xs text-muted-foreground">Set how your name appears in the app</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Enter your name"
              className="flex-1 h-10 bg-background border-border/50"
            />
            <Button size="sm" className="h-10" onClick={handleSaveName}>
              Save
            </Button>
          </div>
        </div>

        {/* App Info */}
        <div className="bg-card border border-border rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-3">
            <Info size={20} className="text-primary" />
            <p className="text-sm font-medium text-foreground">About</p>
          </div>
          <div className="space-y-2 pl-8">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Version</span>
              <span className="text-foreground font-medium">1.0.0</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Framework</span>
              <span className="text-foreground font-medium">React 18</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Build Tool</span>
              <span className="text-foreground font-medium">Vite 5</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Styling</span>
              <span className="text-foreground font-medium">Tailwind CSS</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">UI Library</span>
              <span className="text-foreground font-medium">shadcn/ui</span>
            </div>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Settings;
