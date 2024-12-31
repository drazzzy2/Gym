import { SignUpForm } from '@/components/auth/SignUpForm';
import { Link } from 'react-router-dom';

export function SignUpPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 p-4 md:p-8">
      <div className="w-full max-w-[1000px] grid grid-cols-1 md:grid-cols-2 rounded-3xl overflow-hidden shadow-2xl animate-in fade-in duration-700 bg-zinc-900/50 backdrop-blur-xl">
        <div className="relative hidden md:block">
          <img 
            src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1470&auto=format&fit=crop"
            alt="Gym equipment"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-teal-500/30 to-purple-600/30 backdrop-blur-[1px]" />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/80 via-zinc-900/20 to-transparent" />
        </div>

        <div className="relative p-8 md:p-12">
          <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-purple-600/5" />
          <div className="relative space-y-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight text-white">
                Create your account
              </h1>
              <p className="text-zinc-400">
                Already have an account?{" "}
                <Link to="/" className="text-teal-400 hover:text-teal-300 transition-colors font-medium">
                  Sign in
                </Link>
              </p>
            </div>

            <SignUpForm />
          </div>
        </div>
      </div>
    </div>
  );
}