import { 
  Home,
  Users,
  CreditCard,
  Settings,
  Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link, useLocation } from 'react-router-dom';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Members', href: '/dashboard/members', icon: Users },
  { name: 'Subscriptions', href: '/dashboard/subscriptions', icon: CreditCard },
  { name: 'Check-ins', href: '/dashboard/checkins', icon: Clock },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <div className="flex h-full w-64 flex-col bg-zinc-900">
      <div className="flex h-16 items-center px-6">
        <h2 className="text-xl font-bold text-white">GymManager</h2>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                location.pathname === item.href
                  ? 'bg-teal-500/10 text-teal-500'
                  : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-white',
                'group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors'
              )}
            >
              <Icon className="mr-3 h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}