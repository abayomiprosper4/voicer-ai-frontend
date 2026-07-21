"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLogin, useRegister } from "@/lib/api/queries";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export function AuthForm() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  
  const loginMutation = useLogin();
  const registerMutation = useRegister();
  
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (isLogin) {
      loginMutation.mutate(
        { email, password },
        {
          onSuccess: () => {
            router.push("/dashboard");
          },
          onError: (err: any) => {
            const data = err.response?.data;
            setErrorMsg(data?.message || data?.errors?.[0] || "Login failed. Please check your credentials.");
          }
        }
      );
    } else {
      const firstName = formData.get("firstName") as string;
      const lastName = formData.get("lastName") as string;
      
      registerMutation.mutate(
        { firstName, lastName, email, password },
        {
          onSuccess: () => {
            setSuccessMsg("Registration successful! You can now log in.");
            setIsLogin(true);
          },
          onError: (err: any) => {
            const data = err.response?.data;
            setErrorMsg(data?.message || data?.errors?.[0] || "Registration failed. Please try again.");
          }
        }
      );
    }
  };

  const isPending = loginMutation.isPending || registerMutation.isPending;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-sm mx-auto space-y-6"
    >
      <div className="flex justify-center mb-2">
        <div className="w-10 h-10 rounded-xl bg-foreground text-background flex items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
            <circle cx="4" cy="12" r="4" fill="currentColor" />
            <circle cx="12" cy="12" r="2.5" fill="currentColor" opacity="0.7" />
            <circle cx="19" cy="12" r="1.5" fill="currentColor" opacity="0.4" />
          </svg>
        </div>
      </div>
      <div className="space-y-2 text-center h-[68px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={isLogin ? "login" : "register"}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <h1 className="text-2xl font-bold tracking-tight">
              {isLogin ? "Welcome back" : "Create your account"}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {isLogin 
                ? "Enter your credentials to access your workspace" 
                : "Sign up to start building audio datasets"}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {errorMsg && (
        <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 border border-destructive/20 p-3 rounded-md">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <p>{errorMsg}</p>
        </div>
      )}

      {successMsg && (
        <div className="text-sm text-[#1089a0] bg-[#1089a0]/10 border border-[#1089a0]/20 p-3 rounded-md">
          <p>{successMsg}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <AnimatePresence initial={false}>
          {!isLogin && (
            <motion.div 
              initial={{ height: 0, opacity: 0, overflow: "hidden" }}
              animate={{ height: "auto", opacity: 1, overflow: "visible" }}
              exit={{ height: 0, opacity: 0, overflow: "hidden" }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <div className="grid grid-cols-2 gap-4 pb-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">First Name</Label>
                  <Input 
                    id="firstName" 
                    name="firstName" 
                    placeholder="John" 
                    required 
                    disabled={isPending}
                    className="rounded-md border-border bg-background focus-visible:ring-1 focus-visible:ring-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Last Name</Label>
                  <Input 
                    id="lastName" 
                    name="lastName" 
                    placeholder="Doe" 
                    required 
                    disabled={isPending}
                    className="rounded-md border-border bg-background focus-visible:ring-1 focus-visible:ring-foreground"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email</Label>
          <Input 
            id="email" 
            name="email" 
            type="email" 
            placeholder="name@example.com" 
            required 
            disabled={isPending}
            className="rounded-md border-border bg-background focus-visible:ring-1 focus-visible:ring-foreground"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Password</Label>
            <AnimatePresence>
              {isLogin && (
                <motion.button 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  type="button" 
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Forgot password?
                </motion.button>
              )}
            </AnimatePresence>
          </div>
          <Input 
            id="password" 
            name="password" 
            type="password" 
            required 
            disabled={isPending}
            minLength={8}
            className="rounded-md border-border bg-background focus-visible:ring-1 focus-visible:ring-foreground"
          />
        </div>

        <Button 
          type="submit" 
          disabled={isPending} 
          className="w-full rounded-md bg-foreground text-background hover:bg-foreground/90 h-10 font-semibold mt-6"
        >
          {isPending 
            ? (isLogin ? "Logging in..." : "Creating account...") 
            : (isLogin ? "Log in" : "Create account")}
        </Button>
      </form>

      <div className="text-center text-sm text-muted-foreground">
        {isLogin ? "Don't have an account? " : "Already have an account? "}
        <button
          type="button"
          onClick={() => {
            setIsLogin(!isLogin);
            setErrorMsg("");
            setSuccessMsg("");
          }}
          className="text-foreground font-semibold hover:underline"
        >
          {isLogin ? "Sign up" : "Log in"}
        </button>
      </div>
    </motion.div>
  );
}
