
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { getAuthConfig } from '@/lib/auth-config';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GithubIcon, KeyRound, Mail } from "lucide-react";

function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Signing in...");
  const [loadingStartTime, setLoadingStartTime] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isLoading && loadingStartTime) {
      interval = setInterval(() => {
        const elapsedTime = Date.now() - loadingStartTime;
        
        if (elapsedTime <= 5000) {
          setLoadingMessage("Signing in...");
        } else if (elapsedTime <= 15000) {
          setLoadingMessage("Preparing your account");
        } else if (elapsedTime <= 25000) {
          setLoadingMessage("These things take time...");
        } else {
          setLoadingMessage("Wait a little longer");
        }
      }, 100);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isLoading, loadingStartTime]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoadingStartTime(Date.now());

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success("Signed in successfully");
      router.push("/dashboard");
    } catch (error) {
      console.error("Error signing in:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
      setLoadingStartTime(null);
      setLoadingMessage("Signing in..."); // Reset message for next attempt
    }
  };

  const handleGitHubSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: getAuthConfig(),
      });
  
      if (error) {
        toast.error(error.message);
      }
    } catch (error) {
      console.error("Error signing in with GitHub:", error);
      toast.error("An unexpected error occurred");
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      <Button 
        variant="outline" 
        className="w-full border-white/10 bg-white/5 hover:bg-white/10 backdrop-blur-sm"
        onClick={handleGitHubSignIn}
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

      <form onSubmit={handleSignIn} className="space-y-4">
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
              <span>{loadingMessage}</span>
            </div>
          ) : (
            "Sign In"
          )}
        </Button>
      </form>
    </div>
  );
}

export default SignInForm;