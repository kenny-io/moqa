-- Add temp_user_id column
ALTER TABLE webhook_endpoints
ADD COLUMN temp_user_id TEXT;

-- Create index for temp_user_id
CREATE INDEX idx_webhook_endpoints_temp_user_id ON webhook_endpoints(temp_user_id);

-- Modify the webhook_endpoints_read_policy
DROP POLICY IF EXISTS webhook_endpoints_read_policy ON webhook_endpoints;
CREATE POLICY webhook_endpoints_read_policy ON webhook_endpoints 
FOR SELECT 
TO PUBLIC 
USING (
  (auth.uid() = user_id) OR  -- Authenticated user owns the webhook
  (temp_user_id IS NOT NULL AND temp_user_id = current_setting('app.temp_user_id', TRUE))  -- Temp user owns the webhook
);

-- Add cleanup function for old temporary webhooks
CREATE OR REPLACE FUNCTION cleanup_temp_webhooks()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  DELETE FROM webhook_requests
  WHERE endpoint_id IN (
    SELECT id FROM webhook_endpoints
    WHERE temp_user_id IS NOT NULL 
    AND user_id IS NULL 
    AND created_at < NOW() - INTERVAL '3 days'
  );
  
  DELETE FROM webhook_endpoints
  WHERE temp_user_id IS NOT NULL 
  AND user_id IS NULL 
  AND created_at < NOW() - INTERVAL '3 days';
END;
$$;

-- Create a cron job to run cleanup daily
SELECT cron.schedule(
  'cleanup-temp-webhooks',
  '0 0 * * *',  -- Run at midnight every day
  'SELECT cleanup_temp_webhooks()'
);