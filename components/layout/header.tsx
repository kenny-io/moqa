import { WebhookIcon } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { UserMenu } from '@/components/user-menu';

interface HeaderProps {
  showAuthButtons?: boolean;
  showUserMenu?: boolean;
}

export function Header({ showAuthButtons = true, showUserMenu = false }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/70">
      <div className="container flex h-16 items-center justify-between px-4 max-w-7xl mx-auto">
        <div className="flex items-center space-x-2">
          <WebhookIcon className="h-6 w-6 text-foreground" />
          <span className="text-xl font-semibold tracking-tight text-foreground">
            <Link href="/" className="hover:text-primary transition-colors">Moqa</Link>
          </span>
        </div>
        <nav className="flex items-center space-x-4">
          {showUserMenu && <UserMenu />}
          {showAuthButtons && (
            <>
              <Button variant="ghost" asChild className="hidden sm:inline-flex hover:bg-[#f5f5f7] text-foreground/80">
                <Link href="/auth/sign-in">Login</Link>
              </Button>
              <Button asChild className="bg-black hover:bg-black/90 text-white shadow-sm">
                <Link href="/auth/sign-up">Sign Up</Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
} 
