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
          emailRedirectTo: `${window.location.origin}/auth/callback`,
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

  // const handleGitHubSignUp = async () => {
  //   try {
  //     const { error } = await supabase.auth.signInWithOAuth({
  //       provider: 'github',
  //       options: {
  //         redirectTo: `${window.location.origin}/auth/callback`,
  //       },
  //     });

  //     if (error) {
  //       toast.error(error.message);
  //     }
  //   } catch (error) {
  //     console.error('Error signing up with GitHub:', error);
  //     toast.error('Failed to sign up with GitHub');
  //   }
  // };

  const handleGitHubSignUp = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
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
    <div className="flex min-h-screen flex-col bg-background">
      <Header showAuthButtons={false} />
      
      <main className="flex-1 flex items-center justify-center py-16 px-4">
        <div className="absolute inset-0 bg-hero-glow opacity-50"></div>
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -inset-[10px] opacity-50">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] animate-pulse"></div>
            <div className="absolute top-1/4 left-1/3 w-[300px] h-[300px] bg-blue-500/20 rounded-full blur-[100px] animate-pulse delay-300"></div>
            <div className="absolute bottom-1/3 right-1/4 w-[250px] h-[250px] bg-purple-500/20 rounded-full blur-[100px] animate-pulse delay-700"></div>
          </div>
        </div>

        <div className="relative z-10 w-full max-w-[420px]">
          <Card className="border border-white/10 bg-black/40 backdrop-blur-xl">
            <CardHeader className="space-y-1 pb-8">
              <div className="w-full flex justify-center mb-4">
                <div className="p-4 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm">
                  <UserPlus className="w-6 h-6 text-primary" />
                </div>
              </div>
              <CardTitle className="text-2xl text-center bg-clip-text text-transparent bg-gradient-to-r from-white via-primary/90 to-primary">
                Create Your Account
              </CardTitle>
              <p className="text-sm text-center text-white/50">
                Join thousands of developers testing webhooks
              </p>
            </CardHeader>
            <CardContent className="relative">
              <div className="absolute -inset-[1px] rounded-[inherit] bg-gradient-to-r from-primary/20 via-white/10 to-primary/20 blur-[1px]"></div>
              <div className="relative bg-black/50 rounded-[inherit] p-6 backdrop-blur-xl">
                <div className="flex flex-col space-y-4">
                  <Button 
                    variant="outline" 
                    className="w-full border-white/10 bg-white/5 hover:bg-white/10 backdrop-blur-sm"
                    onClick={handleGitHubSignUp}
                  >
                    <GithubIcon className="mr-2 h-4 w-4" />
                    Continue with GitHub
                  </Button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-white/10"></span>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-white/50 backdrop-blur-sm">or continue with email</span>
                    </div>
                  </div>

                  <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-white/70">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-2.5 h-4 w-4 text-white/30" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="you@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="pl-10 bg-white/5 border-white/10 text-white focus:border-primary/50 focus:ring-primary/50"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-white/70">Password</Label>
                      <div className="relative">
                        <KeyRound className="absolute left-3 top-2.5 h-4 w-4 text-white/30" />
                        <Input
                          id="password"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          className="pl-10 bg-white/5 border-white/10 text-white focus:border-primary/50 focus:ring-primary/50"
                        />
                      </div>
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-primary hover:bg-primary/90 text-white"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
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
          
          <div className="mt-6 text-center text-sm text-white/50 backdrop-blur-sm">
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