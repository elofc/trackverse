"use client";

import { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/trackverse/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { TierBadge } from "@/components/trackverse/tier-badge";
import { Tier } from "@/lib/rankings";
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  ChevronRight,
  Search,
  Plus,
  Trophy,
  CalendarDays,
  Flame,
  Zap,
  Medal,
  Timer,
  Flag,
} from "lucide-react";

const upcomingMeets = [
  {
    id: "meet-1",
    name: "Regional Championships",
    date: new Date(2025, 0, 15),
    location: "Lincoln Stadium",
    city: "Springfield",
    state: "OR",
    type: "championship",
    level: "high_school",
    participants: 450,
    registered: true,
    events: ["100m", "200m", "400m", "4x100m", "Long Jump"],
    description: "Regional qualifying meet for state championships",
  },
  {
    id: "meet-2",
    name: "Winter Invitational",
    date: new Date(2025, 0, 22),
    location: "Roosevelt Track Complex",
    city: "Riverside",
    state: "CA",
    type: "invitational",
    level: "high_school",
    participants: 280,
    registered: false,
    events: ["100m", "200m", "400m", "800m", "High Jump", "Shot Put"],
    description: "Annual winter indoor invitational",
  },
  {
    id: "meet-3",
    name: "State Qualifiers",
    date: new Date(2025, 1, 5),
    location: "State Athletic Complex",
    city: "Capital City",
    state: "OR",
    type: "championship",
    level: "high_school",
    participants: 620,
    registered: true,
    events: ["All Events"],
    description: "Final qualifying meet before state championships",
  },
  {
    id: "meet-4",
    name: "Dual Meet vs Jefferson",
    date: new Date(2025, 1, 12),
    location: "Home Track",
    city: "Springfield",
    state: "OR",
    type: "dual",
    level: "high_school",
    participants: 80,
    registered: true,
    events: ["100m", "200m", "400m", "4x400m"],
    description: "Conference dual meet",
  },
];

const pastMeets = [
  {
    id: "meet-5",
    name: "Season Opener",
    date: new Date(2024, 11, 10),
    location: "Adams Field",
    city: "Portland",
    state: "OR",
    type: "invitational",
    results: [
      { event: "100m", place: 2, time: "11.25", tier: "ELITE" as Tier },
      { event: "200m", place: 4, time: "23.10", tier: "VARSITY" as Tier },
    ],
  },
  {
    id: "meet-6",
    name: "Holiday Classic",
    date: new Date(2024, 11, 20),
    location: "Madison Arena",
    city: "Seattle",
    state: "WA",
    type: "invitational",
    results: [
      { event: "200m", place: 1, time: "22.80", tier: "ALL_STATE" as Tier, isPR: true },
      { event: "100m", place: 3, time: "11.18", tier: "ELITE" as Tier, isPR: true },
    ],
  },
  {
    id: "meet-7",
    name: "Pre-Season Time Trial",
    date: new Date(2024, 10, 15),
    location: "Lincoln HS Track",
    city: "Springfield",
    state: "OR",
    type: "dual",
    results: [
      { event: "100m", place: 1, time: "11.42", tier: "ELITE" as Tier },
    ],
  },
];

const getMeetTypeStyle = (type: string) => {
  switch (type) {
    case "championship":
      return { bg: "bg-purple-500/20", border: "border-purple-500/30", text: "text-purple-400", icon: "🏆" };
    case "invitational":
      return { bg: "bg-blue-500/20", border: "border-blue-500/30", text: "text-blue-400", icon: "🎯" };
    case "dual":
      return { bg: "bg-green-500/20", border: "border-green-500/30", text: "text-green-400", icon: "⚔️" };
    default:
      return { bg: "bg-gray-500/20", border: "border-gray-500/30", text: "text-gray-400", icon: "📍" };
  }
};

const getDaysUntil = (date: Date) => {
  const now = new Date();
  const diff = date.getTime() - now.getTime();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  return days;
};

