import { DollarSign } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRevenueStats } from '@/hooks/use-revenue-stats';
import { formatCurrency } from '@/lib/utils';
import { motion } from "framer-motion";

export function RevenueCard() {
  const { stats, isLoading } = useRevenueStats();

  if (isLoading) {
    return null;
  }

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="p-6 relative bg-[#1a1a1a] border-zinc-800/50 hover:border-teal-500/50 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-teal-500/10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 via-purple-500/5 to-blue-500/5" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-soft-light" />
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-br from-teal-500/20 via-teal-500/10 to-transparent backdrop-blur-sm">
              <DollarSign className="h-6 w-6 text-teal-500" />
            </div>
          </div>

          <Tabs defaultValue="daily" className="space-y-4">
            <TabsList className="grid grid-cols-3 bg-zinc-800/50">
              <TabsTrigger value="daily">Daily</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
              <TabsTrigger value="yearly">Yearly</TabsTrigger>
            </TabsList>

            <TabsContent value="daily" className="space-y-2">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                {formatCurrency(stats.daily)}
              </h3>
              <p className="text-sm text-zinc-400">Daily Revenue</p>
            </TabsContent>

            <TabsContent value="monthly" className="space-y-2">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                {formatCurrency(stats.monthly)}
              </h3>
              <p className="text-sm text-zinc-400">Monthly Revenue</p>
            </TabsContent>

            <TabsContent value="yearly" className="space-y-2">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                {formatCurrency(stats.yearly)}
              </h3>
              <p className="text-sm text-zinc-400">Yearly Revenue</p>
            </TabsContent>
          </Tabs>
        </div>
      </Card>
    </motion.div>
  );
}