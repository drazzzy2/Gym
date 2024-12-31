import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff } from 'lucide-react';

export function SignupForm() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName" className="text-white">First Name</Label>
          <Input
            id="firstName"
            placeholder="John"
            className="bg-zinc-800/50 border-zinc-700/50 text-white placeholder:text-zinc-400 focus:border-teal-500 transition-colors"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName" className="text-white">Last Name</Label>
          <Input
            id="lastName"
            placeholder="Doe"
            className="bg-zinc-800/50 border-zinc-700/50 text-white placeholder:text-zinc-400 focus:border-teal-500 transition-colors"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-white">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="john@example.com"
          className="bg-zinc-800/50 border-zinc-700/50 text-white placeholder:text-zinc-400 focus:border-teal-500 transition-colors"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-white">Password</Label>
        <div className="relative group">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            className="bg-zinc-800/50 border-zinc-700/50 text-white placeholder:text-zinc-400 focus:border-teal-500 transition-colors pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-teal-400 transition-colors"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox 
          id="terms" 
          className="border-zinc-700 data-[state=checked]:bg-teal-500 data-[state=checked]:border-teal-500" 
        />
        <label htmlFor="terms" className="text-sm font-medium leading-none text-zinc-400">
          I agree to the{" "}
          <a href="#" className="text-teal-400 hover:text-teal-300 transition-colors">
            terms & conditions
          </a>
        </label>
      </div>

      <Button className="w-full bg-teal-500 hover:bg-teal-600 text-white transition-all duration-200 transform hover:translate-y-[-1px]">
        Create account
      </Button>
    </form>
  );
}