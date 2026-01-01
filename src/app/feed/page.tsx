"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/trackverse/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TierBadge } from "@/components/trackverse/tier-badge";
import { Tier } from "@/lib/rankings";
import {
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
  Flame,
  Trophy,
  Dumbbell,
  Medal,
  TrendingUp,
  Users,
  Search,
  Bell,
  Plus,
  Zap,
  Timer,
  MapPin,
  Calendar,
  ChevronRight,
  Send,
  Bookmark,
  Play,
} from "lucide-react";

type PostType = "pr" | "workout" | "meet" | "milestone" | "general";

interface Post {
  id: string;
  author: {
    id: string;
    name: string;
    username: string;
    avatar: string;
    school: string;
    tier: Tier;
    verified: boolean;
  };
  type: PostType;
  content: string;
  media?: string;
  performance?: {
    event: string;
    time: string;
    improvement?: string;
    tier: Tier;
  };
  workout?: {
    title: string;
    type: string;
    duration: number;
    effort: number;
  };
  meet?: {
    name: string;
    place: number;
    event: string;
  };
  likes: number;
  comments: number;
  shares: number;
  liked: boolean;
  saved: boolean;
  createdAt: Date;
}

const mockPosts: Post[] = [
  {
    id: "p1",
    author: {
      id: "u1",
      name: "Jaylen Thompson",
      username: "flashjaylen",
      avatar: "/avatars/jaylen.jpg",
      school: "Lincoln HS",
      tier: "GODSPEED",
      verified: true,
    },
    type: "pr",
    content: "NEW PR ALERT! 🔥 Finally broke 10.2 in the 100m! All the hard work is paying off. Shoutout to Coach Davis for believing in me! #TrackLife #SpeedKills",
    performance: {
      event: "100m",
      time: "10.15",
      improvement: "-0.08",
      tier: "GODSPEED",
    },
    likes: 342,
    comments: 47,
    shares: 23,
    liked: true,
    saved: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: "p2",
    author: {
      id: "u2",
      name: "Maya Rodriguez",
      username: "mayasprints",
      avatar: "/avatars/maya.jpg",
      school: "Roosevelt HS",
      tier: "ELITE",
      verified: false,
    },
    type: "workout",
    content: "6x200m session complete! Legs are toast but feeling strong 💪 Two weeks until regionals!",
    workout: {
      title: "Sprint Intervals",
      type: "sprint",
      duration: 45,
      effort: 8,
    },
    likes: 89,
    comments: 12,
    shares: 3,
    liked: false,
    saved: true,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
  },
  {
    id: "p3",
    author: {
      id: "u3",
      name: "Marcus Johnson",
      username: "marcusj_track",
      avatar: "/avatars/marcus.jpg",
      school: "Jefferson HS",
      tier: "WORLD_CLASS",
      verified: true,
    },
    type: "meet",
    content: "1st place at the Winter Invitational! 🥇 Great competition today. Ready for state qualifiers next month!",
    meet: {
      name: "Winter Invitational",
      place: 1,
      event: "200m",
    },
    performance: {
      event: "200m",
      time: "20.89",
      tier: "WORLD_CLASS",
    },
    likes: 256,
    comments: 34,
    shares: 18,
    liked: false,
    saved: false,
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
  },
  {
    id: "p4",
    author: {
      id: "u4",
      name: "Sarah Chen",
      username: "sarahc_jumps",
      avatar: "/avatars/sarah.jpg",
      school: "Washington HS",
      tier: "ALL_STATE",
      verified: false,
    },
    type: "milestone",
    content: "100 workouts logged on TrackVerse! 🎉 Consistency is key. Started at JV tier, now I'm ALL_STATE. Keep grinding everyone! 📈",
    likes: 178,
    comments: 28,
    shares: 15,
    liked: true,
    saved: false,
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
  },
  {
    id: "p5",
    author: {
      id: "u5",
      name: "Tyler Smith",
      username: "tsmith_400",
      avatar: "/avatars/tyler.jpg",
      school: "Adams HS",
      tier: "NATIONAL",
      verified: true,
    },
    type: "general",
    content: "Race day tomorrow! Who else is competing at the Regional Championships? Let's get it! 🏃‍♂️💨",
    likes: 124,
    comments: 45,
    shares: 8,
    liked: false,
    saved: false,
    createdAt: new Date(Date.now() - 18 * 60 * 60 * 1000),
  },
];

const suggestedUsers = [
  { id: "s1", name: "Coach Davis", username: "coachdavis", school: "Lincoln HS", tier: null, followers: 1250 },
  { id: "s2", name: "Emma Wilson", username: "emmaw_hurdles", school: "Central HS", tier: "ELITE" as Tier, followers: 890 },
  { id: "s3", name: "Derek Thompson", username: "dthompson_throws", school: "Eastside HS", tier: "VARSITY" as Tier, followers: 456 },
];

