"use client";

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { WebhookEndpoint } from '@/lib/types';
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';

interface CreateWebhookDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: (endpoint: WebhookEndpoint) => void;
}

export function CreateWebhookDialog({
  open,
  onOpenChange,
  onCreated,
}: CreateWebhookDialogProps) {
  const [name, setName] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleCreate = async () => {
    try {
      setIsLoading(true);

      // Get the current user's session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        toast.error('Please sign in to create webhooks');
        return;
      }

      const id = uuidv4();
      const endpoint: Partial<WebhookEndpoint> = {
        id,
        name,
        url: `/api/webhook/${id}`,
        is_private: isPrivate,
        auth_token: isPrivate ? uuidv4() : undefined,
        user_id: session.user.id,
        response_config: {
          status_code: 200,
          headers: {},
          body: '{"message": "OK"}',
          content_type: 'application/json',
          delay: 0,
        },
      };

      const { data, error } = await supabase
        .from('webhook_endpoints')
        .insert(endpoint)
        .select()
        .single();

      if (error) {
        toast.error('Failed to create webhook');
        console.error('Error creating webhook:', error);
        return;
      }

      toast.success('Webhook created successfully');
      onCreated(data as WebhookEndpoint);
      onOpenChange(false);
      setName('');
      setIsPrivate(false);
    } catch (error) {
      console.error('Error creating webhook:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Webhook</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My Webhook"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="private"
              checked={isPrivate}
              onCheckedChange={setIsPrivate}
            />
            <Label htmlFor="private">Private Endpoint</Label>
          </div>
          <Button 
            onClick={handleCreate} 
            className="w-full"
            disabled={isLoading || !name.trim()}
          >
            {isLoading ? 'Creating...' : 'Create Webhook'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}