import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export default function DocsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1">
        <div className="container px-4 max-w-7xl mx-auto py-16">
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" size="sm" className="text-white/70 hover:text-white" asChild>
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            </Button>
          </div>

          <div className="prose prose-invert max-w-4xl mx-auto">
            <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-white via-primary/90 to-primary mb-8">
              Documentation
            </h1>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-4">Getting Started</h2>
              <div className="space-y-4 text-white/70">
                <p>
                  Moqa provides a simple way to test and debug webhooks during development. 
                  Here's how to get started:
                </p>
                <ol className="list-decimal list-inside space-y-2">
                  <li>Sign up for a free account</li>
                  <li>Create a new webhook endpoint from your dashboard</li>
                  <li>Use the generated URL to receive webhook requests</li>
                  <li>Monitor incoming requests in real-time</li>
                </ol>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-4">Features</h2>
              
              <div className="space-y-8">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-white">Real-time Request Inspection</h3>
                  <p className="text-white/70">
                    Watch incoming webhook requests as they happen. Inspect headers, query parameters, 
                    and request bodies in a clean, formatted interface.
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-white">Custom Response Configuration</h3>
                  <p className="text-white/70">
                    Configure how your webhook endpoint responds to requests:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-white/70">
                    <li>Set custom status codes</li>
                    <li>Define response headers</li>
                    <li>Specify response body content</li>
                    <li>Add artificial response delays</li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-white">Request History</h3>
                  <p className="text-white/70">
                    Access a complete history of all requests made to your webhook endpoints. 
                    Search and filter requests to find exactly what you're looking for.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-4">API Reference</h2>
              <div className="space-y-6">
                <div className="rounded-lg border border-white/10 bg-card/50 backdrop-blur-sm p-4">
                  <h3 className="text-lg font-semibold text-white mb-2">Webhook URL Format</h3>
                  <code className="block bg-black/50 p-3 rounded text-sm text-white/90">
                    https://moqa.io/api/webhook/{'{webhook_id}'}
                  </code>
                </div>

                <div className="rounded-lg border border-white/10 bg-card/50 backdrop-blur-sm p-4">
                  <h3 className="text-lg font-semibold text-white mb-2">Authentication</h3>
                  <p className="text-white/70 mb-3">
                    For private webhooks, include the auth token in the request header:
                  </p>
                  <code className="block bg-black/50 p-3 rounded text-sm text-white/90">
                    Authorization: Bearer {'{webhook_auth_token}'}
                  </code>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Need Help?</h2>
              <p className="text-white/70 mb-4">
                If you need assistance or have questions, feel free to reach out through our support channels:
              </p>
              <div className="flex flex-wrap gap-4">
                <Button variant="outline" className="border-primary/50 text-white hover:bg-primary/10" asChild>
                  <Link href="/contact">Contact Support</Link>
                </Button>
                <Button variant="outline" className="border-primary/50 text-white hover:bg-primary/10" asChild>
                  <Link href="https://github.com/kenny-io/moqa">GitHub Issues</Link>
                </Button>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
} 