export default function MeetsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-black flex items-center gap-3">
              <Calendar className="h-10 w-10 text-orange-500" />
              <span>MEETS</span>
              <Flag className="h-6 w-6 text-green-400" />
            </h1>
            <p className="text-white/60 mt-1">
              Track upcoming competitions and log your results
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
              <Input 
                placeholder="Search meets..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 w-64 bg-white/5 border-white/10 text-white placeholder:text-white/30" 
              />
            </div>
            <Link href="/meets/add-result">
              <Button className="btn-track text-white font-bold gap-2">
                <Plus className="h-4 w-4" />
                Add Result
              </Button>
            </Link>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Upcoming Meets", value: "4", icon: CalendarDays, color: "orange" },
            { label: "Registered", value: "3", icon: Users, color: "green" },
            { label: "Season PRs", value: "2", icon: Trophy, color: "yellow" },
            { label: "Meets Competed", value: "8", icon: Calendar, color: "blue" },
          ].map((stat, i) => (
            <Card key={i} className="bg-white/5 border-white/10">
              <CardContent className="p-4 flex items-center gap-4">
                <div className={`rounded-lg p-3 ${
                  stat.color === "orange" ? "bg-orange-500/20" :
                  stat.color === "green" ? "bg-green-500/20" :
                  stat.color === "yellow" ? "bg-yellow-500/20" :
                  "bg-blue-500/20"
                }`}>
                  <stat.icon className={`h-5 w-5 ${
                    stat.color === "orange" ? "text-orange-500" :
                    stat.color === "green" ? "text-green-500" :
                    stat.color === "yellow" ? "text-yellow-500" :
                    "text-blue-500"
                  }`} />
                </div>
                <div>
                  <p className="text-2xl font-black text-white">{stat.value}</p>
                  <p className="text-xs text-white/50">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="mb-6 bg-white/5 border border-white/10">
            <TabsTrigger value="upcoming" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              Upcoming
            </TabsTrigger>
            <TabsTrigger value="past" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              Past Results
            </TabsTrigger>
            <TabsTrigger value="calendar" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              Calendar
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-4">
            {upcomingMeets.map((meet) => {
              const style = getMeetTypeStyle(meet.type);
              const daysUntil = getDaysUntil(meet.date);
              
              return (
                <Link href={`/meets/${meet.id}`} key={meet.id}>
                  <Card className="overflow-hidden bg-white/5 border-white/10 hover:border-orange-500/50 transition-all cursor-pointer group">
                    <CardContent className="p-0">
                      <div className="flex flex-col md:flex-row">
                        {/* Date Badge */}
                        <div className="bg-orange-500/10 p-6 flex flex-col items-center justify-center md:w-36 border-r border-white/10">
                          <span className="text-4xl font-black text-orange-500">
                            {meet.date.getDate()}
                          </span>
                          <span className="text-sm text-white/60 uppercase font-bold">
                            {meet.date.toLocaleDateString("en-US", { month: "short" })}
                          </span>
                          {daysUntil > 0 && daysUntil <= 7 && (
                            <span className="mt-2 text-xs px-2 py-1 rounded-full bg-orange-500/20 text-orange-400 font-bold">
                              {daysUntil} days
                            </span>
                          )}
                        </div>

                        {/* Meet Info */}
                        <div className="flex-1 p-6">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="text-xl font-bold text-white group-hover:text-orange-400 transition-colors">
                                  {meet.name}
                                </h3>
                                <span className={`px-2 py-1 rounded-full text-xs font-bold border ${style.bg} ${style.border} ${style.text}`}>
                                  {style.icon} {meet.type}
                                </span>
                              </div>
                              <div className="flex flex-wrap items-center gap-4 text-sm text-white/50 mb-3">
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-4 w-4" />
                                  {meet.location}, {meet.city}, {meet.state}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  {meet.date.toLocaleDateString("en-US", { weekday: "long" })}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Users className="h-4 w-4" />
                                  {meet.participants} athletes
                                </span>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {meet.events.slice(0, 4).map((event, i) => (
                                  <span key={i} className="text-xs px-2 py-1 rounded bg-white/5 text-white/60">
                                    {event}
                                  </span>
                                ))}
                                {meet.events.length > 4 && (
                                  <span className="text-xs px-2 py-1 rounded bg-white/5 text-white/40">
                                    +{meet.events.length - 4} more
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {meet.registered ? (
                                <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-sm font-bold border border-green-500/30">
                                  ✓ Registered
                                </span>
                              ) : (
                                <Button size="sm" className="btn-track text-white font-bold">
                                  Register
                                </Button>
                              )}
                              <ChevronRight className="h-5 w-5 text-white/30 group-hover:text-orange-500 transition-colors" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </TabsContent>

          <TabsContent value="past" className="space-y-4">
            {pastMeets.map((meet) => {
              const style = getMeetTypeStyle(meet.type);
              
              return (
                <Card key={meet.id} className="overflow-hidden bg-white/5 border-white/10">
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row">
                      {/* Date Badge */}
                      <div className="bg-white/5 p-6 flex flex-col items-center justify-center md:w-36 border-r border-white/10">
                        <span className="text-4xl font-black text-white/60">
                          {meet.date.getDate()}
                        </span>
                        <span className="text-sm text-white/40 uppercase font-bold">
                          {meet.date.toLocaleDateString("en-US", { month: "short" })}
                        </span>
                      </div>

                      {/* Meet Info */}
                      <div className="flex-1 p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-white mb-1">{meet.name}</h3>
                            <p className="text-sm text-white/50 flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {meet.location}, {meet.city}, {meet.state}
                            </p>
                          </div>
                          <Link href={`/meets/${meet.id}`}>
                            <Button variant="outline" size="sm" className="bg-white/5 border-white/10 text-white hover:bg-white/10">
                              View Details
                            </Button>
                          </Link>
                        </div>
                        
                        {/* Results */}
                        <div className="space-y-2">
                          {meet.results.map((result, i) => (
                            <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-white/5 border border-white/10">
                              <div className="flex items-center gap-2">
                                {result.place === 1 && <Trophy className="h-5 w-5 text-yellow-500" />}
                                {result.place === 2 && <Medal className="h-5 w-5 text-gray-400" />}
                                {result.place === 3 && <Medal className="h-5 w-5 text-amber-600" />}
                                <span className="font-bold text-white">
                                  {result.place === 1 ? "1st" : result.place === 2 ? "2nd" : result.place === 3 ? "3rd" : `${result.place}th`}
                                </span>
                              </div>
                              <span className="text-white/60">•</span>
                              <span className="text-white/80">{result.event}</span>
                              <span className="text-white/60">•</span>
                              <span className="font-mono font-bold text-yellow-400">{result.time}</span>
                              <TierBadge tier={result.tier} size="sm" />
                              {result.isPR && (
                                <span className="px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 text-xs font-bold border border-green-500/30 flex items-center gap-1">
                                  <Flame className="h-3 w-3" /> PR!
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>

          <TabsContent value="calendar">
            <Card className="p-12 bg-white/5 border-white/10">
              <div className="text-center">
                <CalendarDays className="h-16 w-16 mx-auto text-orange-500/50 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Calendar View Coming Soon</h3>
                <p className="text-white/50 mb-6">
                  View all your meets in a monthly calendar format
                </p>
                <Button className="btn-track text-white font-bold">
                  Get Notified
                </Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
