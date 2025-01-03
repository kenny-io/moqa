"use client";

import { useState } from 'react';
import { WebhookEndpoint } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { WebhookIcon, Trash2Icon, Copy } from 'lucide-react';
import { DeleteWebhookDialog } from '@/components/delete-webhook-dialog';
import { getBaseUrl } from '@/lib/utils';
import { toast } from 'sonner';

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

  const handleCopy = (webhook: WebhookEndpoint) => {
    const fullUrl = `${getBaseUrl()}/api/webhook/${webhook.id}`;
    navigator.clipboard.writeText(fullUrl);
    toast.success('Webhook URL copied to clipboard');
  };

  return (
    <div className="space-y-2">
      {endpoints.map((endpoint) => (
        <div
          key={endpoint.id}
          className={`p-4 rounded-lg cursor-pointer group relative ${
            selectedEndpoint?.id === endpoint.id
              ? 'bg-primary/10 hover:bg-primary/15'
              : 'hover:bg-white/5'
          }`}
          onClick={() => onSelect(endpoint)}
        >
          <h3 className="font-medium mb-1">{endpoint.name}</h3>
          <p className="text-sm text-white/60 break-all">
            {`${getBaseUrl()}/api/webhook/${endpoint.id}`}
          </p>
          
          <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleCopy(endpoint);
              }}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
              title="Copy webhook URL"
            >
              <Copy className="h-4 w-4 text-white/70" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setDeleteWebhook(endpoint);
              }}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
              title="Delete webhook"
            >
              <Trash2Icon className="h-4 w-4 text-white/70" />
            </button>
          </div>
        </div>
      ))}

      {deleteWebhook && (
        <DeleteWebhookDialog
          webhook={deleteWebhook}
          open={!!deleteWebhook}
          onOpenChange={(open) => !open && setDeleteWebhook(null)}
          onDeleted={onDelete}
        />
      )}

      {endpoints.length === 0 && (
        <div className="text-center py-8 text-white/50">
          No webhooks created yet
        </div>
      )}
    </div>
  );
}