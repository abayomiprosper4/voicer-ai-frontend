"use client";

import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { Eye, EyeOff } from "lucide-react";
import gsap from "gsap";
import { Navbar } from "@/components/ui/navbar";
import { useGSAP } from "@gsap/react";
import { useState } from "react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useGSAP(() => {
    const tl = gsap.timeline();

    tl.from(".navbar-anim", {
      y: -20,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out",
    });
    gsap.from(".main-txt", {
      delay: 0.5,
      x: -80,
      opacity: 0,
      duration: 1.0,
      ease: "power3.out",
    });
    gsap.from(".txt-box", {
      delay: 0.5,
      x: 80,
      opacity: 0,
      duration: 1.0,
      ease: "power3.out",
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // TEST DUMMY CREDENTIALS. DELETE AFTER BACKEND INTEGRATION!!!!
    if (username === "demo" && password === "d1e2m3o") {
      setTimeout(() => {
        window.location.href = "/user";
      }, 500);
    } else {
      setError("Invalid username or password. Try demo/d1e2m3o");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background selection:bg-primary/30 overflow-x-hidden flex flex-col items-center justify-center p-4 sm:p-6">
      <Navbar />
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center pt-12 sm:pt-20">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-full sm:w-80 h-64 sm:h-96 bg-primary/10 blur-[80px] sm:blur-[120px] -z-10 pointer-events-none" />

        <div className="main-txt space-y-3 sm:space-y-4 px-2 sm:px-0">
          <p className="text-foreground text-xl sm:text-3xl font-medium">
            Welcome to Voicer Ai
          </p>
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold leading-tight sm:leading-[1.2] text-foreground tracking-tight">
            Building AI that <span className="block">understands</span> African
            voices.
          </h1>
        </div>

        <div className="txt-box flex justify-center lg:justify-end px-2 sm:px-0">
          <div className="w-full max-w-sm sm:max-w-md border border-border rounded-2xl p-6 sm:p-8 shadow-sm">
            <h2 className="text-2xl sm:text-3xl font-semibold text-center text-foreground mb-8 sm:mb-10">
              Log in
            </h2>

            {error && (
              <div className="mb-4 p-3 bg-destructive/10 text-destructive text-sm rounded-lg text-center">
                {error}
              </div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="username"
                  className="text-sm text-muted-foreground mb-1 block"
                >
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={loading}
                  className="w-full py-2.5 px-4 rounded-lg bg-surface text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 transition-all disabled:opacity-50"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="text-sm text-muted-foreground mb-1 block"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="......"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    className="w-full py-2.5 px-4 pr-10 rounded-lg bg-surface text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 transition-all disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="text-right pt-1">
                <button
                  type="button"
                  disabled={loading}
                  className="text-primary text-xs hover:underline cursor-pointer disabled:opacity-50"
                >
                  Forgot Password?
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-6 py-2.5 bg-cta text-cta-foreground rounded-full font-bold text-base hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
              >
                {loading ? "Logging in..." : "Log in"}
              </button>

              <Link href="/signup" className="block">
                <button
                  type="button"
                  disabled={loading}
                  className="w-full py-2.5 border border-foreground text-foreground text-center rounded-full font-semibold text-sm hover:bg-foreground hover:text-background transition-colors disabled:opacity-50 cursor-pointer flex justify-center items-center gap-2"
                >
                  Continue with <FcGoogle className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </Link>
            </form>

            <p className="text-xs text-muted-foreground text-center mt-6">
              Demo credentials: <span className="font-semibold">demo</span> /{" "}
              <span className="font-semibold">d1e2m3o</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
