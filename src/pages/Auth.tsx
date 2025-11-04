import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Eye, ArrowRight } from 'lucide-react';
import { z } from 'zod';
import { DeveloperControls } from '@/components/ui/developer-controls';

const emailSchema = z.string().email('Invalid email address');
const passwordSchema = z.string().min(6, 'Password must be at least 6 characters');

export const Auth = () => {
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({ email: '', password: '', fullName: '' });
  
  // Dev controls states (minimal for auth page)
  const [dashboardStates] = useState({
    fullDashboardLoading: false,
    widgetLoading: false,
    fullDashboardError: false,
    widgetError: false,
    showBaseline: false,
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      emailSchema.parse(loginData.email);
      passwordSchema.parse(loginData.password);
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: 'Validation Error',
          description: error.errors[0].message,
          variant: 'destructive',
        });
        return;
      }
    }

    setLoading(true);
    const { error } = await signIn(loginData.email, loginData.password);
    
    if (error) {
      toast({
        title: 'Login Failed',
        description: error.message,
        variant: 'destructive',
      });
    }
    setLoading(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      emailSchema.parse(signupData.email);
      passwordSchema.parse(signupData.password);
      
      if (!signupData.fullName.trim()) {
        throw new Error('Full name is required');
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: 'Validation Error',
          description: error.errors[0].message,
          variant: 'destructive',
        });
        return;
      } else if (error instanceof Error) {
        toast({
          title: 'Validation Error',
          description: error.message,
          variant: 'destructive',
        });
        return;
      }
    }

    setLoading(true);
    const { error } = await signUp(signupData.email, signupData.password, signupData.fullName);
    
    if (error) {
      toast({
        title: 'Signup Failed',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Account Created!',
        description: 'Welcome to Board Labs AI Visibility Platform',
      });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex bg-background">
      <DeveloperControls
        states={dashboardStates}
        onStateChange={() => {}}
        userRole="business_user"
        onRoleChange={() => {}}
        loadingDuration={5}
        onLoadingDurationChange={() => {}}
        topSourceUrl=""
        onTopSourceUrlChange={() => {}}
        dataPointsCount={6}
        onDataPointsCountChange={() => {}}
        selectedGradient="gradient3"
        onGradientChange={() => {}}
        onNavigateToAuth={() => navigate('/')}
      />
      
      {/* Left Section - Auth Form */}
      <div className="w-full lg:w-[40%] flex flex-col justify-between p-8 lg:p-12">
        <div>
          <h1 className="text-3xl font-bold mb-2">visibl</h1>
        </div>
        
        <div className="max-w-md">
          <h2 className="text-4xl font-bold mb-2">Welcome back!</h2>
          <p className="text-muted-foreground mb-8">
            {isSignUp ? 'Create your AI Visibility Dashboard account' : 'Sign in to your AI Visibility Dashboard'}
          </p>
          
          <form onSubmit={isSignUp ? handleSignup : handleLogin} className="space-y-6">
            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Full Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={signupData.fullName}
                  onChange={(e) => setSignupData({ ...signupData, fullName: e.target.value })}
                  required
                  className="h-12"
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="jane@yourcompany.com"
                value={isSignUp ? signupData.email : loginData.email}
                onChange={(e) => isSignUp 
                  ? setSignupData({ ...signupData, email: e.target.value })
                  : setLoginData({ ...loginData, email: e.target.value })
                }
                required
                className="h-12"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                {!isSignUp && (
                  <button
                    type="button"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  value={isSignUp ? signupData.password : loginData.password}
                  onChange={(e) => isSignUp
                    ? setSignupData({ ...signupData, password: e.target.value })
                    : setLoginData({ ...loginData, password: e.target.value })
                  }
                  required
                  className="h-12 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <Eye className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full h-12 text-base bg-foreground text-background hover:bg-foreground/90"
              disabled={loading}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSignUp ? 'Sign Up' : 'Sign In'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>
          
          <p className="mt-6 text-center text-sm text-muted-foreground">
            {isSignUp ? (
              <>
                Already have an account?{' '}
                <button
                  onClick={() => setIsSignUp(false)}
                  className="text-foreground font-medium hover:underline"
                >
                  Sign In
                </button>
              </>
            ) : (
              <>
                Don't have an account?{' '}
                <button
                  onClick={() => setIsSignUp(true)}
                  className="text-foreground font-medium hover:underline"
                >
                  Sign up for Free
                </button>
              </>
            )}
          </p>
        </div>
        
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <p>© Visibl 2025. All Rights Reserved</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
            <span>•</span>
            <a href="#" className="hover:text-foreground transition-colors">Terms & Conditions</a>
          </div>
        </div>
      </div>
      
      {/* Right Section - Feature Showcase */}
      <div className="hidden lg:flex lg:w-[60%] bg-muted/30 p-12 flex-col justify-center">
        <div className="max-w-2xl">
          <h2 className="text-5xl font-bold mb-16">
            Get <span className="italic">visibl</span>. Stay Visible.
          </h2>
          
          {/* Demo indicator card */}
          <div className="bg-card border rounded-lg p-8 mb-8 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <h3 className="text-2xl font-semibold mb-3">Demo Login Page</h3>
                <p className="text-muted-foreground mb-4">
                  This is the authentication interface for the Board Labs AI Visibility Platform demo.
                </p>
                <div className="space-y-2 text-sm">
                  <p className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full"></span>
                    Sign in to access your dashboard
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full"></span>
                    Create a free account to get started
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full"></span>
                    Use dev controls to toggle views
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-card border rounded-lg p-8 shadow-sm">
            <h3 className="text-2xl font-semibold mb-4">Your First Steps to Success</h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold mb-2">Analyze a brands AI visibility score</h4>
                <p className="text-sm text-muted-foreground">
                  Collect data from AI-powered platforms and search engines where your brand may surface.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Test prompts in real-time or add them to a queue</h4>
                <p className="text-sm text-muted-foreground">
                  Experiment with prompts instantly or schedule them for consistent visibility checks.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Identify actionable AEO recommendations</h4>
                <p className="text-sm text-muted-foreground">
                  Pinpoint practical steps that strengthen your brand's AI-driven discoverability.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
