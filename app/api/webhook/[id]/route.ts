import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return handleWebhook(request, params.id);
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return handleWebhook(request, params.id);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return handleWebhook(request, params.id);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return handleWebhook(request, params.id);
}

async function handleWebhook(request: NextRequest, id: string) {
  const supabase = supabaseServer;

  // Get the webhook endpoint configuration
  const { data: endpoint, error: endpointError } = await supabase
    .from('webhook_endpoints')
    .select('*')
    .eq('id', id)
    .single();

  if (endpointError || !endpoint) {
    console.error('Webhook not found:', id, endpointError);
    return new NextResponse('Webhook not found', { status: 404 });
  }

  // Check authentication for private endpoints
  if (endpoint.is_private) {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || authHeader !== `Bearer ${endpoint.auth_token}`) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
  }

  // Parse the request body based on content type
  let bodyText: string;
  const contentType = request.headers.get('content-type');
  const clone = request.clone();
  
  if (contentType?.includes('application/json')) {
    const jsonBody = await clone.json();
    bodyText = JSON.stringify(jsonBody);
  } else {
    bodyText = await clone.text();
  }

  // Store the request
  const requestData = {
    endpoint_id: endpoint.id,
    method: request.method,
    headers: Object.fromEntries(request.headers),
    query_params: Object.fromEntries(new URL(request.url).searchParams),
    body: bodyText,
    source_ip: request.headers.get('x-forwarded-for') || 'unknown',
    timestamp: new Date().toISOString(),
  };

  const { error: requestError } = await supabase
    .from('webhook_requests')
    .insert(requestData);

  if (requestError) {
    console.error('Error storing webhook request:', requestError);
  }

  // Apply response delay if configured
  if (endpoint.response_config.delay > 0) {
    await new Promise((resolve) =>
      setTimeout(resolve, endpoint.response_config.delay * 1000)
    );
  }

  // Return the configured response
  return new NextResponse(endpoint.response_config.body, {
    status: endpoint.response_config.status_code,
    headers: {
      'Content-Type': endpoint.response_config.content_type,
      ...endpoint.response_config.headers,
    },
  });
}