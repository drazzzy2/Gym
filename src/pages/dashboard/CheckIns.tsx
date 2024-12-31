import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QRScanner } from '@/components/checkins/QRScanner';
import { MemberVerification } from '@/components/checkins/MemberVerification';
import { ActiveCheckIns } from '@/components/checkins/ActiveCheckIns';
import { CheckInHistory } from '@/components/checkins/CheckInHistory';

export function CheckInsPage() {
  const [activeTab, setActiveTab] = useState('qr');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Check-ins</h2>
        <p className="text-zinc-400">Manage member check-ins and check-outs</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-zinc-800/50 border-zinc-700/50">
          <TabsTrigger value="qr">QR Scanner</TabsTrigger>
          <TabsTrigger value="manual">Manual Check-in</TabsTrigger>
          <TabsTrigger value="active">Active Check-ins</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="qr" className="mt-6">
          <QRScanner />
        </TabsContent>

        <TabsContent value="manual" className="mt-6">
          <MemberVerification />
        </TabsContent>

        <TabsContent value="active" className="mt-6">
          <ActiveCheckIns />
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <CheckInHistory />
        </TabsContent>
      </Tabs>
    </div>
  );
}