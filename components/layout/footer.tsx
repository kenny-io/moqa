import { WebhookIcon } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-black/5 bg-white">
      <div className="container py-8 px-4 max-w-7xl mx-auto">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <WebhookIcon className="h-6 w-6 text-foreground" />
            <p className="text-sm text-muted-foreground">
              Built for developers.
            </p>
          </div>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link href="https://github.com/moqa-io/moqa" className="hover:text-foreground transition-colors">GitHub</Link>
            <Link href="https://kenny.engineer" className="hover:text-foreground transition-colors">Website</Link>
            <Link href="https://twitter.com/kenny_io" className="hover:text-foreground transition-colors">Twitter</Link>
          </div>
        </div>
      </div>
    </footer>
  );
} 
