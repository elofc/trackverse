"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, EyeOff, Mail, Lock, User, School, ArrowRight, CheckCircle2, Flame } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<"athlete" | "coach" | "scout" | null>(null);
  const [error, setError] = useState("");
  
  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [school, setSchool] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1 && role) {
      setStep(2);
      return;
    }
    setIsLoading(true);
    setError("");
    
    // TODO: Replace with actual Supabase auth
    // const { error } = await signUp(email, password);
    // if (error) {
    //   setError(error.message);
    //   setIsLoading(false);
    //   return;
    // }
    
    // Simulate signup and redirect to onboarding
    await new Promise(resolve => setTimeout(resolve, 1500));
    router.push("/onboarding");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-600/20 via-transparent to-transparent" />
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-orange-500/30 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-red-600/20 rounded-full blur-[150px]" />
      </div>

      <Card className="w-full max-w-md relative z-10 bg-black/50 border-orange-500/30">
        <CardHeader className="text-center">
          <Link href="/" className="flex items-center justify-center gap-2 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-600 shadow-lg shadow-orange-500/30">
              <span className="text-xl font-black text-white">TV</span>
            </div>
          </Link>
          <CardTitle className="text-3xl font-black text-white">
            {step === 1 ? "JOIN THE MOVEMENT" : "CREATE ACCOUNT"}
          </CardTitle>
          <CardDescription className="text-white/60">
            {step === 1 
              ? "Select your role to get started" 
              : "Fill in your details to join TrackVerse"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              {error}
            </div>
          )}
          
          {step === 1 ? (
            <div className="space-y-4">
              <div className="grid gap-3">
                {[
                  { id: "athlete", label: "Athlete", description: "Track PRs, climb rankings, connect with teammates", icon: "🏃" },
                  { id: "coach", label: "Coach", description: "Manage your team, assign workouts, verify results", icon: "📋" },
                  { id: "scout", label: "Scout", description: "Discover talent, track prospects, connect with athletes", icon: "🔍" },
                ].map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setRole(option.id as "athlete" | "coach" | "scout")}
                    className={`flex items-start gap-4 p-4 rounded-xl transition-all text-left ${
                      role === option.id
                        ? "bg-orange-500/20 border-2 border-orange-500"
                        : "bg-white/5 border-2 border-transparent hover:bg-white/10"
                    }`}
                  >
                    <span className="text-2xl">{option.icon}</span>
                    <div className="flex-1">
                      <p className="font-bold text-white">{option.label}</p>
                      <p className="text-sm text-white/50">{option.description}</p>
                    </div>
                    {role === option.id && (
                      <CheckCircle2 className="h-5 w-5 text-orange-500" />
                    )}
                  </button>
                ))}
              </div>

              <Button 
                onClick={() => role && setStep(2)} 
                className="w-full btn-track text-white font-bold h-12 rounded-full"
                disabled={!role}
              >
                Continue
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center justify-center mb-4">
                <Badge className="capitalize bg-orange-500/20 text-orange-400 border-orange-500/30">
                  {role} Account
                </Badge>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-sm text-orange-400 hover:text-orange-300 ml-2"
                >
                  Change
                </button>
              </div>

              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-semibold text-white/80">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jordan Smith"
                    className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-white/30 h-12"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-semibold text-white/80">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="athlete@school.edu"
                    className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-white/30 h-12"
                    required
                  />
                </div>
              </div>

              {role === "athlete" && (
                <div className="space-y-2">
                  <label htmlFor="school" className="text-sm font-semibold text-white/80">
                    School
                  </label>
                  <div className="relative">
                    <School className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                    <Input
                      id="school"
                      type="text"
                      value={school}
                      onChange={(e) => setSchool(e.target.value)}
                      placeholder="Lincoln High School"
                      className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-white/30 h-12"
                      required
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-semibold text-white/80">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-9 pr-9 bg-white/5 border-white/10 text-white placeholder:text-white/30 h-12"
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <p className="text-xs text-white/40">
                  Must be at least 8 characters
                </p>
              </div>

              <Button type="submit" className="w-full btn-track text-white font-bold h-12 rounded-full" disabled={isLoading}>
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Creating account...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Flame className="h-4 w-4" />
                    CREATE ACCOUNT
                  </span>
                )}
              </Button>

              <p className="text-xs text-center text-white/40">
                By creating an account, you agree to our{" "}
                <Link href="/terms" className="text-orange-400 hover:text-orange-300">Terms of Service</Link>
                {" "}and{" "}
                <Link href="/privacy" className="text-orange-400 hover:text-orange-300">Privacy Policy</Link>
              </p>
            </form>
          )}

          {step === 2 && (
            <>
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-black/50 px-2 text-white/40">Or continue with</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="w-full bg-white/5 border-white/10 text-white hover:bg-white/10 h-11">
                  <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Google
                </Button>
                <Button variant="outline" className="w-full bg-white/5 border-white/10 text-white hover:bg-white/10 h-11">
                  <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  GitHub
                </Button>
              </div>
            </>
          )}

          <p className="text-center text-sm text-white/50 mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-orange-400 font-semibold hover:text-orange-300">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
