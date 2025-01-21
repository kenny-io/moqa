"use client";

import { useState, useEffect } from 'react';
import { WebhookEndpoint, WebhookRequest } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { WebhookIcon, Trash2Icon, Copy, Lock, LockOpen, EyeIcon, EyeOffIcon, Bell, Volume2, VolumeX } from 'lucide-react';
import { DeleteWebhookDialog } from '@/components/delete-webhook-dialog';
import { getBaseUrl } from '@/lib/utils';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TokenStorage } from '@/lib/token-storage';
import { supabase } from '@/lib/supabase';
import { NotificationSound } from '@/lib/notification-sound';

interface WebhookListProps {
  endpoints: WebhookEndpoint[];
  selectedEndpoint: WebhookEndpoint | null;
  onSelect: (endpoint: WebhookEndpoint) => void;
  onDelete: (endpoint: WebhookEndpoint) => void;
}

export function WebhookList({
  endpoints,
  selectedEndpoint,
  onSelect,
  onDelete,
}: WebhookListProps) {
  const [deleteWebhook, setDeleteWebhook] = useState<WebhookEndpoint | null>(null);
  const [showingTokenFor, setShowingTokenFor] = useState<string | null>(null);
  const [newRequests, setNewRequests] = useState<Record<string, number>>({});
  const [lastViewed, setLastViewed] = useState<Record<string, string>>({});
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    const channel = supabase
      .channel('webhook-requests')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'webhook_requests',
        },
        async (payload) => {
          const request = payload.new as WebhookRequest;
          setNewRequests((prev) => ({
            ...prev,
            [request.endpoint_id]: (prev[request.endpoint_id] || 0) + 1,
          }));

          // Play sound if enabled
          if (soundEnabled) {
            await NotificationSound.play();
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [soundEnabled]);

  useEffect(() => {
    const storedLastViewed = localStorage.getItem('webhook_last_viewed');
    if (storedLastViewed) {
      setLastViewed(JSON.parse(storedLastViewed));
    }

    const storedSoundEnabled = localStorage.getItem('webhook_sound_enabled');
    if (storedSoundEnabled !== null) {
      setSoundEnabled(JSON.parse(storedSoundEnabled));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('webhook_last_viewed', JSON.stringify(lastViewed));
  }, [lastViewed]);

  useEffect(() => {
    localStorage.setItem('webhook_sound_enabled', JSON.stringify(soundEnabled));
  }, [soundEnabled]);

  const handleSelect = (endpoint: WebhookEndpoint) => {
    onSelect(endpoint);
    setNewRequests((prev) => ({
      ...prev,
      [endpoint.id]: 0,
    }));
    setLastViewed((prev) => ({
      ...prev,
      [endpoint.id]: new Date().toISOString(),
    }));
  };

  const handleCopy = (webhook: WebhookEndpoint) => {
    const fullUrl = `${getBaseUrl()}/api/webhook/${webhook.id}`;
    navigator.clipboard.writeText(fullUrl);
    toast.success('Webhook URL copied to clipboard');
  };

  const handleCopyToken = (token: string | null) => {
    if (!token) {
      toast.error('Auth token not found');
      return;
    }
    navigator.clipboard.writeText(token);
    toast.success('Auth token copied to clipboard');
  };

  const handleShowToken = (webhookId: string) => {
    const token = TokenStorage.getToken(webhookId);
    if (token) {
      setShowingTokenFor(webhookId);
    } else {
      toast.error('Auth token not found');
    }
  };

  return (
    <div className="space-y-2 p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-medium text-muted-foreground">
          Your Webhooks ({endpoints.length})
        </h2>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="h-8 w-8 p-0"
              >
                {soundEnabled ? (
                  <Volume2 className="h-4 w-4" />
                ) : (
                  <VolumeX className="h-4 w-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent 
              className="bg-popover/95 backdrop-blur-sm border-border/50"
              sideOffset={4}
            >
              <p>{soundEnabled ? 'Disable' : 'Enable'} notification sounds</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {endpoints.map((endpoint) => (
        <div
          key={endpoint.id}
          className={cn(
            'p-4 rounded-lg cursor-pointer group relative transition-all',
            selectedEndpoint?.id === endpoint.id
              ? 'bg-primary/10 hover:bg-primary/15 border-l-2 border-l-primary'
              : 'hover:bg-white/5',
            endpoint.is_private && 'border border-primary/20 bg-primary/5'
          )}
          onClick={() => handleSelect(endpoint)}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-medium truncate">{endpoint.name}</h3>
                {endpoint.is_private && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Badge 
                          variant="outline" 
                          className="bg-primary/10 text-primary border-primary/20 px-1.5 py-0"
                        >
                          <Lock className="h-3 w-3 mr-1" />
                          Private
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>This webhook requires authentication</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
                {newRequests[endpoint.id] > 0 && (
                  <Badge 
                    className="bg-primary text-primary-foreground animate-pulse"
                  >
                    <Bell className="h-3 w-3 mr-1" />
                    {newRequests[endpoint.id]}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-white/60 break-all">
                {`${getBaseUrl()}/api/webhook/${endpoint.id}`}
              </p>
            </div>
          </div>
          
          {endpoint.is_private && (
            <div className="mt-2 flex flex-col sm:flex-row items-start sm:items-center gap-2">
              {showingTokenFor === endpoint.id ? (
                <div className="w-full flex flex-col sm:flex-row gap-2">
                  <div className="flex-1 min-w-0 group relative">
                    <code 
                      className="text-xs bg-background/50 px-2 py-1.5 rounded block truncate cursor-pointer hover:bg-background/70 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopyToken(TokenStorage.getToken(endpoint.id));
                      }}
                    >
                      {TokenStorage.getToken(endpoint.id)}
                    </code>
                    <div className="absolute inset-y-0 right-2 hidden group-hover:flex items-center text-xs text-muted-foreground">
                      
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopyToken(TokenStorage.getToken(endpoint.id));
                            }}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Copy auth token</p>
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowingTokenFor(null);
                            }}
                          >
                            <EyeOffIcon className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Hide token</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              ) : (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleShowToken(endpoint.id);
                  }}
                >
                  <EyeIcon className="h-4 w-4 mr-2" />
                  Show Token
                </Button>
              )}
            </div>
          )}
          
          <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopy(endpoint);
                    }}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                  >
                    <Copy className="h-4 w-4 text-white/70" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Copy webhook URL</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteWebhook(endpoint);
                    }}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                  >
                    <Trash2Icon className="h-4 w-4 text-white/70" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Delete webhook</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      ))}

      {endpoints.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No webhooks created yet
        </div>
      )}

      {deleteWebhook && (
        <DeleteWebhookDialog
          webhook={deleteWebhook}
          open={true}
          onOpenChange={(open) => !open && setDeleteWebhook(null)}
          onDeleted={onDelete}
        />
      )}
    </div>
  );
}