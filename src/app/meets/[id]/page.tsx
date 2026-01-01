"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Navbar } from "@/components/trackverse/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TierBadge } from "@/components/trackverse/tier-badge";
import { Tier } from "@/lib/rankings";
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  ChevronLeft,
  Trophy,
  Medal,
  Timer,
  Flag,
  Share2,
  Bell,
  Flame,
  Plus,
  ExternalLink,
} from "lucide-react";

// Mock meet data
const meetData = {
  "meet-1": {
    id: "meet-1",
    name: "Regional Championships",
    date: new Date(2025, 0, 15),
    startTime: "8:00 AM",
    location: "Lincoln Stadium",
    address: "1234 Stadium Way",
    city: "Springfield",
    state: "OR",
    type: "championship",
    level: "high_school",
    participants: 450,
    registered: true,
    description: "Regional qualifying meet for state championships. Top 8 in each event advance to state.",
    events: ["100m", "200m", "400m", "800m", "1600m", "4x100m", "4x400m", "Long Jump", "High Jump", "Shot Put"],
    schedule: [
      { time: "8:00 AM", event: "Field Events Begin", type: "field" },
      { time: "9:00 AM", event: "100m Prelims", type: "running" },
      { time: "9:30 AM", event: "200m Prelims", type: "running" },
      { time: "10:00 AM", event: "400m Prelims", type: "running" },
      { time: "10:30 AM", event: "800m Finals", type: "running" },
      { time: "11:00 AM", event: "1600m Finals", type: "running" },
      { time: "12:00 PM", event: "Lunch Break", type: "break" },
      { time: "1:00 PM", event: "100m Finals", type: "running" },
      { time: "1:30 PM", event: "200m Finals", type: "running" },
      { time: "2:00 PM", event: "400m Finals", type: "running" },
      { time: "2:30 PM", event: "4x100m Finals", type: "relay" },
      { time: "3:00 PM", event: "4x400m Finals", type: "relay" },
    ],
    myEvents: [
      { event: "100m", seedTime: "11.25", heat: 2, lane: 5 },
      { event: "200m", seedTime: "22.80", heat: 1, lane: 4 },
      { event: "4x100m", seedTime: "43.50", leg: 2 },
    ],
    topAthletes: [
      { name: "Elias Bolt", school: "Lincoln HS", event: "100m", time: "10.15", tier: "GODSPEED" as Tier },
      { name: "Marcus Johnson", school: "Roosevelt HS", event: "100m", time: "10.48", tier: "WORLD_CLASS" as Tier },
      { name: "Tyler Smith", school: "Jefferson HS", event: "200m", time: "20.45", tier: "GODSPEED" as Tier },
    ],
  },
};

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

const getScheduleTypeStyle = (type: string) => {
  switch (type) {
    case "running":
      return "bg-orange-500/20 border-orange-500/30 text-orange-400";
    case "field":
      return "bg-blue-500/20 border-blue-500/30 text-blue-400";
    case "relay":
      return "bg-purple-500/20 border-purple-500/30 text-purple-400";
    case "break":
      return "bg-gray-500/20 border-gray-500/30 text-gray-400";
    default:
      return "bg-white/5 border-white/10 text-white/60";
  }
};

