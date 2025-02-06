import { supabase } from "./supabase";
import { clearTempUserId, getTempUserId } from "./temp-user";

// lib/migrate-webhooks.ts
export async function migrateTemporaryWebhooks(supabase: any, userId: string) {
    const tempUserId = getTempUserId();
    
    if (!tempUserId) return;
  
    // Update all webhooks associated with the temp user ID
    const { error } = await supabase
      .from('webhook_endpoints')
      .update({
        user_id: userId,
        temp_user_id: null
      })
      .match({ temp_user_id: tempUserId });
  
    if (error) {
      console.error('Error migrating webhooks:', error);
      return;
    }
  
    // Clear the temporary user ID after successful migration
    clearTempUserId();
  }
  
  // Add this to your auth callback/sign-in success handler
  async function onSignInSuccess(session: any) {
    if (session?.user?.id) {
      await migrateTemporaryWebhooks(supabase, session.user.id);
    }
  }