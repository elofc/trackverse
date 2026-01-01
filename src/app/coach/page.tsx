"use client";

import { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/trackverse/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TierBadge } from "@/components/trackverse/tier-badge";
import { Tier } from "@/lib/rankings";
import {
  Users,
  Plus,
  Calendar,
  TrendingUp,
  Flame,
  Target,
  Activity,
  CheckCircle2,
  Clock,
  Zap,
  ClipboardList,
  MessageSquare,
  BarChart3,
  Settings,
  Bell,
  Search,
  ChevronRight,
  Award,
  AlertTriangle,
  FileText,
  Send,
  MoreHorizontal,
  UserPlus,
  Dumbbell,
  Trophy,
  GraduationCap,
} from "lucide-react";

// Mock team data
const teamData = {
  name: "Lincoln HS Track & Field",
  code: "LHS-TF-2025",
  athleteCount: 42,
  coachCount: 3,
  activeWorkouts: 6,
  upcomingMeets: 3,
};

const recentActivity = [
  { id: "a1", type: "pr", athlete: "Jaylen Thompson", event: "100m", value: "10.15", time: "2h ago" },
  { id: "a2", type: "workout", athlete: "Maya Rodriguez", workout: "Sprint Intervals", time: "3h ago" },
  { id: "a3", type: "submission", athlete: "Marcus Johnson", assignment: "Tempo Run", time: "4h ago" },
  { id: "a4", type: "pr", athlete: "Sarah Chen", event: "Long Jump", value: "18' 6\"", time: "5h ago" },
  { id: "a5", type: "join", athlete: "Tyler Smith", time: "1d ago" },
];

const topAthletes = [
  { id: "u1", name: "Jaylen Thompson", events: ["100m", "200m"], tier: "GODSPEED" as Tier, prs: 3, streak: 14 },
  { id: "u2", name: "Marcus Johnson", events: ["200m", "400m"], tier: "WORLD_CLASS" as Tier, prs: 2, streak: 12 },
  { id: "u3", name: "Maya Rodriguez", events: ["100m", "200m"], tier: "ELITE" as Tier, prs: 1, streak: 10 },
  { id: "u4", name: "Sarah Chen", events: ["Long Jump", "Triple Jump"], tier: "ALL_STATE" as Tier, prs: 2, streak: 8 },
];

const pendingSubmissions = [
  { id: "s1", athlete: "Tyler Smith", assignment: "6x200m Intervals", dueDate: "Today", status: "late" },
  { id: "s2", athlete: "Emma Wilson", assignment: "Tempo Run", dueDate: "Today", status: "pending" },
  { id: "s3", athlete: "Derek Thompson", assignment: "Plyometrics", dueDate: "Tomorrow", status: "pending" },
];

const upcomingMeets = [
  { id: "m1", name: "Regional Championships", date: "Jan 15", athletes: 24 },
  { id: "m2", name: "Winter Invitational", date: "Jan 22", athletes: 18 },
  { id: "m3", name: "State Qualifiers", date: "Feb 5", athletes: 12 },
];

const announcements = [
  { id: "an1", title: "Practice Schedule Change", content: "Practice moved to 4pm this week due to facility maintenance.", time: "2h ago", pinned: true },
  { id: "an2", title: "Regional Championships Roster", content: "Final roster posted. Check your events!", time: "1d ago", pinned: false },
];

