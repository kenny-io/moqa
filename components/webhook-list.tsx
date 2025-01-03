"use client";

import { useState } from 'react';
import { WebhookEndpoint } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { WebhookIcon, Trash2Icon } from 'lucide-react';
import { DeleteWebhookDialog } from '@/components/delete-webhook-dialog';

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
  const [webhookToDelete, setWebhookToDelete] = useState<WebhookEndpoint | null>(null);

  const handleDeleteClick = (e: React.MouseEvent, endpoint: WebhookEndpoint) => {
    e.stopPropagation();
    setWebhookToDelete(endpoint);
  };

  return (
    <div className="space-y-2">
      {endpoints.map((endpoint) => (
        <div
          key={endpoint.id}
          className={cn(
            "flex items-center space-x-2 p-3 rounded-md cursor-pointer transition-all",
            selectedEndpoint?.id === endpoint.id
              ? "bg-primary/10 hover:bg-primary/20 border-l-2 border-l-primary shadow-sm"
              : "hover:bg-accent group"
          )}
          onClick={() => onSelect(endpoint)}
        >
          <WebhookIcon className={cn(
            "h-4 w-4 shrink-0",
            selectedEndpoint?.id === endpoint.id && "text-primary"
          )} />
          <div className="flex-1 min-w-0">
            <div className={cn(
              "font-medium truncate",
              selectedEndpoint?.id === endpoint.id && "text-primary"
            )}>{endpoint.name}</div>
            <div className="text-sm text-muted-foreground truncate">{endpoint.url}</div>
          </div>
          {endpoint.is_private && (
            <div className="text-xs bg-yellow-500/10 text-yellow-500 px-2 py-1 rounded-full border border-yellow-500/20 shrink-0">
              Private
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "opacity-0 group-hover:opacity-100 transition-opacity",
              selectedEndpoint?.id === endpoint.id && "opacity-100"
            )}
            onClick={(e) => handleDeleteClick(e, endpoint)}
          >
            <Trash2Icon className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ))}

      {endpoints.length === 0 && (
        <div className="text-center p-4 text-muted-foreground">
          No webhooks created yet
        </div>
      )}

      {webhookToDelete && (
        <DeleteWebhookDialog
          webhook={webhookToDelete}
          open={!!webhookToDelete}
          onOpenChange={(open) => !open && setWebhookToDelete(null)}
          onDeleted={onDelete}
        />
      )}
    </div>
  );
}