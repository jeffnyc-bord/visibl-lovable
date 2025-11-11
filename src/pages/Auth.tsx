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
import chatGPTLogo from '@/assets/chatGPT_logo.png';
import geminiLogo from '@/assets/gemini_logo.png';
import perplexityLogo from '@/assets/perplexity_logo.png';
import grokLogo from '@/assets/grok_logo.png';

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
        demoMode={false}
        onDemoModeChange={() => {}}
      />
      
      {/* Left Section - Auth Form */}
      <div className="w-full lg:w-[45%] flex flex-col justify-between p-8 lg:p-12 animate-fade-in">
        <div className="animate-scale-in">
          <h1 className="text-3xl font-bold font-terminal mb-2 hover-scale cursor-default">visibl</h1>
        </div>
        
        <div className="max-w-md animate-fade-in animation-delay-200">
          <h2 className="text-4xl font-bold mb-2 animate-scale-in animation-delay-300">Welcome back!</h2>
          <p className="text-muted-foreground mb-8 animate-fade-in animation-delay-400">
            {isSignUp ? 'Create your AI Visibility Dashboard account' : 'Sign in to your AI Visibility Dashboard'}
          </p>
          
          <form onSubmit={isSignUp ? handleSignup : handleLogin} className="space-y-6 animate-fade-in animation-delay-600">
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
                  className="h-12 transition-all duration-300 focus:scale-[1.02] focus:shadow-lg"
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
                className="h-12 transition-all duration-300 focus:scale-[1.02] focus:shadow-lg"
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
                    className="text-sm text-muted-foreground hover:text-foreground transition-all duration-300 hover:scale-105"
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
                  className="h-12 pr-10 transition-all duration-300 focus:scale-[1.02] focus:shadow-lg"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-all duration-300 hover:scale-110"
                >
                  <Eye className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full h-12 text-base bg-foreground text-background hover:bg-foreground/90 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
              disabled={loading}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSignUp ? 'Sign Up' : 'Sign In'}
              <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
          </form>
          
          <p className="mt-6 text-center text-sm text-muted-foreground animate-fade-in">
            {isSignUp ? (
              <>
                Already have an account?{' '}
                <button
                  onClick={() => setIsSignUp(false)}
                  className="text-foreground font-medium hover:underline transition-all duration-300 hover:scale-105 inline-block"
                >
                  Sign In
                </button>
              </>
            ) : (
              <>
                Don't have an account?{' '}
                <button
                  onClick={() => setIsSignUp(true)}
                  className="text-foreground font-medium hover:underline transition-all duration-300 hover:scale-105 inline-block"
                >
                  Sign up for Free
                </button>
              </>
            )}
          </p>
        </div>
        
        <div className="flex items-center justify-between text-sm text-muted-foreground animate-fade-in">
          <p>© Visibl 2025. All Rights Reserved</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-foreground transition-all duration-300 hover:scale-105">Privacy Policy</a>
            <span>•</span>
            <a href="#" className="hover:text-foreground transition-all duration-300 hover:scale-105">Terms & Conditions</a>
          </div>
        </div>
      </div>
      
      {/* Right Section - Feature Showcase */}
      <div className="hidden lg:flex lg:w-[55%] bg-muted/30 p-12 flex-col justify-center items-center animate-fade-in animation-delay-400">
        <div className="w-full max-w-3xl">
          <h2 className="text-5xl font-bold mb-16 animate-scale-in animation-delay-600">
            Get <span className="italic hover-scale inline-block cursor-default">visibl</span>. Stay Visible.
          </h2>
          
          {/* Demo indicator card */}
          <div className="bg-card border rounded-lg p-8 mb-8 shadow-sm transition-all duration-500 hover:shadow-lg hover:scale-[1.02] animate-fade-in animation-delay-600">
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <h3 className="text-2xl font-semibold mb-3">Track Your AI Visibility</h3>
                <p className="text-muted-foreground mb-4">
                  Monitor your brand's presence across leading AI platforms
                </p>
                <div className="space-y-2 text-sm">
                  <p className="flex items-center gap-2 animate-fade-in animation-delay-200 transition-transform duration-300 hover:translate-x-2">
                    <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                    Real-time AI visibility tracking
                  </p>
                  <p className="flex items-center gap-2 animate-fade-in animation-delay-300 transition-transform duration-300 hover:translate-x-2">
                    <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                    Competitor analysis & insights
                  </p>
                  <p className="flex items-center gap-2 animate-fade-in animation-delay-400 transition-transform duration-300 hover:translate-x-2">
                    <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                    AI-powered recommendations
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* AI Platform Logos */}
          <div className="animate-fade-in animation-delay-800">
            <p className="text-sm text-muted-foreground mb-4">Supported AI Platforms</p>
            <div className="grid grid-cols-4 gap-4">
              {[
                { src: chatGPTLogo, alt: 'ChatGPT' },
                { src: geminiLogo, alt: 'Gemini' },
                { src: perplexityLogo, alt: 'Perplexity' },
                { src: grokLogo, alt: 'Grok' },
              ].map((logo, index) => (
                <div
                  key={logo.alt}
                  className="bg-card border rounded-lg p-4 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg animate-fade-in cursor-pointer"
                  style={{ animationDelay: `${800 + index * 100}ms` }}
                >
                  <img 
                    src={logo.src} 
                    alt={logo.alt}
                    className="h-8 w-8 object-contain"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
