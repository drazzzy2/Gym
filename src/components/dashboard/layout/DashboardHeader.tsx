import { UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface DashboardHeaderProps {
  onVerifyMember: () => void;
}

export function DashboardHeader({ onVerifyMember }: DashboardHeaderProps) {
  return (
    <motion.div 
      className="flex justify-between items-center"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="space-y-1">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
          Welcome Back
        </h2>
        <p className="text-zinc-400">Here's what's happening at your gym today</p>
      </div>
      <Button 
        onClick={onVerifyMember}
        className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 transition-all duration-200 transform hover:translate-y-[-1px] shadow-lg hover:shadow-teal-500/25"
      >
        <UserCheck className="mr-2 h-4 w-4" />
        Verify Member
      </Button>
    </motion.div>
  );
}