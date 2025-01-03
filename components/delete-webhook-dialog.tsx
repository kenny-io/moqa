"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { WebhookEndpoint } from "@/lib/types";

interface DeleteWebhookDialogProps {
  webhook: WebhookEndpoint;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleted: (webhook: WebhookEndpoint) => void;
}

export function DeleteWebhookDialog({
  webhook,
  open,
  onOpenChange,
  onDeleted,
}: DeleteWebhookDialogProps) {
  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from('webhook_endpoints')
        .delete()
        .eq('id', webhook.id);

      if (error) {
        toast.error('Failed to delete webhook');
        console.error('Error deleting webhook:', error);
        return;
      }

      toast.success('Webhook deleted successfully');
      onDeleted(webhook);
      onOpenChange(false);
    } catch (error) {
      console.error('Error deleting webhook:', error);
      toast.error('An unexpected error occurred');
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Webhook</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete the webhook "{webhook.name}"? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}