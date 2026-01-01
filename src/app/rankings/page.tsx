"use client";

import { useState } from "react";
import { Navbar } from "@/components/trackverse/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { TierBadge, TierLegend } from "@/components/trackverse/tier-badge";
import { LeaderboardRow } from "@/components/trackverse/leaderboard-row";
import { createLeaderboard, TIERS, Tier, LeaderboardEntry } from "@/lib/rankings";
import {
  Trophy,
  Search,
  Filter,
  TrendingUp,
  Medal,
  Star,
  ChevronDown,
  Zap,
  Flame,
} from "lucide-react";

const events = [
  { id: "100m", name: "100m", category: "sprint", shortName: "100m" },
  { id: "200m", name: "200m", category: "sprint", shortName: "200m" },
  { id: "400m", name: "400m", category: "sprint", shortName: "400m" },
  { id: "800m", name: "800m", category: "distance", shortName: "800m" },
  { id: "1600m", name: "1600m", category: "distance", shortName: "1600m" },
  { id: "3200m", name: "3200m", category: "distance", shortName: "3200m" },
  { id: "110h", name: "110m Hurdles", category: "hurdles", shortName: "110H" },
  { id: "300h", name: "300m Hurdles", category: "hurdles", shortName: "300H" },
  { id: "4x100", name: "4x100m Relay", category: "relay", shortName: "4x1" },
  { id: "4x400", name: "4x400m Relay", category: "relay", shortName: "4x4" },
];

// Mock athlete data for leaderboard
const mockAthletes100m = [
  { id: "1", name: "Jaylen 'Flash' Thompson", school: "Lincoln HS", performance: 10150, previousRank: 1 },
  { id: "2", name: "Marcus Johnson", school: "Roosevelt HS", performance: 10480, previousRank: 3 },
  { id: "3", name: "Tyler Smith", school: "Jefferson HS", performance: 10620, previousRank: 2 },
  { id: "4", name: "James Williams", school: "Washington HS", performance: 10780, previousRank: 5 },
  { id: "5", name: "Chris Davis", school: "Adams HS", performance: 10950, previousRank: 4 },
  { id: "6", name: "Michael Brown", school: "Madison HS", performance: 11120, previousRank: 6 },
  { id: "7", name: "David Wilson", school: "Monroe HS", performance: 11180, previousRank: 9 },
  { id: "8", name: "Kevin Taylor", school: "Jackson HS", performance: 11250, previousRank: 7 },
  { id: "9", name: "Ryan Anderson", school: "Harrison HS", performance: 11320, previousRank: 8 },
  { id: "10", name: "Brandon Lee", school: "Franklin HS", performance: 11400, previousRank: 12 },
  { id: "11", name: "Justin Martinez", school: "Central HS", performance: 11450, previousRank: 10 },
  { id: "12", name: "Alex Rodriguez", school: "Westview HS", performance: 11520, previousRank: 11 },
  { id: "13", name: "Derek Thompson", school: "Eastside HS", performance: 11680, previousRank: null },
  { id: "14", name: "Jordan White", school: "Northside HS", performance: 11850, previousRank: 14 },
  { id: "15", name: "Cameron Black", school: "Southside HS", performance: 12100, previousRank: 15 },
];

const mockAthletes200m = [
  { id: "3", name: "Tyler Smith", school: "Jefferson HS", performance: 20450, previousRank: 1 },
  { id: "1", name: "Jaylen 'Flash' Thompson", school: "Lincoln HS", performance: 20680, previousRank: 2 },
  { id: "2", name: "Marcus Johnson", school: "Roosevelt HS", performance: 21200, previousRank: 3 },
  { id: "4", name: "James Williams", school: "Washington HS", performance: 21800, previousRank: 4 },
  { id: "5", name: "Chris Davis", school: "Adams HS", performance: 22100, previousRank: 6 },
];

const tierDistribution = [
  { tier: "GODSPEED" as Tier, count: 3, threshold: "Top 0.01%" },
  { tier: "WORLD_CLASS" as Tier, count: 12, threshold: "Top 0.1%" },
  { tier: "NATIONAL" as Tier, count: 156, threshold: "Top 1%" },
  { tier: "ALL_STATE" as Tier, count: 842, threshold: "Top 5%" },
  { tier: "ELITE" as Tier, count: 2340, threshold: "Top 15%" },
  { tier: "VARSITY" as Tier, count: 5621, threshold: "Top 40%" },
  { tier: "JV" as Tier, count: 8450, threshold: "Top 70%" },
  { tier: "ROOKIE" as Tier, count: 12450, threshold: "All Others" },
];

