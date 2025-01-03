"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import { WebhookEndpoint } from '@/lib/types';
import { CreateWebhookDialog } from '@/components/create-webhook-dialog';
import { WebhookList } from '@/components/webhook-list';
import { WebhookInspector } from '@/components/webhook-inspector';
import { UserMenu } from '@/components/user-menu';
import { supabase } from '@/lib/supabase';
import { Header } from '@/components/layout/header';

export default function DashboardPage() {
  const [endpoints, setEndpoints] = useState<WebhookEndpoint[]>([]);
  const [selectedEndpoint, setSelectedEndpoint] = useState<WebhookEndpoint | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  useEffect(() => {
    loadEndpoints();
  }, []);

  const loadEndpoints = async () => {
    const { data, error } = await supabase
      .from('webhook_endpoints')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading endpoints:', error);
      return;
    }

    setEndpoints(data);
  };

  const handleEndpointCreated = (newEndpoint: WebhookEndpoint) => {
    setEndpoints([newEndpoint, ...endpoints]);
    setSelectedEndpoint(newEndpoint);
  };

  const handleEndpointDeleted = (deletedEndpoint: WebhookEndpoint) => {
    setEndpoints(endpoints.filter(e => e.id !== deletedEndpoint.id));
    if (selectedEndpoint?.id === deletedEndpoint.id) {
      setSelectedEndpoint(null);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <Header showAuthButtons={false} showUserMenu={true} />
      
      <div className="flex flex-1">
        <div className="w-1/3 border-r border-white/10 bg-background/95">
          <div className="p-4 border-b border-white/10 flex items-center justify-between backdrop-blur-sm">
            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
              Your Webhooks
            </h2>
            <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-primary hover:bg-primary/90 text-white">
              <PlusIcon className="h-4 w-4 mr-2" />
              New Webhook
            </Button>
          </div>
          <div className="p-4">
            <WebhookList
              endpoints={endpoints}
              selectedEndpoint={selectedEndpoint}
              onSelect={setSelectedEndpoint}
              onDelete={handleEndpointDeleted}
            />
          </div>
        </div>
        <div className="flex-1 p-4 bg-background/30 backdrop-blur-sm">
          {selectedEndpoint ? (
            <WebhookInspector endpoint={selectedEndpoint} />
          ) : (
            <div className="flex h-full items-center justify-center text-white/50">
              Select a webhook to view its details
            </div>
          )}
        </div>
      </div>
      <CreateWebhookDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onCreated={handleEndpointCreated}
      />
    </div>
  );
}