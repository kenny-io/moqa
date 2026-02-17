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
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session) {
        toast.error('Please sign in to delete webhooks');
        return;
      }

      const { error } = await supabase
        .from('webhook_endpoints')
        .delete()
        .eq('id', webhook.id)
        .eq('user_id', session.user.id);

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
      <AlertDialogContent className="border border-black/5 bg-white shadow-[0_16px_40px_-24px_rgba(0,0,0,0.35)] rounded-2xl">
        <AlertDialogHeader className="space-y-3">
          <AlertDialogTitle className="text-xl font-semibold tracking-tight">Delete Webhook</AlertDialogTitle>
          <AlertDialogDescription className="text-base text-muted-foreground">
            Are you sure you want to delete the webhook "{webhook.name}"? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-3 sm:gap-2">
          <AlertDialogCancel className="border border-black/10 bg-white text-foreground hover:bg-[#f5f5f7]">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-[#ff3b30] text-white hover:bg-[#e6362c]"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
