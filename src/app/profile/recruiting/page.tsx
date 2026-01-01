"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  ArrowLeft,
  Eye,
  Star,
  MessageSquare,
  TrendingUp,
  TrendingDown,
  Calendar,
  MapPin,
  GraduationCap,
  Trophy,
  Edit2,
  Share2,
  Download,
  Settings,
  Bell,
  CheckCircle,
  Clock,
  Users,
  BarChart3,
  Target,
  Zap,
  ExternalLink,
  Lock,
  Globe
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TierBadge } from "@/components/trackverse";

// Mock athlete's own recruiting data
const myRecruitingData = {
  profileViews: {
    total: 1234,
    thisMonth: 342,
    lastMonth: 289,
    trend: "+18%",
  },
  savedBy: {
    total: 45,
    thisMonth: 12,
    lastMonth: 8,
    trend: "+50%",
  },
  messagesReceived: {
    total: 28,
    thisMonth: 8,
    lastMonth: 5,
    trend: "+60%",
  },
  profileCompleteness: 85,
  recruitingStatus: "open",
  visibility: "public",
  recentViewers: [
    { name: "Coach Smith", school: "State University", date: "2 hours ago" },
    { name: "Coach Johnson", school: "Tech University", date: "5 hours ago" },
    { name: "Coach Williams", school: "Pacific University", date: "1 day ago" },
    { name: "Coach Brown", school: "Mountain College", date: "2 days ago" },
    { name: "Coach Davis", school: "Valley State", date: "3 days ago" },
  ],
  interestedSchools: [
    { name: "State University", division: "D1", interest: "high", lastContact: "Dec 28" },
    { name: "Tech University", division: "D1", interest: "medium", lastContact: "Dec 25" },
    { name: "Pacific University", division: "D2", interest: "high", lastContact: "Dec 30" },
  ],
  weeklyViews: [
    { day: "Mon", views: 45 },
    { day: "Tue", views: 52 },
    { day: "Wed", views: 38 },
    { day: "Thu", views: 67 },
    { day: "Fri", views: 89 },
    { day: "Sat", views: 34 },
    { day: "Sun", views: 17 },
  ],
  topSearchTerms: [
    { term: "100m sprinter Oregon", count: 23 },
    { term: "Class of 2025 sprinter", count: 18 },
    { term: "GODSPEED tier athletes", count: 15 },
    { term: "Lincoln High School track", count: 12 },
  ],
  missingProfileItems: [
    "SAT/ACT Score",
    "Highlight Video",
    "Coach Contact Info",
  ],
};

