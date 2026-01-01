"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { 
  ArrowLeft,
  Star, 
  MessageSquare, 
  Eye, 
  TrendingUp,
  MapPin,
  GraduationCap,
  Trophy,
  Calendar,
  Share2,
  Download,
  Play,
  CheckCircle,
  Clock,
  Target,
  Award,
  BarChart3,
  Users,
  Mail,
  Phone,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TierBadge, Navbar } from "@/components/trackverse";

// Mock athlete data
const mockAthleteData = {
  id: "1",
  name: "Elias Bolt",
  school: "Lincoln High School",
  location: "Springfield, OR",
  gradYear: 2025,
  height: "5'11\"",
  weight: "165 lbs",
  gpa: "3.8",
  satScore: "1320",
  bio: "Passionate sprinter with dreams of competing at the D1 level. Team captain and 2x state champion. Looking for a program where I can develop as both an athlete and student.",
  coachName: "Coach Mike Williams",
  coachEmail: "mwilliams@lincolnhs.edu",
  profileViews: 1234,
  profileViewsThisMonth: 342,
  savedBy: 45,
  messagesReceived: 12,
  recruitingStatus: "open",
  verified: true,
  avatar: null,
  events: [
    { 
      name: "100m", 
      pr: "10.15", 
      tier: "GODSPEED" as const, 
      stateRank: 1, 
      nationalRank: 12,
      seasonBest: "10.15",
      progression: [
        { date: "Mar 2024", time: "10.85" },
        { date: "Apr 2024", time: "10.52" },
        { date: "May 2024", time: "10.32" },
        { date: "Jun 2024", time: "10.15" },
      ],
      improvement: "-0.70s"
    },
    { 
      name: "200m", 
      pr: "20.45", 
      tier: "WORLD_CLASS" as const, 
      stateRank: 2, 
      nationalRank: 28,
      seasonBest: "20.45",
      progression: [
        { date: "Mar 2024", time: "21.45" },
        { date: "Apr 2024", time: "21.02" },
        { date: "May 2024", time: "20.78" },
        { date: "Jun 2024", time: "20.45" },
      ],
      improvement: "-1.00s"
    },
  ],
  meetResults: [
    { meet: "State Championships", date: "Jun 2024", event: "100m", place: 1, time: "10.15", isPR: true },
    { meet: "State Championships", date: "Jun 2024", event: "200m", place: 2, time: "20.45", isPR: true },
    { meet: "Regional Championships", date: "May 2024", event: "100m", place: 1, time: "10.28", isPR: false },
    { meet: "Conference Finals", date: "May 2024", event: "100m", place: 1, time: "10.32", isPR: false },
    { meet: "Winter Invitational", date: "Mar 2024", event: "100m", place: 1, time: "10.52", isPR: false },
  ],
  highlights: [
    { title: "State Championship 100m Final", thumbnail: null, duration: "0:42" },
    { title: "Training Montage - Speed Work", thumbnail: null, duration: "1:23" },
    { title: "200m PR Race", thumbnail: null, duration: "0:38" },
  ],
  achievements: [
    { icon: "🏆", title: "2x State Champion", description: "100m (2023, 2024)" },
    { icon: "⚡", title: "School Record Holder", description: "100m, 200m" },
    { icon: "👑", title: "Team Captain", description: "2024 Season" },
    { icon: "📚", title: "Academic All-State", description: "3.8 GPA" },
  ],
  interests: ["University of Oregon", "Stanford", "USC", "UCLA", "Texas"],
};