export default function RankingsPage() {
  const [selectedEvent, setSelectedEvent] = useState("100m");
  const [scope, setScope] = useState("state");
  
  // Generate leaderboard data
  const leaderboard = createLeaderboard(
    selectedEvent === "100m" ? mockAthletes100m : mockAthletes200m,
    selectedEvent,
    false
  );

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-black flex items-center gap-3">
              <Trophy className="h-10 w-10 text-orange-500" />
              <span>RANKINGS</span>
              <Zap className="h-6 w-6 text-yellow-400 animate-pulse" />
            </h1>
            <p className="text-white/60 mt-1">
              See where you stand. Chase GODSPEED status. ⚡
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
              <Input 
                placeholder="Search athletes..." 
                className="pl-9 w-64 bg-white/5 border-white/10 text-white placeholder:text-white/30" 
              />
            </div>
            <Button variant="outline" className="gap-2 bg-white/5 border-white/10 text-white hover:bg-white/10">
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </div>
        </div>

        {/* Your Position Card */}
        <Card className="mb-8 bg-gradient-to-r from-orange-500/10 via-transparent to-yellow-500/10 border-orange-500/30">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-500/20 border border-orange-500/30">
                  <Flame className="h-8 w-8 text-orange-500" />
                </div>
                <div>
                  <p className="text-sm text-white/60">Your Best Ranking</p>
                  <p className="text-3xl font-black text-white">#8 in State</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm text-white/60">200m</span>
                    <TierBadge tier="ELITE" size="sm" />
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-6">
                <div className="text-center">
                  <p className="text-2xl font-black text-green-500">↑ 3</p>
                  <p className="text-xs text-white/40">This Week</p>
                </div>
                <div className="text-center border-l border-white/10 pl-6">
                  <p className="text-2xl font-black text-white">4</p>
                  <p className="text-xs text-white/40">Events Ranked</p>
                </div>
                <div className="text-center border-l border-white/10 pl-6">
                  <p className="text-2xl font-black text-orange-400">847</p>
                  <p className="text-xs text-white/40">Total Points</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Rankings */}
          <div className="lg:col-span-3">
            {/* Scope Tabs */}
            <Tabs defaultValue="state" className="w-full">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <TabsList>
                  <TabsTrigger value="school">School</TabsTrigger>
                  <TabsTrigger value="state">State</TabsTrigger>
                  <TabsTrigger value="national">National</TabsTrigger>
                  <TabsTrigger value="class">Class of 2025</TabsTrigger>
                </TabsList>
                
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="gap-1">
                    100m <ChevronDown className="h-3 w-3" />
                  </Button>
                  <Button variant="outline" size="sm" className="gap-1">
                    Male <ChevronDown className="h-3 w-3" />
                  </Button>
                  <Button variant="outline" size="sm" className="gap-1">
                    2024 Season <ChevronDown className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              <TabsContent value="state">
                <Card className="bg-white/5 border-orange-500/20">
                  <CardHeader className="bg-gradient-to-r from-orange-500/10 to-yellow-500/10 border-b border-orange-500/20">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2 text-white">
                        <Medal className="h-5 w-5 text-orange-500" />
                        State Rankings - {selectedEvent}
                      </CardTitle>
                      <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">Updated 2h ago</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="divide-y divide-white/5">
                      {leaderboard.map((entry) => (
                        <LeaderboardRow 
                          key={entry.athleteId} 
                          entry={entry}
                          isCurrentUser={entry.athleteId === "8"}
                        />
                      ))}
                    </div>
                    
                    <div className="p-4 border-t border-white/10">
                      <Button variant="outline" className="w-full bg-white/5 border-white/10 text-white hover:bg-white/10">
                        Load More Rankings
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="school">
                <Card className="p-12 text-center">
                  <Trophy className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">School Rankings</h3>
                  <p className="text-muted-foreground mb-4">
                    See how you rank against your teammates
                  </p>
                  <Button>View School Rankings</Button>
                </Card>
              </TabsContent>

              <TabsContent value="national">
                <Card className="p-12 text-center">
                  <Trophy className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">National Rankings</h3>
                  <p className="text-muted-foreground mb-4">
                    Compare yourself to the best in the country
                  </p>
                  <Button>View National Rankings</Button>
                </Card>
              </TabsContent>

              <TabsContent value="class">
                <Card className="p-12 text-center">
                  <Trophy className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Class Rankings</h3>
                  <p className="text-muted-foreground mb-4">
                    See where you rank in your graduating class
                  </p>
                  <Button>View Class Rankings</Button>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Events */}
            <Card className="bg-white/5 border-orange-500/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-white">Events</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                {events.map((event) => (
                  <Button
                    key={event.id}
                    onClick={() => setSelectedEvent(event.shortName)}
                    variant="ghost"
                    className={`w-full justify-start ${
                      selectedEvent === event.shortName 
                        ? "bg-orange-500/20 text-orange-400 border border-orange-500/30" 
                        : "text-white/60 hover:text-white hover:bg-white/5"
                    }`}
                    size="sm"
                  >
                    {event.name}
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Tier Distribution */}
            <Card className="bg-white/5 border-orange-500/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-white flex items-center gap-2">
                  <Zap className="h-4 w-4 text-yellow-400" />
                  Tier System
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {tierDistribution.map((item, i) => {
                  const tierInfo = TIERS[item.tier];
                  return (
                    <div 
                      key={i} 
                      className={`flex items-center gap-3 p-2 rounded-lg ${tierInfo.bgColor} ${tierInfo.borderColor} border`}
                    >
                      <span className="text-lg">{tierInfo.emoji}</span>
                      <div className="flex-1">
                        <p className={`text-sm font-bold ${tierInfo.color}`}>{tierInfo.displayName}</p>
                        <p className="text-xs text-white/40">{item.threshold}</p>
                      </div>
                      <span className="text-xs text-white/50">
                        {item.count.toLocaleString()}
                      </span>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Most Improved */}
            <Card className="bg-white/5 border-orange-500/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-white flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  Most Improved
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { name: "Brandon Lee", improvement: "+5 ranks", event: "100m" },
                  { name: "Sarah Chen", improvement: "+4 ranks", event: "200m" },
                  { name: "Mike Torres", improvement: "+3 ranks", event: "400m" },
                ].map((athlete, i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-green-500/10 border border-green-500/20">
                    <div>
                      <p className="font-medium text-sm text-white">{athlete.name}</p>
                      <p className="text-xs text-white/40">{athlete.event}</p>
                    </div>
                    <span className="text-xs font-bold text-green-400">
                      {athlete.improvement}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
