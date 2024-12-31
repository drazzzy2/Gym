import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  description,
  trend 
}: StatCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="p-6 relative bg-[#1a1a1a] border-zinc-800/50 hover:border-teal-500/50 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-teal-500/10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 via-purple-500/5 to-blue-500/5" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-soft-light" />
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-lg bg-gradient-to-br from-teal-500/20 via-teal-500/10 to-transparent backdrop-blur-sm">
              <Icon className="h-6 w-6 text-teal-500" />
            </div>
            {trend && (
              <div className={`flex items-center space-x-1 text-sm ${
                trend.isPositive ? 'text-teal-500' : 'text-red-500'
              }`}>
                <span>{trend.isPositive ? '↑' : '↓'}</span>
                <span>{Math.abs(trend.value)}%</span>
              </div>
            )}
          </div>
          <div className="mt-4">
            <p className="text-sm text-zinc-400">{title}</p>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent mt-1">
              {value}
            </h3>
            {description && (
              <p className="text-xs text-zinc-500 mt-1">{description}</p>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}