const trendingTopics = [
  { tag: "#RegionalChamps", posts: 1234 },
  { tag: "#PRAlert", posts: 892 },
  { tag: "#TrackSeason", posts: 756 },
  { tag: "#SprintLife", posts: 543 },
];

const getPostTypeIcon = (type: PostType) => {
  switch (type) {
    case "pr": return <Flame className="h-4 w-4 text-orange-500" />;
    case "workout": return <Dumbbell className="h-4 w-4 text-blue-500" />;
    case "meet": return <Medal className="h-4 w-4 text-yellow-500" />;
    case "milestone": return <Trophy className="h-4 w-4 text-purple-500" />;
    default: return <MessageCircle className="h-4 w-4 text-white/50" />;
  }
};

const getPostTypeBadge = (type: PostType) => {
  switch (type) {
    case "pr": return { bg: "bg-orange-500/20", border: "border-orange-500/30", text: "text-orange-400", label: "NEW PR" };
    case "workout": return { bg: "bg-blue-500/20", border: "border-blue-500/30", text: "text-blue-400", label: "WORKOUT" };
    case "meet": return { bg: "bg-yellow-500/20", border: "border-yellow-500/30", text: "text-yellow-400", label: "MEET RESULT" };
    case "milestone": return { bg: "bg-purple-500/20", border: "border-purple-500/30", text: "text-purple-400", label: "MILESTONE" };
    default: return null;
  }
};

const formatTimeAgo = (date: Date) => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

