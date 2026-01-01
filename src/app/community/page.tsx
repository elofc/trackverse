"use client";

import { Navbar } from "@/components/trackverse/navbar";
import { PostCard } from "@/components/trackverse/post-card";
import { AthleteCard } from "@/components/trackverse/athlete-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Search,
  UserPlus,
  TrendingUp,
  Hash,
  Image,
  Video,
  Smile,
} from "lucide-react";

const suggestedAthletes = [
  {
    name: "Marcus Johnson",
    school: "Lincoln HS",
    gradYear: 2025,
    rank: 1,
    tier: "world-class" as const,
    events: [
      { name: "100m", time: 10450 },
      { name: "200m", time: 21200 },
    ],
  },
  {
    name: "Tyler Smith",
    school: "Roosevelt HS",
    gradYear: 2025,
    rank: 2,
    tier: "national" as const,
    events: [
      { name: "100m", time: 10620 },
      { name: "200m", time: 21450 },
    ],
  },
  {
    name: "Sarah Williams",
    school: "Jefferson HS",
    gradYear: 2026,
    rank: 5,
    tier: "all-state" as const,
    events: [
      { name: "400m", time: 54200 },
      { name: "800m", time: 132000 },
    ],
  },
];

const trendingTopics = [
  { tag: "StateChampionships", posts: 1234 },
  { tag: "PRAlert", posts: 892 },
  { tag: "SprintSeason", posts: 654 },
  { tag: "TrackLife", posts: 543 },
  { tag: "RelaySquad", posts: 432 },
];

const feedPosts = [
  {
    author: { name: "Marcus Johnson", school: "Lincoln HS" },
    content: "Just dropped a new PR in the 100m! All that hard work is paying off. Next stop: State Championships! 🏃‍♂️💨 #PRAlert #SprintSeason",
    prData: { event: "100m", time: 10450, improvement: 150 },
    likes: 234,
    comments: 45,
    shares: 12,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    author: { name: "Sarah Williams", school: "Jefferson HS" },
    content: "Great practice today with the team! 6x200m at race pace. Feeling strong heading into the weekend meet. #TrackLife",
    likes: 89,
    comments: 12,
    shares: 3,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
  },
  {
    author: { name: "Coach Thompson", school: "Lincoln HS" },
    content: "Proud of our relay team today! They put in the work and it shows. State qualifiers here we come! 🏆 #RelaySquad",
    mediaUrl: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800",
    likes: 312,
    comments: 28,
    shares: 45,
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
  },
];

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Users className="h-8 w-8 text-primary" />
              Community
            </h1>
            <p className="text-muted-foreground mt-1">
              Connect with athletes, share your journey, and get inspired
            </p>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search athletes, posts..." className="pl-9 w-64" />
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Feed */}
          <div className="lg:col-span-2 space-y-6">
            {/* Post Composer */}
            <Card>
              <CardContent className="p-4">
                <div className="flex gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      JD
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <Input 
                      placeholder="Share your training, PRs, or thoughts..." 
                      className="mb-3"
                    />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" className="gap-1.5">
                          <Image className="h-4 w-4" />
                          Photo
                        </Button>
                        <Button variant="ghost" size="sm" className="gap-1.5">
                          <Video className="h-4 w-4" />
                          Video
                        </Button>
                        <Button variant="ghost" size="sm" className="gap-1.5">
                          <TrendingUp className="h-4 w-4" />
                          PR
                        </Button>
                        <Button variant="ghost" size="sm" className="gap-1.5">
                          <Smile className="h-4 w-4" />
                        </Button>
                      </div>
                      <Button variant="gradient" size="sm">
                        Post
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Feed Tabs */}
            <Tabs defaultValue="for-you" className="w-full">
              <TabsList>
                <TabsTrigger value="for-you">For You</TabsTrigger>
                <TabsTrigger value="following">Following</TabsTrigger>
                <TabsTrigger value="trending">Trending</TabsTrigger>
              </TabsList>
              
              <TabsContent value="for-you" className="space-y-4 mt-4">
                {feedPosts.map((post, i) => (
                  <PostCard key={i} {...post} />
                ))}
              </TabsContent>
              
              <TabsContent value="following" className="mt-4">
                <Card className="p-8 text-center">
                  <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Follow Athletes</h3>
                  <p className="text-muted-foreground mb-4">
                    Follow athletes to see their posts here
                  </p>
                  <Button>Find Athletes</Button>
                </Card>
              </TabsContent>
              
              <TabsContent value="trending" className="space-y-4 mt-4">
                {feedPosts.map((post, i) => (
                  <PostCard key={i} {...post} isLiked={i === 0} />
                ))}
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Suggested Athletes */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <UserPlus className="h-4 w-4" />
                  Athletes to Follow
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {suggestedAthletes.map((athlete, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                          {athlete.name.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{athlete.name}</p>
                        <p className="text-xs text-muted-foreground">{athlete.school}</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Follow
                    </Button>
                  </div>
                ))}
                <Button variant="ghost" className="w-full text-sm">
                  View More
                </Button>
              </CardContent>
            </Card>

            {/* Trending Topics */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Trending
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {trendingTopics.map((topic, i) => (
                  <div 
                    key={i} 
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Hash className="h-4 w-4 text-primary" />
                      <span className="font-medium text-sm">{topic.tag}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {topic.posts.toLocaleString()} posts
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Your Stats */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Your Community Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold">156</p>
                    <p className="text-xs text-muted-foreground">Followers</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">89</p>
                    <p className="text-xs text-muted-foreground">Following</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">24</p>
                    <p className="text-xs text-muted-foreground">Posts</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
