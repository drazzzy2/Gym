import { SettingsHeader } from '@/components/settings/SettingsHeader';
import { SettingsError } from '@/components/settings/SettingsError';
import { BasicInfoForm } from '@/components/settings/BasicInfoForm';
import { AddressForm } from '@/components/settings/AddressForm';
import { useSettings } from '@/hooks/use-settings';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

export function SettingsPage() {
  const { settings, isLoading, error, updateSettings, refresh } = useSettings();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48 bg-zinc-800" />
          <Skeleton className="h-4 w-96 bg-zinc-800" />
        </div>
        <Skeleton className="h-[400px] bg-zinc-800" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <SettingsHeader 
          title="Settings"
          description="Manage your gym's information and preferences"
        />
        <SettingsError message={error} onRetry={refresh} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SettingsHeader 
        title="Settings"
        description="Manage your gym's information and preferences"
      />

      <Tabs defaultValue="basic" className="space-y-6">
        <TabsList className="bg-zinc-800/50 border-zinc-700/50">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="address">Address</TabsTrigger>
        </TabsList>

        <TabsContent value="basic">
          <BasicInfoForm settings={settings} onSave={updateSettings} />
        </TabsContent>

        <TabsContent value="address">
          <AddressForm settings={settings} onSave={updateSettings} />
        </TabsContent>
      </Tabs>
    </div>
  );
}