export default function CoachDashboardPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-black text-white">{teamData.name}</h1>
                <p className="text-white/50 text-sm">Class Code: <span className="font-mono text-orange-400">{teamData.code}</span></p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="bg-white/5 border-white/10 text-white hover:bg-white/10">
              <Bell className="h-4 w-4 mr-2" />
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
              </span>
            </Button>
            <Button variant="outline" className="bg-white/5 border-white/10 text-white hover:bg-white/10">
              <Settings className="h-4 w-4" />
            </Button>
            <Link href="/coach/assignments/create">
              <Button className="btn-track text-white font-bold">
                <Plus className="h-4 w-4 mr-2" />
                Create Assignment
              </Button>
            </Link>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-orange-500/20 to-red-500/20 border-orange-500/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-black text-white">{teamData.athleteCount}</p>
                  <p className="text-sm text-white/60">Athletes</p>
                </div>
                <Users className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border-blue-500/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-black text-white">{teamData.activeWorkouts}</p>
                  <p className="text-sm text-white/60">Active Assignments</p>
                </div>
                <ClipboardList className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-500/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-black text-white">{teamData.upcomingMeets}</p>
                  <p className="text-sm text-white/60">Upcoming Meets</p>
                </div>
                <Trophy className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-500/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-black text-white">87%</p>
                  <p className="text-sm text-white/60">Completion Rate</p>
                </div>
                <Target className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Stream */}
          <div className="lg:col-span-2 space-y-6">
            {/* Announcements */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg text-white flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-orange-500" />
                  Stream
                </CardTitle>
                <Link href="/coach/announcements">
                  <Button variant="ghost" size="sm" className="text-orange-400 hover:text-orange-300">
                    View All
                  </Button>
                </Link>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Post Announcement */}
                <div className="flex gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-sm font-black flex-shrink-0">
                    CD
                  </div>
                  <div className="flex-1">
                    <Input
                      placeholder="Announce something to your team..."
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/30 mb-2"
                    />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="ghost" className="text-white/50 hover:text-white">
                          <FileText className="h-4 w-4 mr-1" />
                          Attach
                        </Button>
                      </div>
                      <Button size="sm" className="btn-track text-white font-bold">
                        <Send className="h-4 w-4 mr-1" />
                        Post
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Announcements List */}
                {announcements.map((announcement) => (
                  <div key={announcement.id} className={`p-4 rounded-xl border ${announcement.pinned ? 'bg-orange-500/10 border-orange-500/30' : 'bg-white/5 border-white/10'}`}>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-sm font-black">
                          CD
                        </div>
                        <div>
                          <p className="font-bold text-white">Coach Davis</p>
                          <p className="text-xs text-white/50">{announcement.time}</p>
                        </div>
                      </div>
                      {announcement.pinned && (
                        <span className="px-2 py-1 rounded-full bg-orange-500/20 text-orange-400 text-xs font-bold">
                          📌 Pinned
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-white mb-1">{announcement.title}</h3>
                    <p className="text-white/70 text-sm">{announcement.content}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-white flex items-center gap-2">
                  <Activity className="h-5 w-5 text-orange-500" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center gap-4 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      activity.type === 'pr' ? 'bg-orange-500/20' :
                      activity.type === 'workout' ? 'bg-blue-500/20' :
                      activity.type === 'submission' ? 'bg-green-500/20' :
                      'bg-purple-500/20'
                    }`}>
                      {activity.type === 'pr' && <Flame className="h-5 w-5 text-orange-500" />}
                      {activity.type === 'workout' && <Dumbbell className="h-5 w-5 text-blue-500" />}
                      {activity.type === 'submission' && <CheckCircle2 className="h-5 w-5 text-green-500" />}
                      {activity.type === 'join' && <UserPlus className="h-5 w-5 text-purple-500" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-white">
                        <span className="font-bold">{activity.athlete}</span>
                        {activity.type === 'pr' && <> set a new PR in <span className="text-orange-400">{activity.event}</span> - <span className="font-mono text-yellow-400">{activity.value}</span></>}
                        {activity.type === 'workout' && <> completed <span className="text-blue-400">{activity.workout}</span></>}
                        {activity.type === 'submission' && <> submitted <span className="text-green-400">{activity.assignment}</span></>}
                        {activity.type === 'join' && <> joined the team</>}
                      </p>
                      <p className="text-xs text-white/50">{activity.time}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-white/30" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Pending Submissions */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-white flex items-center gap-2">
                  <Clock className="h-5 w-5 text-yellow-500" />
                  Needs Review
                  <span className="ml-auto px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 text-xs font-bold">
                    {pendingSubmissions.length}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {pendingSubmissions.map((submission) => (
                  <div key={submission.id} className={`p-3 rounded-lg border ${
                    submission.status === 'late' ? 'bg-red-500/10 border-red-500/30' : 'bg-white/5 border-white/10'
                  }`}>
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-bold text-white text-sm">{submission.athlete}</p>
                      {submission.status === 'late' && (
                        <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 text-xs font-bold flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          Late
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-white/50">{submission.assignment}</p>
                    <p className="text-xs text-white/40">Due: {submission.dueDate}</p>
                  </div>
                ))}
                <Link href="/coach/submissions">
                  <Button variant="outline" className="w-full bg-white/5 border-white/10 text-white hover:bg-white/10 mt-2">
                    View All Submissions
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Top Athletes */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-white flex items-center gap-2">
                  <Award className="h-5 w-5 text-orange-500" />
                  Top Athletes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {topAthletes.map((athlete, i) => (
                  <div key={athlete.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-xs font-black">
                      {athlete.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-white text-sm truncate">{athlete.name}</p>
                        <TierBadge tier={athlete.tier} size="sm" showEmoji={false} />
                      </div>
                      <p className="text-xs text-white/50">{athlete.events.join(", ")}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-orange-400 font-bold">{athlete.prs} PRs</p>
                      <p className="text-xs text-white/40">{athlete.streak}d streak</p>
                    </div>
                  </div>
                ))}
                <Link href="/coach/roster">
                  <Button variant="outline" className="w-full bg-white/5 border-white/10 text-white hover:bg-white/10 mt-2">
                    View Full Roster
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Upcoming Meets */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-white flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-green-500" />
                  Upcoming Meets
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {upcomingMeets.map((meet) => (
                  <div key={meet.id} className="p-3 rounded-lg bg-white/5 border border-white/10 hover:border-green-500/30 transition-colors cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold text-white text-sm">{meet.name}</p>
                        <p className="text-xs text-white/50">{meet.date}</p>
                      </div>
                      <span className="px-2 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-bold">
                        {meet.athletes} athletes
                      </span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-white">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href="/coach/roster/invite">
                  <Button variant="outline" className="w-full justify-start gap-2 bg-white/5 border-white/10 text-white hover:bg-white/10">
                    <UserPlus className="h-4 w-4" />
                    Invite Athletes
                  </Button>
                </Link>
                <Link href="/coach/assignments/create">
                  <Button variant="outline" className="w-full justify-start gap-2 bg-white/5 border-white/10 text-white hover:bg-white/10">
                    <ClipboardList className="h-4 w-4" />
                    Create Assignment
                  </Button>
                </Link>
                <Link href="/coach/analytics">
                  <Button variant="outline" className="w-full justify-start gap-2 bg-white/5 border-white/10 text-white hover:bg-white/10">
                    <BarChart3 className="h-4 w-4" />
                    View Analytics
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
