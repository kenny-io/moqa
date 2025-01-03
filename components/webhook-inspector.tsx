"use client";

import { useState, useEffect } from 'react';
import { WebhookEndpoint, WebhookRequest } from '@/lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ResponseConfig } from '@/components/response-config';
import { RequestList } from '@/components/request-list';
import { RequestDetails } from '@/components/request-details';
import { supabase } from '@/lib/supabase';

interface WebhookInspectorProps {
  endpoint: WebhookEndpoint;
}

export function WebhookInspector({ endpoint }: WebhookInspectorProps) {
  const [currentEndpoint, setCurrentEndpoint] = useState(endpoint);
  const [requests, setRequests] = useState<WebhookRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<WebhookRequest | null>(null);

  // Update local state when the endpoint prop changes
  useEffect(() => {
    setCurrentEndpoint(endpoint);
    setSelectedRequest(null);
    loadRequests();
  }, [endpoint.id]); // Only reload when endpoint ID changes

  const loadRequests = async () => {
    const { data, error } = await supabase
      .from('webhook_requests')
      .select('*')
      .eq('endpoint_id', endpoint.id)
      .order('timestamp', { ascending: false });

    if (error) {
      console.error('Error loading requests:', error);
      return;
    }

    setRequests(data);
    if (data.length > 0) {
      setSelectedRequest(data[0]);
    }
  };

  const subscribeToRequests = () => {
    const channel = supabase
      .channel(`webhook_requests_${endpoint.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'webhook_requests',
          filter: `endpoint_id=eq.${endpoint.id}`,
        },
        (payload) => {
          const newRequest = payload.new as WebhookRequest;
          setRequests((prev) => [newRequest, ...prev]);
          if (!selectedRequest) {
            setSelectedRequest(newRequest);
          }
        }
      )
      .subscribe();

    return channel;
  };

  useEffect(() => {
    const channel = subscribeToRequests();
    return () => {
      channel.unsubscribe();
    };
  }, [endpoint.id]); // Re-subscribe when endpoint changes

  const handleConfigUpdate = (updatedEndpoint: WebhookEndpoint) => {
    setCurrentEndpoint(updatedEndpoint);
  };

  return (
    <div className="h-full flex flex-col">
      <Tabs defaultValue="requests" className="flex-1">
        <TabsList>
          <TabsTrigger value="requests">Requests</TabsTrigger>
          <TabsTrigger value="settings">Response Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="requests" className="flex-1">
          <div className="grid grid-cols-2 gap-4 h-full">
            <RequestList
              requests={requests}
              selectedRequest={selectedRequest}
              onSelect={setSelectedRequest}
            />
            {selectedRequest ? (
              <RequestDetails request={selectedRequest} />
            ) : (
              <div className="flex items-center justify-center text-muted-foreground">
                Select a request to view its details
              </div>
            )}
          </div>
        </TabsContent>
        <TabsContent value="settings">
          <ResponseConfig 
            endpoint={currentEndpoint}
            onConfigUpdate={handleConfigUpdate}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}