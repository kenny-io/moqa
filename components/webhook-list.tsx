"use client";

import { useState } from 'react';
import { WebhookEndpoint } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { WebhookIcon, Trash2Icon, Copy } from 'lucide-react';
import { DeleteWebhookDialog } from '@/components/delete-webhook-dialog';
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
    const fullUrl = `${window.location.origin}/api/webhook/${webhook.id}`;
    navigator.clipboard.writeText(fullUrl);
    toast.success('Webhook URL copied to clipboard');
  };

  return (
    <div className="space-y-2">
      {endpoints.map((endpoint) => (
        <div
          key={endpoint.id}
          className={`p-3 rounded-xl border transition-all cursor-pointer group relative ${
            selectedEndpoint?.id === endpoint.id
              ? 'border-black/10 bg-[#f5f5f7] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.02)]'
              : 'border-transparent bg-transparent hover:bg-[#f5f5f7]'
          }`}
          onClick={() => onSelect(endpoint)}
        >
          <h3 className="text-sm font-semibold text-foreground mb-1">{endpoint.name}</h3>
          <p className="text-xs text-muted-foreground break-all font-mono">
            {`${window.location.origin}/api/webhook/${endpoint.id}`}
          </p>
          
          <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleCopy(endpoint);
              }}
              className="p-2 hover:bg-white rounded-full transition-colors"
              title="Copy webhook URL"
            >
              <Copy className="h-4 w-4 text-muted-foreground" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setDeleteWebhook(endpoint);
              }}
              className="p-2 hover:bg-white rounded-full transition-colors"
              title="Delete webhook"
            >
              <Trash2Icon className="h-4 w-4 text-muted-foreground" />
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
        <div className="text-center py-10 text-muted-foreground border border-dashed border-black/10 rounded-xl bg-[#fafafa]">
          No webhooks created yet
        </div>
      )}
    </div>
  );
}
