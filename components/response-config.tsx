"use client";

import { useState } from 'react';
import { WebhookEndpoint } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Clock, Code2, FileJson, TimerReset } from 'lucide-react';

type ContentType = 'application/json' | 'text/plain' | 'application/xml';

interface ResponseConfigProps {
  endpoint: WebhookEndpoint;
  onConfigUpdate: (endpoint: WebhookEndpoint) => void;
}

export function ResponseConfig({ endpoint, onConfigUpdate }: ResponseConfigProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [config, setConfig] = useState({
    status_code: endpoint.response_config.status_code,
    content_type: endpoint.response_config.content_type as ContentType,
    body: endpoint.response_config.body,
    delay: endpoint.response_config.delay,
  });

  const handleSave = async () => {
    try {
      setIsLoading(true);

      // Validate JSON only on save
      if (config.content_type === 'application/json') {
        try {
          JSON.parse(config.body);
        } catch (e) {
          toast.error('Invalid JSON in response body');
          return;
        }
      }

      const { data, error } = await supabase
        .from('webhook_endpoints')
        .update({
          response_config: config,
        })
        .eq('id', endpoint.id)
        .select()
        .single();

      if (error) throw error;

      onConfigUpdate(data);
      toast.success('Response settings saved');
    } catch (error) {
      console.error('Error saving response config:', error);
      toast.error('Failed to save response settings');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container max-w-4xl mx-auto p-6">
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold">Response Configuration</h2>
          <p className="text-sm text-muted-foreground">
            Configure how your webhook endpoint responds to incoming requests.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Code2 className="h-4 w-4" />
                Response Details
              </CardTitle>
              <CardDescription>
                Configure the response status and content type
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status Code</Label>
                <Input
                  id="status"
                  type="number"
                  value={config.status_code}
                  onChange={(e) => setConfig({ ...config, status_code: parseInt(e.target.value) || 200 })}
                  min={100}
                  max={599}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content-type">Content Type</Label>
                <Select
                  value={config.content_type}
                  onValueChange={(value: ContentType) => 
                    setConfig({ ...config, content_type: value })
                  }
                >
                  <SelectTrigger id="content-type">
                    <SelectValue placeholder="Select content type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="application/json">JSON</SelectItem>
                    <SelectItem value="text/plain">Plain Text</SelectItem>
                    <SelectItem value="application/xml">XML</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <TimerReset className="h-4 w-4" />
                Response Timing
              </CardTitle>
              <CardDescription>
                Configure artificial delay for testing purposes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="delay">Response Delay (ms)</Label>
                <Input
                  id="delay"
                  type="number"
                  value={config.delay}
                  onChange={(e) => setConfig({ ...config, delay: parseInt(e.target.value) || 0 })}
                  min={0}
                  max={10000}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <FileJson className="h-4 w-4" />
              Response Body
            </CardTitle>
            <CardDescription>
              Configure the response payload
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              id="body"
              value={config.body}
              onChange={(e) => setConfig({ ...config, body: e.target.value })}
              placeholder={`{\n  "message": "OK"\n}`}
              className="font-mono min-h-[200px]"
            />
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button 
            onClick={handleSave}
            className="min-w-[120px]"
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </div>
  );
}