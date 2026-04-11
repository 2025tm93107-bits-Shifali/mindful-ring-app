import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { lovable } from '@/integrations/lovable/index';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Mail, Lock, ArrowRight } from 'lucide-react';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        const name = session.user?.user_metadata?.full_name || session.user?.email?.split('@')[0] || 'User';
        toast.success(`Welcome back, ${name}! 👋`);
        navigate('/');
      }
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate('/');
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        toast.success('Check your email to confirm your account.');
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    const result = await lovable.auth.signInWithOAuth('google', {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      toast.error(result.error.message);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      toast.error('Enter your email first.');
      return;
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Password reset link sent to your email.');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 sm:px-5 py-8 overflow-y-auto">
      <div className="w-full max-w-sm space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold font-heading text-foreground">
            {isLogin ? 'Welcome back' : 'Create account'}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isLogin ? 'Sign in to track your habits' : 'Start building better habits today'}
          </p>
        </div>

        {/* Google */}
        <Button
          variant="outline"
          className="w-full h-12 gap-3 text-sm font-medium border-border/50 bg-card hover:bg-secondary transition-colors"
          onClick={handleGoogleLogin}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </Button>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-border/50" />
          <span className="text-xs text-muted-foreground uppercase tracking-wider">or</span>
          <div className="flex-1 h-px bg-border/50" />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-xs text-muted-foreground uppercase tracking-wider">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 h-12 bg-card border-border/50 focus:border-primary"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-xs text-muted-foreground uppercase tracking-wider">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 h-12 bg-card border-border/50 focus:border-primary"
                required
                minLength={6}
              />
            </div>
          </div>

          {isLogin && (
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-xs text-primary hover:text-primary/80 transition-colors"
            >
              Forgot password?
            </button>
          )}

          <Button
            type="submit"
            className="w-full h-12 gap-2 font-medium text-sm"
            disabled={loading}
          >
            {loading ? 'Please wait…' : isLogin ? 'Sign in' : 'Create account'}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </form>

        {/* Toggle */}
        <p className="text-center text-sm text-muted-foreground">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-primary hover:text-primary/80 font-medium transition-colors"
          >
            {isLogin ? 'Sign up' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Auth;
