"use client";

import { WebhookIcon } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { UserMenu } from '@/components/user-menu';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface HeaderProps {
  showAuthButtons?: boolean;
  showUserMenu?: boolean;
}

export function Header({ showAuthButtons = true, showUserMenu = false }: HeaderProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setIsLoggedIn(!!session);
      } catch (error) {
        console.error('Error checking auth status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 max-w-7xl mx-auto">
        <div className="flex items-center space-x-2">
          <WebhookIcon className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
            <Link href="/" className="hover:text-primary transition-colors">Moqa</Link>
          </span>
        </div>
        <nav className="flex items-center space-x-4">
          {showUserMenu && <UserMenu />}
          {showAuthButtons && !isLoading && (
            <>
              {isLoggedIn ? (
                <Button asChild className="bg-primary hover:bg-primary/90 text-white">
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
              ) : (
                <>
                  <Button variant="ghost" asChild className="hidden sm:inline-flex hover:bg-white/10 text-white/90">
                    <Link href="/auth/login">Login</Link>
                  </Button>
                  <Button asChild className="bg-primary hover:bg-primary/90 text-white">
                    <Link href="/auth/sign-up">Sign Up</Link>
                  </Button>
                </>
              )}
            </>
          )}
        </nav>
      </div>
    </header>
  );
} 