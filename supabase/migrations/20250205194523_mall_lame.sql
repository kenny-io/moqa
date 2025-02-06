-- Create function to set temp_user_id
CREATE OR REPLACE FUNCTION set_temp_user_id(p_temp_user_id TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  PERFORM set_config('app.temp_user_id', p_temp_user_id, false);
END;
$$;


-- Policy to allow public read access to webhook endpoints for the webhook handler
DROP POLICY IF EXISTS "Allow public webhook endpoint access" ON webhook_endpoints;
CREATE POLICY "Allow public webhook endpoint access"
  ON webhook_endpoints
  FOR SELECT
  TO public
  USING (true);  -- This allows reading any webhook endpoint for processing requests

-- Also ensure webhook_requests can be created by the handler
DROP POLICY IF EXISTS "Allow public webhook request creation" ON webhook_requests;
CREATE POLICY "Allow public webhook request creation"
  ON webhook_requests
  FOR INSERT
  TO public
  WITH CHECK (true);

  -- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view requests for their endpoints" ON webhook_requests;

-- Create policy for viewing webhook requests
CREATE POLICY "Users can view requests for their endpoints"
  ON webhook_requests
  FOR SELECT
  TO public
  USING (
    EXISTS (
      SELECT 1 FROM webhook_endpoints
      WHERE webhook_endpoints.id = webhook_requests.endpoint_id
      AND (
        -- Authenticated user owns the webhook
        (webhook_endpoints.user_id = auth.uid())
        OR
        -- Temporary user owns the webhook
        (webhook_endpoints.temp_user_id IS NOT NULL 
         AND webhook_endpoints.temp_user_id = current_setting('app.temp_user_id', true))
      )
    )
  );