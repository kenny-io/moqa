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
import { TokenStorage } from '@/lib/token-storage';
import { getTempUserId } from '@/lib/temp-user';

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

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Get the current user's session
      const { data: { session } } = await supabase.auth.getSession();
      const tempUserId = getTempUserId();

       // I am setting the temp_user_id in the PostgreSQL session if not authenticated
    if (!session?.user) {
      await supabase.rpc('set_temp_user_id', { 
        p_temp_user_id: tempUserId 
      });
    }

      const webhookId = uuidv4();
      const authToken = isPrivate ? generateToken() : null;

      const webhookData = {
        id: webhookId,
        name,
        url: `/api/webhook/${webhookId}`,
        response_config: {
          status_code: 200,
          content_type: 'application/json',
          body: '{"message": "OK"}',
          delay: 0
        },
        is_private: isPrivate,
        auth_token: authToken,
        // If user is authenticated, use their ID; otherwise use temp ID
        user_id: session?.user?.id || null,
        temp_user_id: session?.user?.id ? null : tempUserId
      };

      const { data, error } = await supabase
        .from('webhook_endpoints')
        .insert(webhookData)
        .select()
        .single();

      if (error) throw error;

      // Store the token if it's a private webhook
      if (data.is_private && data.auth_token) {
        TokenStorage.saveToken(data.id, data.auth_token);
        
        toast.success(
          <div className="space-y-2">
            <p>Webhook created successfully!</p>
            <div className="text-xs bg-background/50 p-2 rounded border border-border/40">
              <p className="font-medium mb-1">Auth Token (save this):</p>
              <code className="break-all">{data.auth_token}</code>
            </div>
          </div>,
          {
            duration: 10000,
          }
        );
      } else {
        toast.success('Webhook created successfully!');
      }

      if (!session?.user) {
        toast.message(
          <div className="space-y-2">
            <p className="font-medium">Webhook Created as Temporary User</p>
            <p className="text-sm text-muted-foreground">
              Sign in to keep your webhooks permanently. Temporary webhooks expire after 3 days.
            </p>
          </div>
        );
      }

      window.location.reload();

      onCreated(data);
      onOpenChange(false);
      setName('');
      setIsPrivate(false);
    } catch (error) {
      console.error('Error creating webhook:', error);
      toast.error('Failed to create webhook');
    } finally {
      setIsLoading(false);
    }
  };

  const generateToken = () => {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Webhook</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My Webhook"
              required
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="private"
              checked={isPrivate}
              onCheckedChange={setIsPrivate}
            />
            <Label htmlFor="private" className="cursor-pointer">
              Private Endpoint
            </Label>
          </div>
          <Button 
            type="submit"
            className="w-full"
            disabled={isLoading || !name.trim()}
          >
            {isLoading ? 'Creating...' : 'Create Webhook'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}