export default function MyRecruitingPage() {
  const [recruitingStatus, setRecruitingStatus] = useState(myRecruitingData.recruitingStatus);
  const [visibility, setVisibility] = useState(myRecruitingData.visibility);

  const maxViews = Math.max(...myRecruitingData.weeklyViews.map(d => d.views));

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-orange-500 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <Link 
            href="/profile" 
            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Profile
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <Target className="w-8 h-8" />
                My Recruiting Dashboard
              </h1>
              <p className="text-orange-100 mt-1">
                Track your recruiting activity and manage your visibility
              </p>
            </div>
            <div className="flex gap-3">
              <Link href="/recruiting/athlete/1">
                <Button variant="outline" className="bg-white/10 border-white/20 hover:bg-white/20">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Public Profile
                </Button>
              </Link>
              <Button variant="outline" className="bg-white/10 border-white/20 hover:bg-white/20">
                <Share2 className="w-4 h-4 mr-2" />
                Share Profile
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="bg-zinc-900 border-zinc-800 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-zinc-400 text-sm">Profile Views</span>
              <Eye className="w-5 h-5 text-orange-400" />
            </div>
            <p className="text-3xl font-bold">{myRecruitingData.profileViews.total}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-green-400 text-sm flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                {myRecruitingData.profileViews.trend}
              </span>
              <span className="text-zinc-500 text-sm">vs last month</span>
            </div>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-zinc-400 text-sm">Saved by Scouts</span>
              <Star className="w-5 h-5 text-orange-400" />
            </div>
            <p className="text-3xl font-bold">{myRecruitingData.savedBy.total}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-green-400 text-sm flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                {myRecruitingData.savedBy.trend}
              </span>
              <span className="text-zinc-500 text-sm">vs last month</span>
            </div>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-zinc-400 text-sm">Messages Received</span>
              <MessageSquare className="w-5 h-5 text-orange-400" />
            </div>
            <p className="text-3xl font-bold">{myRecruitingData.messagesReceived.total}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-green-400 text-sm flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                {myRecruitingData.messagesReceived.trend}
              </span>
              <span className="text-zinc-500 text-sm">vs last month</span>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Weekly Views Chart */}
            <Card className="bg-zinc-900 border-zinc-800 p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-orange-400" />
                Profile Views This Week
              </h2>
              <div className="flex items-end gap-2 h-40">
                {myRecruitingData.weeklyViews.map((day, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                    <span className="text-xs text-zinc-500">{day.views}</span>
                    <div 
                      className="w-full bg-gradient-to-t from-orange-600 to-orange-400 rounded-t transition-all"
                      style={{ height: `${(day.views / maxViews) * 100}%`, minHeight: '8px' }}
                    />
                    <span className="text-xs text-zinc-500">{day.day}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Recent Viewers */}
            <Card className="bg-zinc-900 border-zinc-800 p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-orange-400" />
                Recent Profile Viewers
              </h2>
              <div className="space-y-3">
                {myRecruitingData.recentViewers.map((viewer, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-center justify-between bg-zinc-800/50 rounded-lg p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-zinc-700 flex items-center justify-center">
                        <Users className="w-5 h-5 text-zinc-400" />
                      </div>
                      <div>
                        <p className="font-medium">{viewer.name}</p>
                        <p className="text-sm text-zinc-500">{viewer.school}</p>
                      </div>
                    </div>
                    <span className="text-sm text-zinc-500">{viewer.date}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-zinc-600 mt-4 text-center">
                Upgrade to Pro to see all viewers and their contact info
              </p>
            </Card>

            {/* Interested Schools */}
            <Card className="bg-zinc-900 border-zinc-800 p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-orange-400" />
                Schools Showing Interest
              </h2>
              <div className="space-y-3">
                {myRecruitingData.interestedSchools.map((school, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-center justify-between bg-zinc-800/50 rounded-lg p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-zinc-700 flex items-center justify-center">
                        <GraduationCap className="w-6 h-6 text-zinc-400" />
                      </div>
                      <div>
                        <p className="font-medium">{school.name}</p>
                        <p className="text-sm text-zinc-500">{school.division}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={
                        school.interest === "high" 
                          ? "bg-green-500/20 text-green-400" 
                          : "bg-yellow-500/20 text-yellow-400"
                      }>
                        {school.interest === "high" ? "High Interest" : "Medium Interest"}
                      </Badge>
                      <p className="text-xs text-zinc-500 mt-1">Last contact: {school.lastContact}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Search Terms */}
            <Card className="bg-zinc-900 border-zinc-800 p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-orange-400" />
                How Scouts Find You
              </h2>
              <div className="space-y-3">
                {myRecruitingData.topSearchTerms.map((term, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm">{term.term}</span>
                        <span className="text-sm text-zinc-500">{term.count} searches</span>
                      </div>
                      <Progress 
                        value={(term.count / myRecruitingData.topSearchTerms[0].count) * 100} 
                        className="h-2 bg-zinc-800"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Completeness */}
            <Card className="bg-zinc-900 border-zinc-800 p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-orange-400" />
                Profile Completeness
              </h3>
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-bold">{myRecruitingData.profileCompleteness}%</span>
                  <span className="text-sm text-zinc-500">Complete</span>
                </div>
                <Progress value={myRecruitingData.profileCompleteness} className="h-3 bg-zinc-800" />
              </div>
              
              {myRecruitingData.missingProfileItems.length > 0 && (
                <div>
                  <p className="text-sm text-zinc-400 mb-2">Missing items:</p>
                  <ul className="space-y-2">
                    {myRecruitingData.missingProfileItems.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 rounded-full bg-orange-500" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full mt-4 bg-orange-500 hover:bg-orange-600">
                    <Edit2 className="w-4 h-4 mr-2" />
                    Complete Profile
                  </Button>
                </div>
              )}
            </Card>

            {/* Recruiting Settings */}
            <Card className="bg-zinc-900 border-zinc-800 p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Settings className="w-5 h-5 text-orange-400" />
                Recruiting Settings
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-zinc-400 mb-2 block">Recruiting Status</label>
                  <select
                    value={recruitingStatus}
                    onChange={(e) => setRecruitingStatus(e.target.value)}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2"
                  >
                    <option value="open">Open to Recruiting</option>
                    <option value="committed">Committed</option>
                    <option value="closed">Not Recruiting</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm text-zinc-400 mb-2 block">Profile Visibility</label>
                  <select
                    value={visibility}
                    onChange={(e) => setVisibility(e.target.value)}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2"
                  >
                    <option value="public">Public - Anyone can view</option>
                    <option value="verified">Verified Scouts Only</option>
                    <option value="private">Private - Hidden from search</option>
                  </select>
                </div>

                <div className="pt-2 border-t border-zinc-800">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded bg-zinc-800 border-zinc-700" />
                    <span className="text-sm">Email me when scouts view my profile</span>
                  </label>
                </div>

                <div>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded bg-zinc-800 border-zinc-700" />
                    <span className="text-sm">Allow scouts to message me</span>
                  </label>
                </div>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-zinc-900 border-zinc-800 p-6">
              <h3 className="font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start border-zinc-700">
                  <Download className="w-4 h-4 mr-2" />
                  Download Profile PDF
                </Button>
                <Button variant="outline" className="w-full justify-start border-zinc-700">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Profile Link
                </Button>
                <Link href="/recruiting/messages" className="block">
                  <Button variant="outline" className="w-full justify-start border-zinc-700">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    View Messages
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Tips */}
            <Card className="bg-gradient-to-br from-orange-500/20 to-orange-600/10 border-orange-500/30 p-6">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Zap className="w-5 h-5 text-orange-400" />
                Pro Tips
              </h3>
              <ul className="space-y-2 text-sm text-zinc-300">
                <li>• Add a highlight video to increase views by 3x</li>
                <li>• Complete your academic info for D1 scouts</li>
                <li>• Update your profile after every PR</li>
                <li>• Respond to messages within 24 hours</li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
