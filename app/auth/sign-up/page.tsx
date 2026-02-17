"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GithubIcon, UserPlus, Mail, KeyRound } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { getBaseUrl } from '@/lib/utils';
// import { getAuthConfig } from "@/lib/auth-config";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${getBaseUrl()}/auth/callback`,
        },
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success("Account created successfully");
      router.push("/dashboard");
    } catch (error) {
      console.error("Error signing up:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };


  const handleGitHubSignUp = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        // options: getAuthConfig(),
      });
  
      if (error) {
        toast.error(error.message);
      }
    } catch (error) {
      console.error("Error signing up with GitHub:", error);
      toast.error("An unexpected error occurred");
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#f7f7f9]">
      <Header showAuthButtons={false} />
      
      <main className="flex-1 flex items-center justify-center py-16 px-4">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-white to-[#f7f7f9]"></div>
        <div className="absolute inset-0">
          <div className="pointer-events-none absolute left-1/2 top-24 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-black/5 blur-[120px]"></div>
        </div>

        <div className="relative z-10 w-full max-w-[420px]">
          <Card className="border border-black/5 bg-white shadow-[0_12px_40px_-24px_rgba(0,0,0,0.2)]">
            <CardHeader className="space-y-2 pb-6">
              <div className="w-full flex justify-center">
                <div className="h-12 w-12 rounded-2xl border border-black/10 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)] flex items-center justify-center">
                  <UserPlus className="h-5 w-5 text-foreground" />
                </div>
              </div>
              <CardTitle className="text-2xl text-center tracking-tight text-foreground">
                Create Your Account
              </CardTitle>
              <p className="text-sm text-center text-muted-foreground">
                Join thousands of developers testing webhooks
              </p>
            </CardHeader>
            <CardContent className="relative">
              <div className="relative rounded-[inherit] p-6">
                <div className="flex flex-col space-y-4">
                  <Button 
                    variant="outline" 
                    className="w-full border-black/10 bg-white hover:bg-[#f5f5f7]"
                    onClick={handleGitHubSignUp}
                  >
                    <GithubIcon className="mr-2 h-4 w-4" />
                    Continue with GitHub
                  </Button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-black/10"></span>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white px-2 text-muted-foreground">or continue with email</span>
                    </div>
                  </div>

                  <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-foreground">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="you@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="pl-10 bg-background border-input text-foreground focus:border-primary/50 focus:ring-primary/50"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-foreground">Password</Label>
                      <div className="relative">
                        <KeyRound className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="password"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          className="pl-10 bg-background border-input text-foreground focus:border-primary/50 focus:ring-primary/50"
                        />
                      </div>
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-black hover:bg-black/90 text-white"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-muted-foreground/30 border-t-foreground rounded-full animate-spin"></div>
                          <span>Creating account...</span>
                        </div>
                      ) : (
                        "Create Account"
                      )}
                    </Button>
                  </form>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link 
              href="/auth/sign-in" 
              className="text-primary hover:text-primary/90 transition-colors font-medium"
            >
              Sign in instead
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
