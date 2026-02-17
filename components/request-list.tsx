"use client";

import { WebhookRequest } from '@/lib/types';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface RequestListProps {
  requests: WebhookRequest[];
  selectedRequest: WebhookRequest | null;
  onSelect: (request: WebhookRequest) => void;
}

export function RequestList({
  requests,
  selectedRequest,
  onSelect,
}: RequestListProps) {
  return (
    <div className="rounded-xl border border-black/5 overflow-hidden bg-white">
      <div className="px-4 py-3 border-b border-black/5 text-sm font-semibold text-foreground">
        Recent Requests
      </div>
      <div className="divide-y">
        {requests.map((request) => (
          
          
          <div
            key={request.id}
            className={cn(
              "px-4 py-3 cursor-pointer transition-colors",
              selectedRequest?.id === request.id 
                ? "bg-[#f5f5f7] border-l-2 border-l-foreground/80" 
                : "hover:bg-[#f5f5f7]"
            )}
            onClick={() => onSelect(request)}
          >
            <div className="flex items-center justify-between">
              <span className={cn(
                "text-sm font-semibold",
                selectedRequest?.id === request.id && "text-foreground"
              )}>{request.method}</span>
              <span className="text-xs text-muted-foreground">
                {format(new Date(request.timestamp), 'HH:mm:ss')}
              </span>
            </div>
            <div className="text-xs text-muted-foreground truncate">
              {request.source_ip}
            </div>
          </div>
        ))}
        {requests.length === 0 && (
          <div className="p-6 text-center text-muted-foreground">
            No requests yet
          </div>
        )}
      </div>
    </div>
  );
}
