-- Drop existing insert policy if it exists
DROP POLICY IF EXISTS "Users can create webhook endpoints" ON webhook_endpoints;

-- Create new insert policy that allows both authenticated and temporary users
CREATE POLICY "Allow webhook creation for all users"
  ON webhook_endpoints
  FOR INSERT
  TO public
  WITH CHECK (
    -- Allow authenticated users creating their own webhooks
    (auth.uid() IS NOT NULL AND user_id = auth.uid()) 
    OR 
    -- Allow temporary users creating webhooks with temp_user_id
    (auth.uid() IS NULL AND temp_user_id IS NOT NULL)
  );

-- Update the select policy to allow temporary users to view their webhooks
DROP POLICY IF EXISTS "Users can view their webhook endpoints" ON webhook_endpoints;
CREATE POLICY "Users can view their webhook endpoints"
  ON webhook_endpoints
  FOR SELECT
  TO public
  USING (
    -- Authenticated users can view their webhooks
    (auth.uid() IS NOT NULL AND user_id = auth.uid())
    OR
    -- Temporary users can view their webhooks
    (temp_user_id IS NOT NULL AND temp_user_id = current_setting('app.temp_user_id', true))
  );

-- Update other policies as needed
DROP POLICY IF EXISTS "Users can update their webhook endpoints" ON webhook_endpoints;
CREATE POLICY "Users can update their webhook endpoints"
  ON webhook_endpoints
  FOR UPDATE
  TO public
  USING (
    (auth.uid() IS NOT NULL AND user_id = auth.uid())
    OR
    (temp_user_id IS NOT NULL AND temp_user_id = current_setting('app.temp_user_id', true))
  );

DROP POLICY IF EXISTS "Users can delete their webhook endpoints" ON webhook_endpoints;
CREATE POLICY "Users can delete their webhook endpoints"
  ON webhook_endpoints
  FOR DELETE
  TO public
  USING (
    (auth.uid() IS NOT NULL AND user_id = auth.uid())
    OR
    (temp_user_id IS NOT NULL AND temp_user_id = current_setting('app.temp_user_id', true))
  );