export default function MeetDetailsPage() {
  const params = useParams();
  const meetId = params.id as string;
  const meet = meetData[meetId as keyof typeof meetData] || meetData["meet-1"];
  const style = getMeetTypeStyle(meet.type);

  const getDaysUntil = () => {
    const now = new Date();
    const diff = meet.date.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const daysUntil = getDaysUntil();

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link href="/meets" className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-6 transition-colors">
          <ChevronLeft className="h-4 w-4" />
          Back to Meets
        </Link>

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className={`px-3 py-1 rounded-full text-sm font-bold border ${style.bg} ${style.border} ${style.text}`}>
                {style.icon} {meet.type}
              </span>
              {daysUntil > 0 && (
                <span className="px-3 py-1 rounded-full text-sm font-bold bg-orange-500/20 border border-orange-500/30 text-orange-400">
                  {daysUntil} days away
                </span>
              )}
            </div>
            <h1 className="text-4xl font-black mb-2">{meet.name}</h1>
            <div className="flex flex-wrap items-center gap-4 text-white/60">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {meet.date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {meet.startTime}
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {meet.participants} athletes
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" className="bg-white/5 border-white/10 text-white hover:bg-white/10">
              <Bell className="h-4 w-4 mr-2" />
              Remind Me
            </Button>
            <Button variant="outline" className="bg-white/5 border-white/10 text-white hover:bg-white/10">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            {meet.registered ? (
              <span className="px-4 py-2 rounded-full bg-green-500/20 text-green-400 font-bold border border-green-500/30">
                ✓ Registered
              </span>
            ) : (
              <Button className="btn-track text-white font-bold">
                Register Now
              </Button>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Location Card */}
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-orange-500" />
                      Location
                    </h3>
                    <p className="text-white font-semibold">{meet.location}</p>
                    <p className="text-white/60">{meet.address}</p>
                    <p className="text-white/60">{meet.city}, {meet.state}</p>
                  </div>
                  <Button variant="outline" size="sm" className="bg-white/5 border-white/10 text-white hover:bg-white/10">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Directions
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* My Events */}
            {meet.registered && meet.myEvents && (
              <Card className="bg-orange-500/10 border-orange-500/30">
                <CardHeader>
                  <CardTitle className="text-lg text-white flex items-center gap-2">
                    <Flame className="h-5 w-5 text-orange-500" />
                    My Events
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {meet.myEvents.map((entry, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-black/30 border border-orange-500/20">
                      <div>
                        <p className="font-bold text-white">{entry.event}</p>
                        <p className="text-sm text-white/50">
                          {entry.heat ? `Heat ${entry.heat}, Lane ${entry.lane}` : `Leg ${entry.leg}`}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-mono font-bold text-yellow-400">{entry.seedTime}</p>
                        <p className="text-xs text-white/40">Seed Time</p>
                      </div>
                    </div>
                  ))}
                  <Button className="w-full bg-white/5 border border-white/10 text-white hover:bg-white/10">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Event Entry
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Schedule */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-lg text-white flex items-center gap-2">
                  <Timer className="h-5 w-5 text-orange-500" />
                  Event Schedule
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {meet.schedule.map((item, i) => (
                    <div 
                      key={i} 
                      className={`flex items-center gap-4 p-3 rounded-lg border ${getScheduleTypeStyle(item.type)}`}
                    >
                      <span className="font-mono text-sm w-20">{item.time}</span>
                      <span className="font-semibold flex-1">{item.event}</span>
                      {meet.myEvents?.some(e => item.event.includes(e.event)) && (
                        <span className="px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 text-xs font-bold">
                          YOUR EVENT
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-lg text-white">About This Meet</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/70">{meet.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {meet.events.map((event, i) => (
                    <span key={i} className="px-3 py-1 rounded-full bg-white/5 text-white/60 text-sm border border-white/10">
                      {event}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Top Athletes to Watch */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-lg text-white flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  Athletes to Watch
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {meet.topAthletes.map((athlete, i) => (
                  <div key={i} className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-bold text-white">{athlete.name}</p>
                      <TierBadge tier={athlete.tier} size="sm" />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/50">{athlete.school}</span>
                      <span className="font-mono text-yellow-400">{athlete.time}</span>
                    </div>
                    <p className="text-xs text-white/40 mt-1">{athlete.event}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-lg text-white">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full justify-start bg-white/5 border border-white/10 text-white hover:bg-white/10">
                  <Calendar className="h-4 w-4 mr-2" />
                  Add to Calendar
                </Button>
                <Button className="w-full justify-start bg-white/5 border border-white/10 text-white hover:bg-white/10">
                  <Users className="h-4 w-4 mr-2" />
                  View All Entries
                </Button>
                <Button className="w-full justify-start bg-white/5 border border-white/10 text-white hover:bg-white/10">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Official Results
                </Button>
              </CardContent>
            </Card>

            {/* Weather (placeholder) */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-lg text-white">Weather Forecast</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-4">
                  <p className="text-4xl mb-2">☀️</p>
                  <p className="text-2xl font-bold text-white">68°F</p>
                  <p className="text-white/50">Sunny, light wind</p>
                  <p className="text-xs text-white/30 mt-2">Perfect conditions for PRs!</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
