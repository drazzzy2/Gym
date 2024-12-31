import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function Header() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const setAuth = useAuth((state) => state.set);

  const handleSignOut = () => {
    setAuth({ user: null, isAuthenticated: false });
    navigate('/');
  };

  return (
    <header className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-medium text-white">
            Welcome back, {user?.firstName}
          </h2>
        </div>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={handleSignOut}
          className="text-zinc-400 hover:text-white"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </Button>
      </div>
    </header>
  );
}