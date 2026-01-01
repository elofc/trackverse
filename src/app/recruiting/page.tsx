"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Search, 
  Filter, 
  Star, 
  MessageSquare, 
  Eye, 
  TrendingUp,
  MapPin,
  GraduationCap,
  Trophy,
  Clock,
  ChevronDown,
  Users,
  Bookmark,
  ExternalLink,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { TierBadge } from "@/components/trackverse";

// Mock athlete data for search results
const mockAthletes = [
  {
    id: "1",
    name: "Jaylen Thompson",
    school: "Lincoln High School",
    location: "Springfield, OR",
    gradYear: 2025,
    events: [
      { name: "100m", time: "10.15", tier: "GODSPEED" as const, stateRank: 1, nationalRank: 12 },
      { name: "200m", time: "20.45", tier: "WORLD_CLASS" as const, stateRank: 2, nationalRank: 28 },
    ],
    profileViews: 1234,
    savedBy: 45,
    recruitingStatus: "open",
    verified: true,
    avatar: null,
    improvement: "+0.70s",
  },
  {
    id: "2",
    name: "Marcus Johnson",
    school: "Roosevelt High School",
    location: "Portland, OR",
    gradYear: 2025,
    events: [
      { name: "200m", time: "20.82", tier: "WORLD_CLASS" as const, stateRank: 3, nationalRank: 45 },
      { name: "400m", time: "46.92", tier: "NATIONAL" as const, stateRank: 1, nationalRank: 32 },
    ],
    profileViews: 892,
    savedBy: 32,
    recruitingStatus: "open",
    verified: true,
    avatar: null,
    improvement: "+0.45s",
  },
  {
    id: "3",
    name: "Tyler Smith",
    school: "Jefferson High School",
    location: "Eugene, OR",
    gradYear: 2026,
    events: [
      { name: "110H", time: "13.85", tier: "NATIONAL" as const, stateRank: 1, nationalRank: 18 },
      { name: "300H", time: "37.42", tier: "ALL_STATE" as const, stateRank: 2, nationalRank: 56 },
    ],
    profileViews: 567,
    savedBy: 18,
    recruitingStatus: "open",
    verified: false,
    avatar: null,
    improvement: "+0.32s",
  },
  {
    id: "4",
    name: "Chris Davis",
    school: "Washington High School",
    location: "Seattle, WA",
    gradYear: 2025,
    events: [
      { name: "800m", time: "1:49.23", tier: "NATIONAL" as const, stateRank: 1, nationalRank: 24 },
      { name: "1600m", time: "4:05.67", tier: "ALL_STATE" as const, stateRank: 3, nationalRank: 89 },
    ],
    profileViews: 723,
    savedBy: 28,
    recruitingStatus: "committed",
    committedTo: "University of Oregon",
    verified: true,
    avatar: null,
    improvement: "+2.1s",
  },
  {
    id: "5",
    name: "Jordan Williams",
    school: "Central High School",
    location: "Boise, ID",
    gradYear: 2026,
    events: [
      { name: "Long Jump", time: "7.42m", tier: "ALL_STATE" as const, stateRank: 1, nationalRank: 67 },
      { name: "Triple Jump", time: "15.23m", tier: "ELITE" as const, stateRank: 2, nationalRank: 112 },
    ],
    profileViews: 412,
    savedBy: 15,
    recruitingStatus: "open",
    verified: true,
    avatar: null,
    improvement: "+0.28m",
  },
];

const events = [
  "All Events",
  "100m", "200m", "400m", "800m", "1600m", "3200m",
  "110H", "300H", "400H",
  "High Jump", "Long Jump", "Triple Jump", "Pole Vault",
  "Shot Put", "Discus", "Javelin"
];

const states = [
  "All States", "OR", "WA", "CA", "ID", "NV", "AZ", "TX", "FL", "NY"
];

const gradYears = ["All Years", "2025", "2026", "2027", "2028"];

const tiers = ["All Tiers", "GODSPEED", "WORLD_CLASS", "NATIONAL", "ALL_STATE", "ELITE"];

