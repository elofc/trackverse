"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import {
  Trophy,
  Dumbbell,
  Users,
  TrendingUp,
  Zap,
  Target,
  ChevronRight,
  Play,
  Star,
  CheckCircle2,
  Flame,
  Timer,
  Medal,
} from "lucide-react";

// Rotating hero images - all sprinting focused
const heroImages = [
  {
    url: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=1920&q=80",
    alt: "Sprinter explosive start"
  },
  {
    url: "https://images.unsplash.com/photo-1541252260730-0412e8e2108e?w=1920&q=80",
    alt: "Sprinter in motion"
  },
  {
    url: "https://images.unsplash.com/photo-1532444458054-01a7dd3e9fca?w=1920&q=80",
    alt: "Sprint race finish"
  },
  {
    url: "https://images.unsplash.com/photo-1474546652694-a33f5d4f8f54?w=1920&q=80",
    alt: "Sprinter starting blocks"
  },
  {
    url: "https://images.unsplash.com/photo-1502904550040-7534597429ae?w=1920&q=80",
    alt: "Track sprinter running"
  },
];

export default function Home() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Rotate hero images every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Animated Background - Track Orange Theme */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-600/30 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-red-600/20 via-transparent to-transparent" />
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-orange-500/40 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-red-600/30 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-yellow-500/10 rounded-full blur-[200px]" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 z-50 w-full glass">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-600 group-hover:scale-110 transition-transform shadow-lg shadow-orange-500/30">
              <span className="text-lg font-black text-white">TV</span>
            </div>
            <span className="font-black text-xl tracking-tight">
              TRACK<span className="gradient-text">VERSE</span>
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-1">
            {["Feed", "Rankings", "Training", "Meets"].map((item) => (
              <Link key={item} href={`/${item.toLowerCase()}`}>
                <Button variant="ghost" className="text-white/70 hover:text-white hover:bg-orange-500/10 font-semibold">
                  {item}
                </Button>
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" className="text-white/70 hover:text-white font-semibold">Log in</Button>
            </Link>
            <Link href="/signup">
              <Button className="btn-track text-white font-bold px-6 rounded-full">
                Join Now
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section with Rotating Track Imagery */}
      <section className="relative min-h-screen flex items-center justify-center pt-16">
        {/* Rotating Background Images */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          {heroImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === currentImageIndex ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img 
                src={image.url}
                alt={image.alt}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
          {/* Dark overlay with orange tint */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black" />
          <div className="absolute inset-0 bg-orange-900/20" />
        </div>
        
        {/* Image indicators */}
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentImageIndex 
                  ? 'bg-orange-500 w-8' 
                  : 'bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            {/* Live indicator */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/30 mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
              </span>
              <span className="text-sm font-semibold text-white/80">50K+ athletes competing right now</span>
              <Flame className="h-4 w-4 text-orange-500 fire-animate" />
            </div>
            
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter mb-6 leading-none">
              <span className="block text-white">OWN</span>
              <span className="block text-orange-500 track-glow">THE TRACK</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/60 mb-10 max-w-2xl mx-auto font-medium">
              Log PRs. Climb rankings. Build your legacy.<br/>
              <span className="text-orange-400">The platform built for track athletes.</span>
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Link href="/signup">
                <Button size="lg" className="btn-track text-white font-bold px-8 py-6 text-lg rounded-full group">
                  <span className="flex items-center gap-2">
                    GET ON THE TRACK
                    <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-orange-500/30 text-white hover:bg-orange-500/10 px-8 py-6 text-lg rounded-full gap-2">
                <Play className="h-5 w-5 fill-current" />
                See It In Action
              </Button>
            </div>
            
            {/* Social proof */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
              {[
                { icon: Trophy, text: "1M+ PRs logged", color: "text-yellow-400" },
                { icon: Users, text: "500+ schools", color: "text-orange-400" },
                { icon: Flame, text: "100% free forever", color: "text-red-400" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-white/60">
                  <item.icon className={`h-4 w-4 ${item.color}`} />
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-orange-500/30 flex items-start justify-center p-2">
            <div className="w-1 h-2 bg-orange-500/60 rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* Stats Section - Track Orange */}
      <section className="relative py-20 z-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { value: "50K+", label: "ATHLETES", emoji: "🏃" },
              { value: "1M+", label: "PRs LOGGED", emoji: "⏱️" },
              { value: "500+", label: "SCHOOLS", emoji: "🏫" },
              { value: "#1", label: "TRACK APP", emoji: "🥇" },
            ].map((stat, i) => (
              <div key={i} className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-red-600/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all opacity-0 group-hover:opacity-100" />
                <div className="relative bg-white/5 border border-orange-500/20 rounded-2xl p-6 text-center hover:border-orange-500/40 transition-all">
                  <span className="text-3xl mb-2 block">{stat.emoji}</span>
                  <div className="text-4xl md:text-5xl font-black text-orange-500">
                    {stat.value}
                  </div>
                  <p className="text-white/50 text-sm font-bold tracking-wider mt-1">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section - Track Orange Theme */}
      <section id="features" className="relative py-20 z-10">
        {/* Track surface image */}
        <div className="absolute inset-0 z-0 opacity-5">
          <img 
            src="https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=1920&q=80"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <span className="text-orange-500 font-bold text-sm tracking-wider uppercase mb-4 block">WHY TRACKVERSE?</span>
            <h2 className="text-5xl md:text-6xl font-black mb-4">
              BUILT FOR <span className="text-orange-500">ATHLETES</span>
            </h2>
            <p className="text-xl text-white/50 max-w-2xl mx-auto">
              Every feature designed by track athletes, for track athletes.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Trophy,
                title: "LIVE RANKINGS",
                description: "See where you stack up. School. State. Nation. Updated in real-time.",
                gradient: "from-yellow-500 to-orange-500",
                emoji: "🥇",
              },
              {
                icon: TrendingUp,
                title: "PR TRACKING",
                description: "Log every PR. Watch your progress. Celebrate every W.",
                gradient: "from-orange-500 to-red-500",
                emoji: "⏱️",
              },
              {
                icon: Dumbbell,
                title: "TRAINING LOG",
                description: "Log workouts. Track load. Train smarter, not just harder.",
                gradient: "from-red-500 to-orange-600",
                emoji: "💪",
              },
              {
                icon: Users,
                title: "TEAM FEED",
                description: "Follow rivals. Hype teammates. Build your track family.",
                gradient: "from-orange-600 to-yellow-500",
                emoji: "🔥",
              },
              {
                icon: Timer,
                title: "MEET RESULTS",
                description: "Log results instantly. Auto-update rankings. Share your wins.",
                gradient: "from-yellow-500 to-orange-500",
                emoji: "🏁",
              },
              {
                icon: Medal,
                title: "ACHIEVEMENTS",
                description: "Earn badges. Unlock tiers. Show off your accomplishments.",
                gradient: "from-yellow-400 to-yellow-600",
                emoji: "🏆",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="group relative"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-all duration-500`} />
                <div className="relative bg-white/5 border border-orange-500/20 rounded-2xl p-8 hover:border-orange-500/40 transition-all hover:-translate-y-2 duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`inline-flex rounded-xl bg-gradient-to-br ${feature.gradient} p-3`}>
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-3xl">{feature.emoji}</span>
                  </div>
                  <h3 className="text-xl font-black mb-2 tracking-tight">{feature.title}</h3>
                  <p className="text-white/50">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Rankings Preview - Track Orange Leaderboard */}
      <section id="rankings" className="relative py-20 z-10">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-orange-500 font-bold text-sm tracking-wider uppercase mb-4 block">LEADERBOARDS</span>
              <h2 className="text-5xl md:text-6xl font-black mb-6">
                KNOW YOUR <span className="text-yellow-400">RANK</span>
              </h2>
              <p className="text-xl text-white/50 mb-8">
                Real-time rankings across school, state, and nation. 
                Watch yourself climb. Chase the gold. 🥇
              </p>
              
              <div className="space-y-3">
                {[
                  { tier: "WORLD CLASS", time: "< 10.50s", color: "from-yellow-400 to-yellow-600", emoji: "🥇" },
                  { tier: "NATIONAL", time: "< 10.80s", color: "from-orange-500 to-red-500", emoji: "🔥" },
                  { tier: "ALL-STATE", time: "< 11.20s", color: "from-orange-400 to-orange-600", emoji: "⭐" },
                  { tier: "ELITE", time: "< 11.50s", color: "from-red-500 to-red-700", emoji: "💪" },
                  { tier: "VARSITY", time: "< 12.00s", color: "from-gray-400 to-gray-600", emoji: "✓" },
                ].map((tier, i) => (
                  <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-white/5 border border-orange-500/20 hover:border-orange-500/40 transition-all">
                    <span className="text-2xl">{tier.emoji}</span>
                    <div className={`h-2 w-2 rounded-full bg-gradient-to-r ${tier.color}`} />
                    <span className="font-black text-sm tracking-wider flex-1">{tier.tier}</span>
                    <span className="text-white/50 text-sm font-mono">{tier.time}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/30 to-yellow-500/20 rounded-3xl blur-3xl" />
              <div className="relative rounded-2xl bg-white/5 border border-orange-500/30 overflow-hidden">
                <div className="bg-gradient-to-r from-orange-500/20 to-yellow-500/10 p-4 border-b border-orange-500/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-500 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                      </span>
                      <span className="font-black text-sm">LIVE RANKINGS</span>
                    </div>
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-orange-500/20 text-orange-400">100M</span>
                  </div>
                </div>
                <div className="divide-y divide-white/5">
                  {[
                    { rank: 1, name: "Marcus Johnson", school: "Lincoln HS", time: "10.45", change: "+2", tier: "🥇" },
                    { rank: 2, name: "Tyler Smith", school: "Roosevelt HS", time: "10.62", change: "-1", tier: "🥈" },
                    { rank: 3, name: "James Williams", school: "Jefferson HS", time: "10.78", change: "0", tier: "🥉" },
                    { rank: 4, name: "Chris Davis", school: "Washington HS", time: "10.95", change: "+5", tier: "🔥" },
                    { rank: 5, name: "Michael Brown", school: "Adams HS", time: "11.12", change: "-1", tier: "⭐" },
                  ].map((athlete, i) => (
                    <div key={i} className={`flex items-center gap-4 p-4 hover:bg-orange-500/5 transition-colors ${i === 0 ? 'bg-gradient-to-r from-yellow-500/10 to-transparent' : ''}`}>
                      <span className={`rank-display text-2xl w-8 text-center ${i === 0 ? 'text-yellow-400' : i === 1 ? 'text-gray-300' : i === 2 ? 'text-amber-600' : 'text-white/50'}`}>
                        {athlete.rank}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold truncate">{athlete.name}</p>
                        <p className="text-sm text-white/40 truncate">{athlete.school}</p>
                      </div>
                      <div className="text-right">
                        <p className="time-display text-lg font-black">{athlete.time}</p>
                        <div className="flex items-center justify-end gap-1">
                          <span className="text-xl">{athlete.tier}</span>
                          <span className={`text-xs font-bold ${athlete.change.startsWith('+') ? 'text-green-500' : athlete.change === '0' ? 'text-white/30' : 'text-red-500'}`}>
                            {athlete.change !== '0' && athlete.change}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Track Orange with Unsplash */}
      <section className="relative py-20 z-10">
        <div className="container mx-auto px-4">
          <div className="relative rounded-3xl overflow-hidden">
            {/* Background image of track */}
            <div className="absolute inset-0">
              <img 
                src="https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=1920&q=80"
                alt=""
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-orange-600/90 via-red-600/80 to-orange-600/90" />
            </div>
            
            <div className="relative p-12 md:p-20 text-center">
              <span className="text-6xl mb-6 block">🏃‍♂️🔥</span>
              <h2 className="text-5xl md:text-7xl font-black mb-6">
                GET ON THE TRACK
              </h2>
              <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
                Join 50K+ athletes already logging PRs, climbing rankings, and building their legacy. 
                100% free. Forever.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/signup">
                  <Button size="lg" className="bg-black text-white hover:bg-black/80 font-black px-8 py-6 text-lg rounded-full gap-2">
                    START NOW — IT&apos;S FREE
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer - Track Orange Theme */}
      <footer className="relative z-10 border-t border-orange-500/20 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-600 shadow-lg shadow-orange-500/30">
                <span className="text-lg font-black text-white">TV</span>
              </div>
              <span className="font-black text-xl tracking-tight">
                TRACK<span className="text-orange-500">VERSE</span>
              </span>
            </Link>
            
            <div className="flex items-center gap-6">
              {["Feed", "Rankings", "Training", "About"].map((link) => (
                <Link key={link} href={`/${link.toLowerCase()}`} className="text-sm text-white/50 hover:text-orange-400 transition-colors font-semibold">
                  {link}
                </Link>
              ))}
            </div>
            
            <div className="flex items-center gap-4">
              <Link href="#" className="text-white/50 hover:text-orange-400 transition-colors">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/></svg>
              </Link>
              <Link href="#" className="text-white/50 hover:text-orange-400 transition-colors">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z"/><circle cx="12" cy="12" r="3.5"/></svg>
              </Link>
              <Link href="#" className="text-white/50 hover:text-orange-400 transition-colors">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </Link>
            </div>
          </div>
          
          <div className="border-t border-orange-500/20 mt-8 pt-8 text-center">
            <p className="text-sm text-white/30">
              © 2024 TrackVerse. Built for athletes, by athletes. 🏃‍♂️
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