export default function AthleteProfilePage() {
  const params = useParams();
  const [isSaved, setIsSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "results" | "videos">("overview");
  
  const athlete = mockAthleteData;

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navbar />
      
      {/* Header with Cover */}
      <div className="relative">
        <div className="h-32 bg-gradient-to-b from-orange-600/30 to-transparent" />
        
        {/* Back Button */}
        <Link 
          href="/recruiting" 
          className="absolute top-4 left-4 flex items-center gap-2 text-white/80 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Search
        </Link>

        {/* Profile Header */}
        <div className="max-w-6xl mx-auto px-4 -mt-20 relative z-10">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Avatar */}
            <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-4xl font-bold border-4 border-zinc-950 shadow-xl">
              {athlete.name.split(' ').map(n => n[0]).join('')}
            </div>

            {/* Info */}
            <div className="flex-1 pt-4">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-3xl font-bold">{athlete.name}</h1>
                {athlete.verified && (
                  <Badge className="bg-blue-500/20 text-blue-400">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                )}
                {athlete.recruitingStatus === "open" ? (
                  <Badge className="bg-green-500/20 text-green-400">Open to Recruiting</Badge>
                ) : (
                  <Badge className="bg-orange-500/20 text-orange-400">Committed</Badge>
                )}
              </div>
              
              <div className="flex items-center gap-4 mt-2 text-zinc-400 flex-wrap">
                <span className="flex items-center gap-1">
                  <GraduationCap className="w-4 h-4" />
                  {athlete.school} • Class of {athlete.gradYear}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {athlete.location}
                </span>
              </div>

              {/* Quick Stats */}
              <div className="flex gap-6 mt-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-400">{athlete.profileViews}</p>
                  <p className="text-xs text-zinc-500">Profile Views</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-400">{athlete.savedBy}</p>
                  <p className="text-xs text-zinc-500">Saved By Scouts</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-400">#{athlete.events[0].nationalRank}</p>
                  <p className="text-xs text-zinc-500">National Rank</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-4">
              <Button
                onClick={() => setIsSaved(!isSaved)}
                className={isSaved ? "bg-orange-500 hover:bg-orange-600" : "bg-zinc-800 hover:bg-zinc-700"}
              >
                <Star className={`w-4 h-4 mr-2 ${isSaved ? "fill-current" : ""}`} />
                {isSaved ? "Saved" : "Save"}
              </Button>
              <Button className="bg-orange-500 hover:bg-orange-600">
                <MessageSquare className="w-4 h-4 mr-2" />
                Message
              </Button>
              <Button variant="outline" className="border-zinc-700 hover:bg-zinc-800">
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tabs */}
            <div className="flex gap-2 border-b border-zinc-800 pb-2">
              {(["overview", "results", "videos"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === tab 
                      ? "bg-orange-500 text-white" 
                      : "text-zinc-400 hover:text-white hover:bg-zinc-800"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {activeTab === "overview" && (
              <>
                {/* Bio */}
                <Card className="bg-zinc-900 border-zinc-800 p-6">
                  <h2 className="text-lg font-semibold mb-3">About</h2>
                  <p className="text-zinc-300 leading-relaxed">{athlete.bio}</p>
                </Card>

                {/* Personal Records */}
                <Card className="bg-zinc-900 border-zinc-800 p-6">
                  <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-orange-400" />
                    Personal Records
                  </h2>
                  <div className="space-y-4">
                    {athlete.events.map((event, idx) => (
                      <div key={idx} className="bg-zinc-800/50 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <span className="text-lg font-medium">{event.name}</span>
                            <TierBadge tier={event.tier} />
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-mono font-bold text-orange-400">{event.pr}</p>
                            <p className="text-xs text-green-400">{event.improvement} improvement</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-zinc-400">
                          <span>#{event.stateRank} State</span>
                          <span>#{event.nationalRank} National</span>
                          <span>Season Best: {event.seasonBest}</span>
                        </div>

                        {/* Progression Chart */}
                        <div className="mt-4">
                          <p className="text-xs text-zinc-500 mb-2">Season Progression</p>
                          <div className="flex items-end gap-2 h-16">
                            {event.progression.map((p, i) => {
                              const maxTime = parseFloat(event.progression[0].time);
                              const minTime = parseFloat(event.progression[event.progression.length - 1].time);
                              const currentTime = parseFloat(p.time);
                              const height = ((maxTime - currentTime) / (maxTime - minTime)) * 100;
                              
                              return (
                                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                                  <div 
                                    className="w-full bg-gradient-to-t from-orange-600 to-orange-400 rounded-t"
                                    style={{ height: `${Math.max(20, height)}%` }}
                                  />
                                  <span className="text-xs text-zinc-500">{p.date.split(' ')[0]}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Achievements */}
                <Card className="bg-zinc-900 border-zinc-800 p-6">
                  <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Award className="w-5 h-5 text-orange-400" />
                    Achievements
                  </h2>
                  <div className="grid grid-cols-2 gap-3">
                    {athlete.achievements.map((achievement, idx) => (
                      <div key={idx} className="bg-zinc-800/50 rounded-lg p-3 flex items-center gap-3">
                        <span className="text-2xl">{achievement.icon}</span>
                        <div>
                          <p className="font-medium text-sm">{achievement.title}</p>
                          <p className="text-xs text-zinc-500">{achievement.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </>
            )}

            {activeTab === "results" && (
              <Card className="bg-zinc-900 border-zinc-800 p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-orange-400" />
                  Competition Results
                </h2>
                <div className="space-y-3">
                  {athlete.meetResults.map((result, idx) => (
                    <div 
                      key={idx} 
                      className="flex items-center justify-between bg-zinc-800/50 rounded-lg p-4"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                          result.place === 1 ? "bg-yellow-500/20 text-yellow-400" :
                          result.place === 2 ? "bg-zinc-400/20 text-zinc-300" :
                          result.place === 3 ? "bg-orange-700/20 text-orange-600" :
                          "bg-zinc-700/50 text-zinc-400"
                        }`}>
                          {result.place}
                        </div>
                        <div>
                          <p className="font-medium">{result.meet}</p>
                          <p className="text-sm text-zinc-500">{result.event} • {result.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-mono font-bold text-orange-400">{result.time}</p>
                        {result.isPR && (
                          <Badge className="bg-green-500/20 text-green-400 text-xs">PR</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {activeTab === "videos" && (
              <Card className="bg-zinc-900 border-zinc-800 p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Play className="w-5 h-5 text-orange-400" />
                  Highlight Videos
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {athlete.highlights.map((video, idx) => (
                    <div 
                      key={idx} 
                      className="bg-zinc-800 rounded-lg overflow-hidden group cursor-pointer"
                    >
                      <div className="aspect-video bg-zinc-700 flex items-center justify-center relative">
                        <Play className="w-12 h-12 text-white/50 group-hover:text-orange-400 transition-colors" />
                        <span className="absolute bottom-2 right-2 bg-black/70 px-2 py-1 rounded text-xs">
                          {video.duration}
                        </span>
                      </div>
                      <div className="p-3">
                        <p className="font-medium text-sm">{video.title}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Recruiting Profile Card */}
            <Card className="bg-zinc-900 border-zinc-800 p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-orange-400" />
                Recruiting Profile
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Height</span>
                  <span className="font-medium">{athlete.height}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Weight</span>
                  <span className="font-medium">{athlete.weight}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">GPA</span>
                  <span className="font-medium">{athlete.gpa}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">SAT Score</span>
                  <span className="font-medium">{athlete.satScore}</span>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-zinc-800">
                <p className="text-xs text-zinc-500 mb-2">Interested Schools</p>
                <div className="flex flex-wrap gap-2">
                  {athlete.interests.map((school, idx) => (
                    <Badge key={idx} variant="outline" className="border-zinc-700 text-zinc-300">
                      {school}
                    </Badge>
                  ))}
                </div>
              </div>
            </Card>

            {/* Contact Card */}
            <Card className="bg-zinc-900 border-zinc-800 p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-orange-400" />
                Contact
              </h3>
              <div className="space-y-3">
                <div className="bg-zinc-800/50 rounded-lg p-3">
                  <p className="text-xs text-zinc-500 mb-1">Head Coach</p>
                  <p className="font-medium">{athlete.coachName}</p>
                  <p className="text-sm text-zinc-400">{athlete.coachEmail}</p>
                </div>
                <Button className="w-full bg-orange-500 hover:bg-orange-600">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Contact Athlete
                </Button>
                <Button variant="outline" className="w-full border-zinc-700 hover:bg-zinc-800">
                  <Download className="w-4 h-4 mr-2" />
                  Download Profile PDF
                </Button>
              </div>
            </Card>

            {/* Activity Card */}
            <Card className="bg-zinc-900 border-zinc-800 p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Eye className="w-5 h-5 text-orange-400" />
                Profile Activity
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Views This Month</span>
                  <span className="font-medium text-green-400">+{athlete.profileViewsThisMonth}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Total Views</span>
                  <span className="font-medium">{athlete.profileViews}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Saved by Scouts</span>
                  <span className="font-medium">{athlete.savedBy}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Messages Received</span>
                  <span className="font-medium">{athlete.messagesReceived}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
