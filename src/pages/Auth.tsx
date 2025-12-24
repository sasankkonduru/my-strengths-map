import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, ArrowRight, Loader2 } from 'lucide-react';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login, signup } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (isLogin) {
        const result = await login(email, password);
        if (result.success) {
          toast({ title: 'Welcome back!', description: 'Successfully logged in.' });
          navigate('/dashboard');
        } else {
          toast({ title: 'Login failed', description: result.error, variant: 'destructive' });
        }
      } else {
        if (!name.trim()) {
          toast({ title: 'Name required', description: 'Please enter your name.', variant: 'destructive' });
          setIsSubmitting(false);
          return;
        }
        const result = await signup(email, password, name);
        if (result.success) {
          toast({ title: 'Account created!', description: 'Welcome to Strengths Insight.' });
          navigate('/dashboard');
        } else {
          toast({ title: 'Signup failed', description: result.error, variant: 'destructive' });
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Strengths Insight</h1>
          <p className="text-muted-foreground mt-2">Discover your unique strengths profile</p>
        </div>

        <Card className="border-border/50 shadow-lg">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl">{isLogin ? 'Welcome Back' : 'Create Account'}</CardTitle>
            <CardDescription>
              {isLogin ? 'Sign in to continue your journey' : 'Start your strengths discovery'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required={!isLogin}
                    autoComplete="name"
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder={isLogin ? 'Enter password' : 'At least 6 characters'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  autoComplete={isLogin ? 'current-password' : 'new-password'}
                />
              </div>

              <Button 
                type="submit" 
                className="w-full h-11 font-medium"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : null}
                {isLogin ? 'Sign In' : 'Create Account'}
                {!isSubmitting && <ArrowRight className="w-4 h-4 ml-2" />}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-primary hover:underline font-medium"
              >
                {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
              </button>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-6 px-4">
          This is a strengths-based assessment inspired by psychology and is not an official Gallup CliftonStrengths® product.
        </p>
      </div>
    </div>
  );
}
