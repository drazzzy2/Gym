import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface DashboardCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  onAction?: () => void;
}

export function DashboardCard({ 
  title, 
  subtitle, 
  children, 
  className,
  onAction 
}: DashboardCardProps) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Card className={cn(
        "overflow-hidden relative bg-[#1a1a1a] border-zinc-800/50 hover:border-teal-500/50 transition-all duration-300",
        "before:absolute before:inset-0 before:bg-gradient-to-br before:from-teal-500/5 before:via-purple-500/5 before:to-blue-500/5",
        "after:absolute after:inset-0 after:bg-[url('/noise.png')] after:opacity-20 after:mix-blend-soft-light",
        "shadow-xl hover:shadow-2xl hover:shadow-teal-500/10",
        className
      )}>
        <div className="relative z-10 p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-lg font-medium text-white">{title}</h3>
              {subtitle && (
                <p className="text-sm text-zinc-400">{subtitle}</p>
              )}
            </div>
            {onAction && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onAction}
                className="text-zinc-400 hover:text-white hover:bg-white/10"
              >
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            )}
          </div>
          {children}
        </div>
      </Card>
    </motion.div>
  );
}