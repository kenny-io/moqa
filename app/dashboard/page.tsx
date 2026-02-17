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
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session) {
      setEndpoints([]);
      return;
    }

    const { data, error } = await supabase
      .from('webhook_endpoints')
      .select('*')
      .eq('user_id', session.user.id)
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
    <div className="flex flex-col h-screen bg-[#f7f7f9] text-foreground">
      <Header showAuthButtons={false} showUserMenu={true} />
      
      <div className="flex flex-1 gap-6 p-6">
        <section className="w-[320px] shrink-0">
          <div className="rounded-2xl border border-black/5 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)] overflow-hidden">
            <div className="p-5 border-b border-black/5 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-foreground">Your Webhooks</h2>
                <p className="text-xs text-muted-foreground">Manage endpoints and inspect traffic</p>
              </div>
              <Button onClick={() => setIsCreateDialogOpen(true)} size="sm" className="bg-black text-white hover:bg-black/90 shadow-sm">
                <PlusIcon className="h-4 w-4 mr-2" />
                New
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
        </section>
        <section className="flex-1">
          <div className="h-full rounded-2xl border border-black/5 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)] p-6">
            {selectedEndpoint ? (
              <WebhookInspector endpoint={selectedEndpoint} />
            ) : (
              <div className="flex h-full items-center justify-center">
                <div className="text-center max-w-sm">
                  <div className="mx-auto mb-3 h-12 w-12 rounded-2xl border border-black/5 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)] flex items-center justify-center">
                    <PlusIcon className="h-5 w-5 text-foreground/80" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Select a webhook to view its details
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
      <CreateWebhookDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onCreated={handleEndpointCreated}
      />
    </div>
  );
}
