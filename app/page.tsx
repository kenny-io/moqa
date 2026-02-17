import { Button } from '@/components/ui/button';
import { WebhookIcon, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-[#f7f7f9]">
      <Header />

      <main className="flex-1">
        <section className="relative py-20 md:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-white via-white to-[#f7f7f9]"></div>
          <div className="pointer-events-none absolute left-1/2 top-16 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-black/5 blur-[140px]"></div>
          
          <div className="container px-4 max-w-7xl mx-auto">
            <div className="mx-auto max-w-[64rem] text-center relative z-10">
              <h1 className="font-extrabold text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight text-foreground">
                Test and Debug Your Webhooks with Ease
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-[42rem] mx-auto leading-relaxed">
                Generate unique webhook URLs, inspect requests in real-time, and customize responses.
                Perfect for development, testing, and debugging.
              </p>
              <div className="mt-10 flex flex-wrap justify-center gap-4">
                <Button size="lg" className="bg-black hover:bg-black/90 text-white shadow-sm" asChild>
                  <Link href="/dashboard">
                    Get Started <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="border-black/10 text-foreground hover:bg-[#f5f5f7]" asChild>
                  <Link href="/docs">Documentation</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-20">
          <div className="container px-4 max-w-7xl mx-auto">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-[64rem] mx-auto">
              <div className="group relative overflow-hidden rounded-2xl border border-black/5 bg-white shadow-[0_18px_50px_-40px_rgba(0,0,0,0.25)] transition-all hover:-translate-y-1 hover:shadow-[0_28px_70px_-45px_rgba(0,0,0,0.25)]">
                <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative z-10 p-7">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-black/10 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                      <WebhookIcon className="h-5 w-5 text-foreground" />
                    </div>
                  </div>
                  <h2 className="mt-4 text-xl font-semibold text-foreground">Real-time Inspection</h2>
                  <p className="mt-3 text-muted-foreground leading-relaxed">
                    Watch incoming webhook requests in real-time with detailed information about headers, body, and more.
                  </p>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-2xl border border-black/5 bg-white shadow-[0_18px_50px_-40px_rgba(0,0,0,0.25)] transition-all hover:-translate-y-1 hover:shadow-[0_28px_70px_-45px_rgba(0,0,0,0.25)]">
                <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative z-10 p-7">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-black/10 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                      <WebhookIcon className="h-5 w-5 text-foreground" />
                    </div>
                  </div>
                  <h3 className="mt-4 text-xl font-semibold text-foreground">Custom Responses</h3>
                  <p className="mt-3 text-muted-foreground leading-relaxed">
                    Configure custom response status codes, headers, and body content for your webhook endpoints.
                  </p>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-2xl border border-black/5 bg-white shadow-[0_18px_50px_-40px_rgba(0,0,0,0.25)] transition-all hover:-translate-y-1 hover:shadow-[0_28px_70px_-45px_rgba(0,0,0,0.25)]">
                <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative z-10 p-7">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-black/10 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                      <WebhookIcon className="h-5 w-5 text-foreground" />
                    </div>
                  </div>
                  <h3 className="mt-4 text-xl font-semibold text-foreground">Request History</h3>
                  <p className="mt-3 text-muted-foreground leading-relaxed">
                    Keep track of all incoming requests with searchable and filterable history.
                  </p>
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
