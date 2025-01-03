"use client";

import { WebhookRequest } from '@/lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import Editor from "@monaco-editor/react";

interface RequestDetailsProps {
  request: WebhookRequest;
}

export function RequestDetails({ request }: RequestDetailsProps) {
  const tryParseJson = (str: string) => {
    try {
      return JSON.stringify(JSON.parse(str), null, 2);
    } catch {
      return str;
    }
  };

  return (
    <div className="border rounded-md overflow-hidden">
      <div className="bg-muted p-2 font-medium">Request Details</div>
      <Tabs defaultValue="headers" className="p-2">
        <TabsList>
          <TabsTrigger value="headers">Headers</TabsTrigger>
          <TabsTrigger value="body">Body</TabsTrigger>
          <TabsTrigger value="query">Query</TabsTrigger>
        </TabsList>
        <ScrollArea className="h-[400px] mt-2">
          <TabsContent value="headers">
            <Editor
              height="360px"
              defaultLanguage="json"
              value={JSON.stringify(request.headers, null, 2)}
              options={{
                readOnly: true,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                fontSize: 14,
                tabSize: 2,
              }}
              theme="vs-dark"
            />
          </TabsContent>
          <TabsContent value="body">
            <Editor
              height="360px"
              defaultLanguage="json"
              value={tryParseJson(request.body)}
              options={{
                readOnly: true,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                fontSize: 14,
                tabSize: 2,
              }}
              theme="vs-dark"
            />
          </TabsContent>
          <TabsContent value="query">
            <Editor
              height="360px"
              defaultLanguage="json"
              value={JSON.stringify(request.query_params, null, 2)}
              options={{
                readOnly: true,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                fontSize: 14,
                tabSize: 2,
              }}
              theme="vs-dark"
            />
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  );
}