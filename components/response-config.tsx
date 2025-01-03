"use client";

import { useState, useEffect } from 'react';
import { WebhookEndpoint } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface ResponseConfigProps {
  endpoint: WebhookEndpoint;
  onConfigUpdate?: (endpoint: WebhookEndpoint) => void;
}

export function ResponseConfig({ endpoint, onConfigUpdate }: ResponseConfigProps) {
  const [config, setConfig] = useState(endpoint.response_config);

  // Update local state when endpoint changes
  useEffect(() => {
    setConfig(endpoint.response_config);
  }, [endpoint.id, endpoint.response_config]);

  const handleSave = async () => {
    try {
      const { data, error } = await supabase
        .from('webhook_endpoints')
        .update({ response_config: config })
        .eq('id', endpoint.id)
        .select()
        .single();

      if (error) {
        toast.error('Failed to save configuration');
        console.error('Error updating response config:', error);
        return;
      }

      toast.success('Configuration saved successfully');
      
      if (onConfigUpdate && data) {
        onConfigUpdate(data as WebhookEndpoint);
      }
    } catch (error) {
      console.error('Error saving configuration:', error);
      toast.error('An unexpected error occurred');
    }
  };

  const validateJson = (value: string): boolean => {
    try {
      JSON.parse(value);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Status Code</Label>
        <Input
          type="number"
          min={100}
          max={599}
          value={config.status_code}
          onChange={(e) =>
            setConfig({ ...config, status_code: parseInt(e.target.value) || 200 })
          }
        />
      </div>
      <div className="space-y-2">
        <Label>Content Type</Label>
        <Select
          value={config.content_type}
          onValueChange={(value: any) =>
            setConfig({ ...config, content_type: value })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="application/json">JSON</SelectItem>
            <SelectItem value="text/plain">Plain Text</SelectItem>
            <SelectItem value="application/xml">XML</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Response Body</Label>
        <Textarea
          value={config.body}
          onChange={(e) => {
            const newValue = e.target.value;
            if (config.content_type === 'application/json' && !validateJson(newValue)) {
              toast.error('Invalid JSON format');
              return;
            }
            setConfig({ ...config, body: newValue });
          }}
          rows={10}
          className="font-mono"
        />
      </div>
      <div className="space-y-2">
        <Label>Response Delay (seconds)</Label>
        <Input
          type="number"
          min={0}
          max={60}
          value={config.delay}
          onChange={(e) =>
            setConfig({ ...config, delay: parseInt(e.target.value) || 0 })
          }
        />
      </div>
      <Button 
        onClick={handleSave} 
        className="w-full"
      >
        Save Configuration
      </Button>
    </div>
  );
}