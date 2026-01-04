"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Home,
  Trophy,
  Dumbbell,
  Users,
  Calendar,
  Bell,
  Menu,
  X,
  Search,
  Flame,
  GraduationCap,
  ClipboardList,
  Swords,
  Radio,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/feed", label: "Feed", icon: Home },
  { href: "/rankings", label: "Rankings", icon: Trophy },
  { href: "/ranked", label: "Ranked", icon: Swords },
  { href: "/live", label: "Live", icon: Radio },
  { href: "/training", label: "Training", icon: Dumbbell },
  { href: "/meets", label: "Meets", icon: Calendar },
  { href: "/recruiting", label: "Recruiting", icon: GraduationCap },
  { href: "/coach", label: "Coach", icon: ClipboardList },
];

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full glass border-b border-orange-500/20">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-600 group-hover:scale-110 transition-transform shadow-lg shadow-orange-500/30">
              <span className="text-lg font-black text-white">TV</span>
            </div>
            <span className="hidden font-black text-xl tracking-tight sm:inline-block">
              TRACK<span className="text-orange-500">VERSE</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button variant="ghost" className="gap-2 text-white/70 hover:text-white hover:bg-orange-500/10 font-semibold">
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Button>
              </Link>
            ))}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="hidden sm:flex text-white/70 hover:text-white hover:bg-orange-500/10">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="relative text-white/70 hover:text-white hover:bg-orange-500/10">
              <Bell className="h-5 w-5" />
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-orange-500 text-[10px] font-bold text-white animate-pulse">
                3
              </span>
            </Button>
            
            {/* Streak indicator */}
            <div className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30">
              <Flame className="h-4 w-4 text-orange-500 fire-animate" />
              <span className="text-sm font-bold text-orange-400">12</span>
            </div>
            
            <Avatar className="h-9 w-9 cursor-pointer ring-2 ring-orange-500/50 hover:ring-orange-500 transition-all">
              <AvatarImage src="" alt="User" />
              <AvatarFallback className="bg-gradient-to-br from-orange-500 to-red-600 text-white text-sm font-bold">
                JD
              </AvatarFallback>
            </Avatar>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-white/70 hover:text-white hover:bg-white/10"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="border-t border-white/10 py-4 md:hidden">
            <div className="flex flex-col gap-1">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-2 text-white/70 hover:text-white hover:bg-white/10"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
