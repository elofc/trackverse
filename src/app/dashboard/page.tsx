"use client";

import { Navbar } from "@/components/trackverse/navbar";
import { WorkoutCard } from "@/components/trackverse/workout-card";
import { PostCard } from "@/components/trackverse/post-card";
import { StatsCard } from "@/components/trackverse/stats-card";
import { Leaderboard } from "@/components/trackverse/leaderboard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Trophy,
  Flame,
  Target,
  TrendingUp,
  Plus,
  Calendar,
  ChevronRight,
  Zap,
  Timer,
} from "lucide-react";

const mockPosts = [
  {
    author: { name: "Marcus Johnson", school: "Lincoln HS" },
    content: "Just dropped a new PR in the 100m! All that hard work is paying off. Next stop: State Championships! 🏃‍♂️💨",
    prData: { event: "100m", time: 10850, improvement: 150 },
    likes: 234,
    comments: 45,
    shares: 12,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    author: { name: "Sarah Williams", school: "Roosevelt HS" },
    content: "Great practice today with the team! 6x200m at race pace. Feeling strong heading into the weekend meet.",
    likes: 89,
    comments: 12,
    shares: 3,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
  },
  {
    author: { name: "Tyler Smith", school: "Jefferson HS" },
    content: "Shoutout to my coach for pushing me through that tough workout. The grind never stops! 💪",
    mediaUrl: "https://images.unsplash.com/photo-1461896836934- voices-of-the-track?w=800",
    likes: 156,
    comments: 23,
    shares: 8,
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
  },
];

const mockLeaderboard = [
  { rank: 1, name: "Marcus Johnson", school: "Lincoln HS", time: 10450, tier: "world-class" as const, rankChange: 0 },
  { rank: 2, name: "Tyler Smith", school: "Roosevelt HS", time: 10620, tier: "national" as const, rankChange: 1 },
  { rank: 3, name: "James Williams", school: "Jefferson HS", time: 10780, tier: "national" as const, rankChange: -1 },
  { rank: 4, name: "Chris Davis", school: "Washington HS", time: 10950, tier: "all-state" as const, rankChange: 2 },
  { rank: 5, name: "Michael Brown", school: "Adams HS", time: 11120, tier: "all-state" as const, rankChange: 0 },
];

const upcomingMeets = [
  { name: "Regional Championships", date: "Jan 15", location: "Lincoln Stadium" },
  { name: "Invitational Meet", date: "Jan 22", location: "Roosevelt Track" },
  { name: "State Qualifiers", date: "Feb 5", location: "State Complex" },
];

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, Jordan! 👋</h1>
          <p className="text-muted-foreground">
            You&apos;re on a 12-day training streak. Keep it up!
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard
            title="Current Rank"
            value="#12"
            subtitle="State • 100m"
            icon={<Trophy className="h-5 w-5" />}
            trend={{ value: 3, label: "from last week" }}
          />
          <StatsCard
            title="Training Streak"
            value="12 days"
            subtitle="Personal best!"
            icon={<Flame className="h-5 w-5" />}
          />
          <StatsCard
            title="Season PRs"
            value="4"
            subtitle="This season"
            icon={<Target className="h-5 w-5" />}
            trend={{ value: 100, label: "vs last season" }}
          />
          <StatsCard
            title="Improvement"
            value="-0.15s"
            subtitle="100m this month"
            icon={<TrendingUp className="h-5 w-5" />}
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Feed */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-wrap gap-3">
                  <Button variant="gradient" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Log Workout
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <Target className="h-4 w-4" />
                    Add PR
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <Calendar className="h-4 w-4" />
                    Log Meet Result
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Feed Tabs */}
            <Tabs defaultValue="for-you" className="w-full">
              <TabsList className="w-full justify-start">
                <TabsTrigger value="for-you">For You</TabsTrigger>
                <TabsTrigger value="following">Following</TabsTrigger>
                <TabsTrigger value="school">School</TabsTrigger>
                <TabsTrigger value="trending">Trending</TabsTrigger>
              </TabsList>
              
              <TabsContent value="for-you" className="space-y-4 mt-4">
                {mockPosts.map((post, i) => (
                  <PostCard key={i} {...post} />
                ))}
              </TabsContent>
              
              <TabsContent value="following" className="space-y-4 mt-4">
                <div className="text-center py-12 text-muted-foreground">
                  <p>Posts from people you follow will appear here.</p>
                  <Button variant="link" className="mt-2">Find athletes to follow</Button>
                </div>
              </TabsContent>
              
              <TabsContent value="school" className="space-y-4 mt-4">
                {mockPosts.slice(0, 2).map((post, i) => (
                  <PostCard key={i} {...post} />
                ))}
              </TabsContent>
              
              <TabsContent value="trending" className="space-y-4 mt-4">
                {mockPosts.map((post, i) => (
                  <PostCard key={i} {...post} isLiked={i === 0} />
                ))}
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Your Rankings */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Your Rankings</CardTitle>
                  <Button variant="ghost" size="sm" className="gap-1">
                    View All <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { event: "100m", rank: 12, scope: "State", tier: "elite" },
                  { event: "200m", rank: 8, scope: "State", tier: "all-state" },
                  { event: "4x100m", rank: 3, scope: "State", tier: "all-state" },
                ].map((ranking, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div>
                      <p className="font-medium">{ranking.event}</p>
                      <p className="text-xs text-muted-foreground">{ranking.scope}</p>
                    </div>
                    <div className="text-right">
                      <p className="rank-display text-xl font-bold">#{ranking.rank}</p>
                      <Badge variant={ranking.tier as "elite" | "all-state"} className="text-xs capitalize">
                        {ranking.tier.replace("-", " ")}
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Upcoming Meets */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Upcoming Meets</CardTitle>
                  <Button variant="ghost" size="sm" className="gap-1">
                    Calendar <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {upcomingMeets.map((meet, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{meet.name}</p>
                      <p className="text-xs text-muted-foreground">{meet.location}</p>
                    </div>
                    <Badge variant="outline">{meet.date}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recent Workouts */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Recent Workouts</CardTitle>
                  <Button variant="ghost" size="sm" className="gap-1">
                    View All <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <WorkoutCard
                  title="Sprint Intervals"
                  type="sprint"
                  date={new Date(Date.now() - 24 * 60 * 60 * 1000)}
                  totalDistance={1200}
                  effort={8}
                  description="6x200m at 90%"
                />
                <WorkoutCard
                  title="Tempo Run"
                  type="tempo"
                  date={new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)}
                  totalDistance={3000}
                  duration={15}
                  effort={6}
                />
              </CardContent>
            </Card>

            {/* Mini Leaderboard */}
            <Leaderboard
              title="State Rankings"
              event="100m"
              entries={mockLeaderboard.slice(0, 5)}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
