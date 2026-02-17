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
    <div className="rounded-xl border border-black/5 overflow-hidden bg-white">
      <div className="px-4 py-3 border-b border-black/5 text-sm font-semibold text-foreground">
        Request Details
      </div>
      <Tabs defaultValue="headers" className="p-3">
        <TabsList className="mb-2 bg-[#f5f5f7] p-1 rounded-lg border border-black/5">
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
              theme="vs-light"
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
              theme="vs-light"
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
              theme="vs-light"
            />
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  );
}
