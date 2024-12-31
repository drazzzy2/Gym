import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import { FormField } from './FormField';
import { PasswordField } from './PasswordField';
import { Checkbox } from "@/components/ui/checkbox";
import { ForgotPasswordDialog } from './ForgotPasswordDialog';

export function SignInForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      await signIn(email, password, rememberMe);
      navigate('/dashboard');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Invalid email or password';
      setError(message);
      toast({
        variant: "destructive",
        title: "Error signing in",
        description: message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <FormField
        id="email"
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="john@example.com"
        error={error}
      />

      <div className="space-y-2">
        <PasswordField
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={error}
        />
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="remember"
              checked={rememberMe}
              onCheckedChange={(checked) => setRememberMe(checked as boolean)}
              className="border-zinc-700 data-[state=checked]:bg-teal-500 data-[state=checked]:border-teal-500"
            />
            <label
              htmlFor="remember"
              className="text-sm font-medium leading-none text-zinc-400"
            >
              Remember me
            </label>
          </div>
          <ForgotPasswordDialog />
        </div>
      </div>

      <Button 
        className="w-full bg-teal-500 hover:bg-teal-600 text-white transition-all duration-200 transform hover:translate-y-[-1px]"
        disabled={isLoading}
      >
        {isLoading ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  );
}