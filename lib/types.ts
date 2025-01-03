export interface WebhookEndpoint {
  id: string;
  url: string;
  created_at: string;
  name: string;
  response_config: ResponseConfig;
  is_private: boolean;
  auth_token?: string;
  user_id: string;
}

export interface ResponseConfig {
  status_code: number;
  headers: Record<string, string>;
  body: string;
  content_type: 'application/json' | 'text/plain' | 'application/xml';
  delay: number;
}

export interface WebhookRequest {
  id: string;
  endpoint_id: string;
  method: string;
  headers: Record<string, string>;
  query_params: Record<string, string>;
  body: string;
  source_ip: string;
  timestamp: string;
}