export default function FeedPage() {
  const [posts, setPosts] = useState(mockPosts);
  const [newPost, setNewPost] = useState("");

  const toggleLike = (postId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          liked: !post.liked,
          likes: post.liked ? post.likes - 1 : post.likes + 1,
        };
      }
      return post;
    }));
  };

  const toggleSave = (postId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return { ...post, saved: !post.saved };
      }
      return post;
    }));
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Left Sidebar */}
          <div className="hidden lg:block space-y-6">
            {/* Quick Stats */}
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-xl font-black">
                    JT
                  </div>
                  <div>
                    <p className="font-bold text-white">Your Profile</p>
                    <p className="text-sm text-white/50">@yourhandle</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 rounded-lg bg-white/5">
                    <p className="text-lg font-black text-white">24</p>
                    <p className="text-xs text-white/50">Posts</p>
                  </div>
                  <div className="p-2 rounded-lg bg-white/5">
                    <p className="text-lg font-black text-white">156</p>
                    <p className="text-xs text-white/50">Following</p>
                  </div>
                  <div className="p-2 rounded-lg bg-white/5">
                    <p className="text-lg font-black text-white">892</p>
                    <p className="text-xs text-white/50">Followers</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-4 space-y-2">
                <Link href="/feed/create?type=pr">
                  <Button className="w-full justify-start gap-2 bg-orange-500/20 border border-orange-500/30 text-orange-400 hover:bg-orange-500/30">
                    <Flame className="h-4 w-4" />
                    Share PR
                  </Button>
                </Link>
                <Link href="/feed/create?type=workout">
                  <Button variant="outline" className="w-full justify-start gap-2 bg-white/5 border-white/10 text-white hover:bg-white/10">
                    <Dumbbell className="h-4 w-4" />
                    Share Workout
                  </Button>
                </Link>
                <Link href="/feed/create?type=meet">
                  <Button variant="outline" className="w-full justify-start gap-2 bg-white/5 border-white/10 text-white hover:bg-white/10">
                    <Medal className="h-4 w-4" />
                    Share Meet Result
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Main Feed */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-black flex items-center gap-2">
                <Zap className="h-8 w-8 text-orange-500" />
                FEED
              </h1>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" className="bg-white/5 border-white/10 text-white hover:bg-white/10">
                  <Bell className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Create Post */}
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-4">
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-sm font-black flex-shrink-0">
                    JT
                  </div>
                  <div className="flex-1">
                    <Input
                      value={newPost}
                      onChange={(e) => setNewPost(e.target.value)}
                      placeholder="Share your latest PR, workout, or race..."
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/30 mb-3"
                    />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="ghost" className="text-orange-400 hover:text-orange-300 hover:bg-orange-500/10">
                          <Flame className="h-4 w-4 mr-1" />
                          PR
                        </Button>
                        <Button size="sm" variant="ghost" className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10">
                          <Dumbbell className="h-4 w-4 mr-1" />
                          Workout
                        </Button>
                        <Button size="sm" variant="ghost" className="text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/10">
                          <Medal className="h-4 w-4 mr-1" />
                          Meet
                        </Button>
                      </div>
                      <Button size="sm" className="btn-track text-white font-bold px-4">
                        <Send className="h-4 w-4 mr-1" />
                        Post
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Feed Tabs */}
            <Tabs defaultValue="foryou" className="w-full">
              <TabsList className="bg-white/5 border border-white/10 w-full">
                <TabsTrigger value="foryou" className="flex-1 data-[state=active]:bg-orange-500 data-[state=active]:text-white">
                  For You
                </TabsTrigger>
                <TabsTrigger value="following" className="flex-1 data-[state=active]:bg-orange-500 data-[state=active]:text-white">
                  Following
                </TabsTrigger>
                <TabsTrigger value="prs" className="flex-1 data-[state=active]:bg-orange-500 data-[state=active]:text-white">
                  PRs Only 🔥
                </TabsTrigger>
              </TabsList>

              <TabsContent value="foryou" className="space-y-4 mt-4">
                {posts.map((post) => {
                  const typeBadge = getPostTypeBadge(post.type);
                  return (
                    <Card key={post.id} className="bg-white/5 border-white/10 hover:border-white/20 transition-all">
                      <CardContent className="p-4">
                        {/* Author Header */}
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-sm font-black">
                              {post.author.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-white">{post.author.name}</span>
                                {post.author.verified && (
                                  <span className="text-orange-500">✓</span>
                                )}
                                <TierBadge tier={post.author.tier} size="sm" showEmoji={false} />
                              </div>
                              <div className="flex items-center gap-2 text-sm text-white/50">
                                <span>@{post.author.username}</span>
                                <span>•</span>
                                <span>{post.author.school}</span>
                                <span>•</span>
                                <span>{formatTimeAgo(post.createdAt)}</span>
                              </div>
                            </div>
                          </div>
                          <Button variant="ghost" size="icon" className="text-white/50 hover:text-white">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>

                        {/* Post Type Badge */}
                        {typeBadge && (
                          <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold mb-3 ${typeBadge.bg} ${typeBadge.border} ${typeBadge.text} border`}>
                            {getPostTypeIcon(post.type)}
                            {typeBadge.label}
                          </div>
                        )}

                        {/* Content */}
                        <p className="text-white mb-3 whitespace-pre-wrap">{post.content}</p>

                        {/* Performance Card */}
                        {post.performance && (
                          <div className="p-4 rounded-xl bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 mb-3">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm text-white/60">{post.performance.event}</p>
                                <p className="text-3xl font-black text-white">{post.performance.time}</p>
                                {post.performance.improvement && (
                                  <p className="text-sm text-green-400 font-bold">
                                    {post.performance.improvement}s improvement!
                                  </p>
                                )}
                              </div>
                              <TierBadge tier={post.performance.tier} size="lg" />
                            </div>
                          </div>
                        )}

                        {/* Workout Card */}
                        {post.workout && (
                          <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30 mb-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                                  <Dumbbell className="h-5 w-5 text-blue-400" />
                                </div>
                                <div>
                                  <p className="font-bold text-white">{post.workout.title}</p>
                                  <p className="text-sm text-white/50">{post.workout.duration}min • Effort: {post.workout.effort}/10</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Meet Card */}
                        {post.meet && (
                          <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/30 mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                                {post.meet.place === 1 ? "🥇" : post.meet.place === 2 ? "🥈" : post.meet.place === 3 ? "🥉" : `#${post.meet.place}`}
                              </div>
                              <div>
                                <p className="font-bold text-white">{post.meet.name}</p>
                                <p className="text-sm text-white/50">{post.meet.event} • {post.meet.place === 1 ? "1st Place" : `${post.meet.place}th Place`}</p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex items-center justify-between pt-3 border-t border-white/10">
                          <div className="flex items-center gap-4">
                            <button
                              onClick={() => toggleLike(post.id)}
                              className={`flex items-center gap-1 transition-colors ${
                                post.liked ? 'text-red-500' : 'text-white/50 hover:text-red-500'
                              }`}
                            >
                              <Heart className={`h-5 w-5 ${post.liked ? 'fill-current' : ''}`} />
                              <span className="text-sm font-semibold">{post.likes}</span>
                            </button>
                            <button className="flex items-center gap-1 text-white/50 hover:text-blue-400 transition-colors">
                              <MessageCircle className="h-5 w-5" />
                              <span className="text-sm font-semibold">{post.comments}</span>
                            </button>
                            <button className="flex items-center gap-1 text-white/50 hover:text-green-400 transition-colors">
                              <Share2 className="h-5 w-5" />
                              <span className="text-sm font-semibold">{post.shares}</span>
                            </button>
                          </div>
                          <button
                            onClick={() => toggleSave(post.id)}
                            className={`transition-colors ${
                              post.saved ? 'text-yellow-500' : 'text-white/50 hover:text-yellow-500'
                            }`}
                          >
                            <Bookmark className={`h-5 w-5 ${post.saved ? 'fill-current' : ''}`} />
                          </button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </TabsContent>

              <TabsContent value="following" className="mt-4">
                <Card className="p-8 text-center bg-white/5 border-white/10">
                  <Users className="h-12 w-12 mx-auto text-orange-500/50 mb-4" />
                  <h3 className="text-lg font-bold text-white mb-2">Follow More Athletes</h3>
                  <p className="text-white/50 mb-4">
                    Follow athletes to see their posts here
                  </p>
                  <Button className="btn-track text-white font-bold">
                    Discover Athletes
                  </Button>
                </Card>
              </TabsContent>

              <TabsContent value="prs" className="space-y-4 mt-4">
                {posts.filter(p => p.type === "pr").map((post) => {
                  const typeBadge = getPostTypeBadge(post.type);
                  return (
                    <Card key={post.id} className="bg-white/5 border-white/10 hover:border-orange-500/50 transition-all">
                      <CardContent className="p-4">
                        {/* Same post structure as above */}
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-sm font-black">
                              {post.author.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-white">{post.author.name}</span>
                                {post.author.verified && <span className="text-orange-500">✓</span>}
                                <TierBadge tier={post.author.tier} size="sm" showEmoji={false} />
                              </div>
                              <div className="flex items-center gap-2 text-sm text-white/50">
                                <span>@{post.author.username}</span>
                                <span>•</span>
                                <span>{formatTimeAgo(post.createdAt)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        {typeBadge && (
                          <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold mb-3 ${typeBadge.bg} ${typeBadge.border} ${typeBadge.text} border`}>
                            {getPostTypeIcon(post.type)}
                            {typeBadge.label}
                          </div>
                        )}
                        <p className="text-white mb-3">{post.content}</p>
                        {post.performance && (
                          <div className="p-4 rounded-xl bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 mb-3">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm text-white/60">{post.performance.event}</p>
                                <p className="text-3xl font-black text-white">{post.performance.time}</p>
                                {post.performance.improvement && (
                                  <p className="text-sm text-green-400 font-bold">{post.performance.improvement}s improvement!</p>
                                )}
                              </div>
                              <TierBadge tier={post.performance.tier} size="lg" />
                            </div>
                          </div>
                        )}
                        <div className="flex items-center justify-between pt-3 border-t border-white/10">
                          <div className="flex items-center gap-4">
                            <button onClick={() => toggleLike(post.id)} className={`flex items-center gap-1 ${post.liked ? 'text-red-500' : 'text-white/50'}`}>
                              <Heart className={`h-5 w-5 ${post.liked ? 'fill-current' : ''}`} />
                              <span className="text-sm font-semibold">{post.likes}</span>
                            </button>
                            <button className="flex items-center gap-1 text-white/50">
                              <MessageCircle className="h-5 w-5" />
                              <span className="text-sm font-semibold">{post.comments}</span>
                            </button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Sidebar */}
          <div className="hidden lg:block space-y-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
              <Input
                placeholder="Search athletes, posts..."
                className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/30"
              />
            </div>

            {/* Trending */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader className="pb-2">
                <h3 className="font-bold text-white flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-orange-500" />
                  Trending
                </h3>
              </CardHeader>
              <CardContent className="space-y-3">
                {trendingTopics.map((topic, i) => (
                  <div key={i} className="flex items-center justify-between hover:bg-white/5 p-2 rounded-lg cursor-pointer transition-colors">
                    <div>
                      <p className="font-bold text-white">{topic.tag}</p>
                      <p className="text-xs text-white/50">{topic.posts.toLocaleString()} posts</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-white/30" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Suggested Users */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader className="pb-2">
                <h3 className="font-bold text-white flex items-center gap-2">
                  <Users className="h-4 w-4 text-orange-500" />
                  Who to Follow
                </h3>
              </CardHeader>
              <CardContent className="space-y-3">
                {suggestedUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-xs font-black">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="flex items-center gap-1">
                          <p className="font-bold text-white text-sm">{user.name}</p>
                          {user.tier && <TierBadge tier={user.tier} size="sm" showEmoji={false} />}
                        </div>
                        <p className="text-xs text-white/50">@{user.username}</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="bg-white/5 border-white/10 text-white hover:bg-orange-500 hover:border-orange-500 text-xs">
                      Follow
                    </Button>
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
