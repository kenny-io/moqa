import { Button } from '@/components/ui/button';
import { WebhookIcon, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1">
        <section className="relative py-20 md:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-hero-glow"></div>
          
          <div className="container px-4 max-w-7xl mx-auto">
            <div className="mx-auto max-w-[64rem] text-center relative z-10">
              <h1 className="font-extrabold text-4xl sm:text-5xl md:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-white via-primary/90 to-primary">
                Test and Debug Your Webhooks with Ease
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-white/70 max-w-[42rem] mx-auto leading-relaxed">
                Generate unique webhook URLs, inspect requests in real-time, and customize responses.
                Perfect for development, testing, and debugging.
              </p>
              <div className="mt-10 flex flex-wrap justify-center gap-4">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white backdrop-blur-sm" asChild>
                  <Link href="/dashboard">
                    Get Started <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="border-primary/50 text-white hover:bg-primary/10 backdrop-blur-sm" asChild>
                  <Link href="/docs">Documentation</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-20 bg-secondary/5 backdrop-blur-sm">
          <div className="container px-4 max-w-7xl mx-auto">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-[64rem] mx-auto">
              <div className="group relative overflow-hidden rounded-xl border border-white/10 bg-card backdrop-blur-sm shadow-lg hover:shadow-primary/20 transition-all hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="p-6 relative z-10">
                  <div className="space-y-4">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <WebhookIcon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Real-time Inspection</h3>
                    <p className="text-white/70 leading-relaxed">
                      Watch incoming webhook requests in real-time with detailed information about headers, body, and more.
                    </p>
                  </div>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-xl border border-white/10 bg-card backdrop-blur-sm shadow-lg hover:shadow-primary/20 transition-all hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="p-6 relative z-10">
                  <div className="space-y-4">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <WebhookIcon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Custom Responses</h3>
                    <p className="text-white/70 leading-relaxed">
                      Configure custom response status codes, headers, and body content for your webhook endpoints.
                    </p>
                  </div>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-xl border border-white/10 bg-card backdrop-blur-sm shadow-lg hover:shadow-primary/20 transition-all hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="p-6 relative z-10">
                  <div className="space-y-4">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <WebhookIcon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Request History</h3>
                    <p className="text-white/70 leading-relaxed">
                      Keep track of all incoming requests with searchable and filterable history.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}