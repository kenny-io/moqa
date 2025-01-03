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
    <div className="border rounded-md overflow-hidden">
      <div className="bg-muted p-2 font-medium">Recent Requests</div>
      <div className="divide-y">
        {requests.map((request) => (
          
          
          <div
            key={request.id}
            className={cn(
              "p-2 cursor-pointer transition-colors",
              selectedRequest?.id === request.id 
                ? "bg-primary/10 hover:bg-primary/20 border-l-2 border-l-primary" 
                : "hover:bg-accent"
            )}
            onClick={() => onSelect(request)}
          >
            <div className="flex items-center justify-between">
              <span className={cn(
                "font-medium",
                selectedRequest?.id === request.id && "text-primary"
              )}>{request.method}</span>
              <span className="text-sm text-muted-foreground">
                {format(new Date(request.timestamp), 'HH:mm:ss')}
              </span>
            </div>
            <div className="text-sm text-muted-foreground truncate">
              {request.source_ip}
            </div>
          </div>
        ))}
        {requests.length === 0 && (
          <div className="p-4 text-center text-muted-foreground">
            No requests yet
          </div>
        )}
      </div>
    </div>
  );
}