export default function RecruitingPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEvent, setSelectedEvent] = useState("All Events");
  const [selectedState, setSelectedState] = useState("All States");
  const [selectedYear, setSelectedYear] = useState("All Years");
  const [selectedTier, setSelectedTier] = useState("All Tiers");
  const [showFilters, setShowFilters] = useState(false);
  const [savedAthletes, setSavedAthletes] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const toggleSaveAthlete = (athleteId: string) => {
    setSavedAthletes(prev => 
      prev.includes(athleteId) 
        ? prev.filter(id => id !== athleteId)
        : [...prev, athleteId]
    );
  };

  const filteredAthletes = mockAthletes.filter(athlete => {
    if (searchQuery && !athlete.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !athlete.school.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (selectedEvent !== "All Events" && !athlete.events.some(e => e.name === selectedEvent)) {
      return false;
    }
    if (selectedState !== "All States" && !athlete.location.includes(selectedState)) {
      return false;
    }
    if (selectedYear !== "All Years" && athlete.gradYear.toString() !== selectedYear) {
      return false;
    }
    if (selectedTier !== "All Tiers" && !athlete.events.some(e => e.tier === selectedTier)) {
      return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-orange-500 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <Users className="w-8 h-8" />
                Recruiting Hub
              </h1>
              <p className="text-orange-100 mt-1">
                Discover and connect with top track & field talent
              </p>
            </div>
            <div className="flex gap-3">
              <Link href="/recruiting/prospects">
                <Button variant="outline" className="bg-white/10 border-white/20 hover:bg-white/20">
                  <Bookmark className="w-4 h-4 mr-2" />
                  My Prospects ({savedAthletes.length})
                </Button>
              </Link>
              <Link href="/recruiting/messages">
                <Button variant="outline" className="bg-white/10 border-white/20 hover:bg-white/20">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Messages
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Search & Filters */}
        <Card className="bg-zinc-900 border-zinc-800 p-4 mb-6">
          <div className="flex flex-col gap-4">
            {/* Search Bar */}
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                <Input
                  placeholder="Search athletes by name or school..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-zinc-800 border-zinc-700 text-white"
                />
              </div>
              <Button 
                variant="outline" 
                className="border-zinc-700 hover:bg-zinc-800"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
                <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </Button>
            </div>

            {/* Filter Options */}
            {showFilters && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-3 border-t border-zinc-800">
                <div>
                  <label className="text-xs text-zinc-400 mb-1 block">Event</label>
                  <select
                    value={selectedEvent}
                    onChange={(e) => setSelectedEvent(e.target.value)}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-md px-3 py-2 text-sm"
                  >
                    {events.map(event => (
                      <option key={event} value={event}>{event}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-zinc-400 mb-1 block">State</label>
                  <select
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-md px-3 py-2 text-sm"
                  >
                    {states.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-zinc-400 mb-1 block">Grad Year</label>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-md px-3 py-2 text-sm"
                  >
                    {gradYears.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-zinc-400 mb-1 block">Min Tier</label>
                  <select
                    value={selectedTier}
                    onChange={(e) => setSelectedTier(e.target.value)}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-md px-3 py-2 text-sm"
                  >
                    {tiers.map(tier => (
                      <option key={tier} value={tier}>{tier}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-zinc-400">
            <span className="text-white font-semibold">{filteredAthletes.length}</span> athletes found
          </p>
          <div className="flex gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className={viewMode === "grid" ? "bg-orange-500 hover:bg-orange-600" : "border-zinc-700"}
            >
              Grid
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("list")}
              className={viewMode === "list" ? "bg-orange-500 hover:bg-orange-600" : "border-zinc-700"}
            >
              List
            </Button>
          </div>
        </div>

        {/* Athlete Cards */}
        <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-3"}>
          {filteredAthletes.map((athlete) => (
            <Card 
              key={athlete.id} 
              className={`bg-zinc-900 border-zinc-800 overflow-hidden hover:border-orange-500/50 transition-colors ${
                viewMode === "list" ? "flex" : ""
              }`}
            >
              {/* Card Header */}
              <div className={`p-4 ${viewMode === "list" ? "flex-1 flex items-center gap-4" : ""}`}>
                <div className={`flex items-start gap-3 ${viewMode === "list" ? "flex-1" : "mb-4"}`}>
                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-lg font-bold flex-shrink-0">
                    {athlete.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-white truncate">{athlete.name}</h3>
                      {athlete.verified && (
                        <Badge className="bg-blue-500/20 text-blue-400 text-xs">Verified</Badge>
                      )}
                    </div>
                    <p className="text-sm text-zinc-400 truncate">{athlete.school}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-zinc-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {athlete.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <GraduationCap className="w-3 h-3" />
                        Class of {athlete.gradYear}
                      </span>
                    </div>
                  </div>

                  {/* Recruiting Status */}
                  {athlete.recruitingStatus === "committed" ? (
                    <Badge className="bg-green-500/20 text-green-400 flex-shrink-0">
                      Committed
                    </Badge>
                  ) : (
                    <Badge className="bg-orange-500/20 text-orange-400 flex-shrink-0">
                      Open
                    </Badge>
                  )}
                </div>

                {/* Events */}
                <div className={viewMode === "list" ? "flex gap-4" : "space-y-2 mb-4"}>
                  {athlete.events.map((event, idx) => (
                    <div 
                      key={idx} 
                      className={`flex items-center justify-between ${
                        viewMode === "list" ? "bg-zinc-800 rounded-lg px-3 py-2" : "bg-zinc-800/50 rounded-lg p-2"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{event.name}</span>
                        <span className="text-lg font-mono font-bold text-orange-400">{event.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <TierBadge tier={event.tier} size="sm" />
                        {viewMode === "grid" && (
                          <span className="text-xs text-zinc-500">
                            #{event.stateRank} State
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Stats Row */}
                {viewMode === "grid" && (
                  <div className="flex items-center justify-between text-xs text-zinc-500 mb-4">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {athlete.profileViews} views
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      Saved by {athlete.savedBy}
                    </span>
                    <span className="flex items-center gap-1 text-green-400">
                      <TrendingUp className="w-3 h-3" />
                      {athlete.improvement}
                    </span>
                  </div>
                )}

                {/* Actions */}
                <div className={`flex gap-2 ${viewMode === "list" ? "" : "pt-3 border-t border-zinc-800"}`}>
                  <Link href={`/recruiting/athlete/${athlete.id}`} className="flex-1">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full border-zinc-700 hover:bg-zinc-800"
                    >
                      <ExternalLink className="w-4 h-4 mr-1" />
                      View Profile
                    </Button>
                  </Link>
                  <Button
                    variant={savedAthletes.includes(athlete.id) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleSaveAthlete(athlete.id)}
                    className={savedAthletes.includes(athlete.id) 
                      ? "bg-orange-500 hover:bg-orange-600" 
                      : "border-zinc-700 hover:bg-zinc-800"
                    }
                  >
                    <Star className={`w-4 h-4 ${savedAthletes.includes(athlete.id) ? "fill-current" : ""}`} />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-zinc-700 hover:bg-zinc-800"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredAthletes.length === 0 && (
          <Card className="bg-zinc-900 border-zinc-800 p-12 text-center">
            <Search className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No athletes found</h3>
            <p className="text-zinc-400 mb-4">
              Try adjusting your filters or search query
            </p>
            <Button 
              variant="outline" 
              className="border-zinc-700"
              onClick={() => {
                setSearchQuery("");
                setSelectedEvent("All Events");
                setSelectedState("All States");
                setSelectedYear("All Years");
                setSelectedTier("All Tiers");
              }}
            >
              Clear Filters
            </Button>
          </Card>
        )}

        {/* Quick Stats Sidebar - Mobile Hidden */}
        <div className="hidden lg:block fixed right-4 top-32 w-64">
          <Card className="bg-zinc-900 border-zinc-800 p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4 text-orange-400" />
              Quick Stats
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-zinc-400">Total Athletes</span>
                <span className="font-semibold">12,450</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Class of 2025</span>
                <span className="font-semibold">4,230</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">ELITE+ Tier</span>
                <span className="font-semibold">1,892</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Open to Recruiting</span>
                <span className="font-semibold text-green-400">8,945</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
