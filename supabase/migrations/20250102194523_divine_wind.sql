/*
  # Create Webhook Service Tables

  1. New Tables
    - `webhook_endpoints`
      - Stores webhook URL configurations and response settings
    - `webhook_requests`
      - Stores incoming webhook request data
    
  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage their endpoints
    - Add policies for reading webhook requests
*/

-- Create webhook_endpoints table
CREATE TABLE webhook_endpoints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  name TEXT NOT NULL,
  response_config JSONB NOT NULL,
  is_private BOOLEAN DEFAULT false,
  auth_token TEXT,
  user_id UUID REFERENCES auth.users(id)
);

-- Create webhook_requests table
CREATE TABLE webhook_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  endpoint_id UUID REFERENCES webhook_endpoints(id) ON DELETE CASCADE,
  method TEXT NOT NULL,
  headers JSONB NOT NULL,
  query_params JSONB,
  body TEXT,
  source_ip TEXT NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE webhook_endpoints ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_requests ENABLE ROW LEVEL SECURITY;

-- Policies for webhook_endpoints
CREATE POLICY "Users can create webhook endpoints"
  ON webhook_endpoints
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their webhook endpoints"
  ON webhook_endpoints
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their webhook endpoints"
  ON webhook_endpoints
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their webhook endpoints"
  ON webhook_endpoints
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for webhook_requests
CREATE POLICY "Users can view requests for their endpoints"
  ON webhook_requests
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM webhook_endpoints
      WHERE webhook_endpoints.id = webhook_requests.endpoint_id
      AND webhook_endpoints.user_id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX idx_webhook_endpoints_user_id ON webhook_endpoints(user_id);
CREATE INDEX idx_webhook_requests_endpoint_id ON webhook_requests(endpoint_id);
CREATE INDEX idx_webhook_requests_timestamp ON webhook_requests(timestamp);

-- Add after the existing migrations
alter publication supabase_realtime add table webhook_requests;

-- Enable replication for INSERT events
alter table webhook_requests replica identity full;