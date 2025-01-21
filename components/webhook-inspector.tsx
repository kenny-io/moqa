"use client";

import { useState, useEffect } from 'react';
import { WebhookEndpoint, WebhookRequest } from '@/lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ResponseConfig } from '@/components/response-config';
import { RequestList } from '@/components/request-list';
import { RequestDetails } from '@/components/request-details';
import { supabase } from '@/lib/supabase';
import { DatePicker } from '@/components/ui/date-picker';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

interface WebhookInspectorProps {
  endpoint: WebhookEndpoint;
}

export function WebhookInspector({ endpoint }: WebhookInspectorProps) {
  const [currentEndpoint, setCurrentEndpoint] = useState(endpoint);
  const [requests, setRequests] = useState<WebhookRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<WebhookRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<WebhookRequest | null>(null);
  const [filterDate, setFilterDate] = useState<Date | undefined>(undefined);
  const [filterType, setFilterType] = useState<string | null>(null);

  useEffect(() => {
    setCurrentEndpoint(endpoint);
    setSelectedRequest(null);
    loadRequests();
  }, [endpoint.id]);

  useEffect(() => {
    applyFilters();
  }, [requests, filterDate, filterType]);

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
    setFilteredRequests(data);
    if (data.length > 0) {
      setSelectedRequest(data[0]);
    }
  };

  const applyFilters = () => {
    let filtered = [...requests];

    if (filterDate) {
      filtered = filtered.filter((request) => {
        const requestDate = new Date(request.timestamp);
        return requestDate.toDateString() === filterDate.toDateString();
      });
    }

    if (filterType) {
      filtered = filtered.filter((request) => request.method === filterType);
    }

    setFilteredRequests(filtered);
    if (selectedRequest && !filtered.includes(selectedRequest)) {
      setSelectedRequest(filtered[0] || null);
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
  }, [endpoint.id]);

  const handleConfigUpdate = (updatedEndpoint: WebhookEndpoint) => {
    setCurrentEndpoint(updatedEndpoint);
  };

  const clearFilters = () => {
    setFilterDate(undefined);
    setFilterType(null);
  };

  const hasActiveFilters = filterDate || filterType;

  return (
    <div className="h-full flex flex-col">
      <Tabs defaultValue="requests" className="h-full flex flex-col">
        <div className="border-b border-border/40 bg-background/95 backdrop-blur-sm">
          <div className="container max-w-6xl mx-auto px-6 md:pl-16">
            <div className="relative -mb-px">
              <TabsList className="w-full justify-start border-b-0 bg-transparent p-0 h-14">
                <TabsTrigger 
                  value="requests" 
                  className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-3 md:px-4 h-14 text-sm"
                >
                  Requests
                </TabsTrigger>
                <TabsTrigger 
                  value="settings" 
                  className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-3 md:px-4 h-14 text-sm"
                >
                  Response Settings
                </TabsTrigger>
              </TabsList>
            </div>
          </div>
        </div>

        <div className="flex-1 min-h-0">
          <TabsContent value="requests" className="h-full mt-0 border-none p-0">
            <div className="container max-w-6xl mx-auto p-4 md:p-6 h-full flex flex-col">
              <div className="border-b border-border/40 bg-background relative z-50">
                <div className="space-y-4 pb-4">
                  <div>
                    <h2 className="text-lg font-semibold">Recent Requests</h2>
                    <p className="text-sm text-muted-foreground">
                      View and filter incoming webhook requests
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      <div className="w-full sm:w-auto">
                        <DatePicker
                          selected={filterDate}
                          onChange={setFilterDate}
                          placeholder="Filter by date"
                        />
                      </div>

                      <Select
                        value={filterType || "all"}
                        onValueChange={(value) => setFilterType(value === "all" ? null : value)}
                      >
                        <SelectTrigger className="w-full sm:w-[180px]">
                          <SelectValue placeholder="All Methods" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Methods</SelectItem>
                          <SelectItem value="GET">GET</SelectItem>
                          <SelectItem value="POST">POST</SelectItem>
                          <SelectItem value="PUT">PUT</SelectItem>
                          <SelectItem value="DELETE">DELETE</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {hasActiveFilters && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearFilters}
                        className="h-8 text-muted-foreground hover:text-foreground"
                      >
                        Clear all
                      </Button>
                    )}
                  </div>

                  {hasActiveFilters && (
                    <div className="flex flex-wrap items-center gap-2">
                      {filterDate && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                          {format(filterDate, "PP")}
                          <X
                            className="h-3 w-3 cursor-pointer"
                            onClick={() => setFilterDate(undefined)}
                          />
                        </Badge>
                      )}
                      {filterType && filterType !== "all" && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                          {filterType}
                          <X
                            className="h-3 w-3 cursor-pointer"
                            onClick={() => setFilterType(null)}
                          />
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6 min-h-0">
                <div className="min-h-0 order-2 lg:order-1">
                  <RequestList
                    requests={filteredRequests}
                    selectedRequest={selectedRequest}
                    onSelect={setSelectedRequest}
                  />
                </div>
                <div className="min-h-0 order-1 lg:order-2">
                  {selectedRequest ? (
                    <RequestDetails request={selectedRequest} />
                  ) : (
                    <div className="h-full flex items-center justify-center text-muted-foreground border rounded-md">
                      Select a request to view its details
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="settings" className="h-full mt-0 border-none p-0">
            <ResponseConfig 
              endpoint={currentEndpoint}
              onConfigUpdate={handleConfigUpdate}
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}