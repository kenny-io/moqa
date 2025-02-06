"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { PlusIcon, MenuIcon } from 'lucide-react';
import { WebhookEndpoint } from '@/lib/types';
import { CreateWebhookDialog } from '@/components/create-webhook-dialog';
import { WebhookList } from '@/components/webhook-list';
import { WebhookInspector } from '@/components/webhook-inspector';
import { Header } from '@/components/layout/header';
import { supabase } from '@/lib/supabase';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { getTempUserId } from '@/lib/temp-user';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function DashboardPage() {
  const [endpoints, setEndpoints] = useState<WebhookEndpoint[]>([]);
  const [selectedEndpoint, setSelectedEndpoint] = useState<WebhookEndpoint | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  const supabase = createClientComponentClient();

  useEffect(() => {
    // Get initial session
    const initializeAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };
  
    initializeAuth();
  
    // Set up auth state change subscription
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });
  
    return () => subscription.unsubscribe();
  }, []);
  
  useEffect(() => {
    if (user !== undefined) { // Only load endpoints after auth state is determined
      loadEndpoints();
    }
  }, [user]); // Depend on user state instead of running once

  const loadEndpoints = async () => {
    const tempUserId = getTempUserId();
    
    try {
      console.log(user)
      if (!user && tempUserId) {
        await supabase.rpc('set_temp_user_id', { 
          p_temp_user_id: tempUserId 
        });
      }

      let query = supabase
        .from('webhook_endpoints')
        .select('*');
        
      if (user) {
        // If user is authenticated, get their webhooks
        query = query.eq('user_id', user.id);
      } else if (tempUserId) {
        // If not authenticated, get webhooks for temp user
        query = query.eq('temp_user_id', tempUserId);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading endpoints:', error);
        return;
      }

      console.log('Loaded endpoints:', {
        userId: user?.id,
        tempUserId,
        endpoints: data
      });
      
      setEndpoints(data || []);
    } catch (error) {
      console.error('Error in loadEndpoints:', error);
    }
  };

  const handleEndpointCreated = async (newEndpoint: Partial<WebhookEndpoint>) => {
    const endpointData = {
      ...newEndpoint,
      user_id: user?.id || null,
      temp_user_id: user?.id ? null : getTempUserId(),
    };

    const { data, error } = await supabase
      .from('webhook_endpoints')
      .insert(endpointData)
      .select()
      .single();

    if (error) {
      console.error('Error creating endpoint:', error);
      return;
    }

    setEndpoints([data, ...endpoints]);
    setSelectedEndpoint(data);
    setIsSidebarOpen(false);
  };



  const handleEndpointDeleted = (deletedEndpoint: WebhookEndpoint) => {
    setEndpoints(endpoints.filter(e => e.id !== deletedEndpoint.id));
    if (selectedEndpoint?.id === deletedEndpoint.id) {
      setSelectedEndpoint(null);
    }
  };

  const Sidebar = () => (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-border/40">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">
            Webhooks
          </h2>
          <Button 
            onClick={() => setIsCreateDialogOpen(true)} 
            size="sm"
            className="bg-primary hover:bg-primary/90"
          >
            <PlusIcon className="h-4 w-4 mr-1.5" />
            New
          </Button>
        </div>
        <div className="text-xs text-muted-foreground">
          {endpoints.length} webhook{endpoints.length !== 1 ? 's' : ''} configured
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        <WebhookList
          endpoints={endpoints}
          selectedEndpoint={selectedEndpoint}
          onSelect={(endpoint) => {
            setSelectedEndpoint(endpoint);
            setIsSidebarOpen(false);
          }}
          onDelete={handleEndpointDeleted}
        />
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-screen bg-background/95">
      <Header showAuthButtons={false} showUserMenu={true} />
      
      <div className="flex-1 flex min-h-0">
        {/* Desktop Sidebar */}
        <div className="hidden md:block w-80 border-r border-border/40 bg-background">
          <Sidebar />
        </div>

        {/* Mobile Sidebar */}
        <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
          <SheetTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className="fixed md:hidden top-20 left-6 z-40 h-9 w-9 p-0 bg-background/95 backdrop-blur-sm border border-border/40"
            >
              <MenuIcon className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 p-0">
            <Sidebar />
          </SheetContent>
        </Sheet>

        {/* Main Content */}
        <div className="flex-1 min-w-0 overflow-hidden bg-background/50 backdrop-blur-sm">
          {selectedEndpoint ? (
            <div className="h-full">
              <WebhookInspector endpoint={selectedEndpoint} />
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center max-w-md mx-auto px-4">
                <h3 className="text-xl font-semibold mb-3">
                  Welcome to Your Webhook Dashboard
                </h3>
                <p className="text-muted-foreground mb-6">
                  Select a webhook from the sidebar to view its details and monitor incoming requests, 
                  or create a new webhook to get started.
                </p>
                <Button 
                  onClick={() => setIsCreateDialogOpen(true)}
                  className="bg-primary hover:bg-primary/90"
                  size="lg"
                >
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Create Your First Webhook
                </Button>
              </div>
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