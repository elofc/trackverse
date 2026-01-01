"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  ArrowLeft,
  Star, 
  MessageSquare, 
  Trash2,
  FolderPlus,
  MoreVertical,
  Search,
  Filter,
  Users,
  Eye,
  Calendar,
  ChevronDown,
  Edit2,
  Share2,
  Download
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { TierBadge, Navbar } from "@/components/trackverse";

// Mock prospect lists
const mockProspectLists = [
  {
    id: "1",
    name: "Top Sprinters 2025",
    description: "Elite sprinters for next recruiting class",
    athleteCount: 12,
    createdAt: "Dec 15, 2024",
    updatedAt: "Dec 30, 2024",
  },
  {
    id: "2",
    name: "Distance Runners",
    description: "800m-3200m prospects",
    athleteCount: 8,
    createdAt: "Dec 10, 2024",
    updatedAt: "Dec 28, 2024",
  },
  {
    id: "3",
    name: "Multi-Event Athletes",
    description: "Versatile athletes for multiple events",
    athleteCount: 5,
    createdAt: "Dec 5, 2024",
    updatedAt: "Dec 25, 2024",
  },
];

// Mock saved athletes
const mockSavedAthletes = [
  {
    id: "1",
    name: "Jaylen Thompson",
    school: "Lincoln High School",
    location: "Springfield, OR",
    gradYear: 2025,
    primaryEvent: "100m",
    primaryTime: "10.15",
    tier: "GODSPEED" as const,
    stateRank: 1,
    nationalRank: 12,
    savedAt: "Dec 28, 2024",
    lists: ["Top Sprinters 2025"],
    notes: "Excellent start, great form. Follow up in January.",
    lastViewed: "2 days ago",
  },
  {
    id: "2",
    name: "Marcus Johnson",
    school: "Roosevelt High School",
    location: "Portland, OR",
    gradYear: 2025,
    primaryEvent: "400m",
    primaryTime: "46.92",
    tier: "NATIONAL" as const,
    stateRank: 1,
    nationalRank: 32,
    savedAt: "Dec 25, 2024",
    lists: ["Top Sprinters 2025"],
    notes: "",
    lastViewed: "5 days ago",
  },
  {
    id: "3",
    name: "Tyler Smith",
    school: "Jefferson High School",
    location: "Eugene, OR",
    gradYear: 2026,
    primaryEvent: "110H",
    primaryTime: "13.85",
    tier: "NATIONAL" as const,
    stateRank: 1,
    nationalRank: 18,
    savedAt: "Dec 20, 2024",
    lists: ["Multi-Event Athletes"],
    notes: "Great hurdler, also jumps. Watch at state meet.",
    lastViewed: "1 week ago",
  },
  {
    id: "4",
    name: "Chris Davis",
    school: "Washington High School",
    location: "Seattle, WA",
    gradYear: 2025,
    primaryEvent: "800m",
    primaryTime: "1:49.23",
    tier: "NATIONAL" as const,
    stateRank: 1,
    nationalRank: 24,
    savedAt: "Dec 18, 2024",
    lists: ["Distance Runners"],
    notes: "Strong kick, good race IQ.",
    lastViewed: "3 days ago",
  },
];

export default function ProspectsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedList, setSelectedList] = useState<string | null>(null);
  const [showCreateList, setShowCreateList] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [selectedAthletes, setSelectedAthletes] = useState<string[]>([]);

  const filteredAthletes = mockSavedAthletes.filter(athlete => {
    if (searchQuery && !athlete.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (selectedList && !athlete.lists.includes(selectedList)) {
      return false;
    }
    return true;
  });

  const toggleSelectAthlete = (id: string) => {
    setSelectedAthletes(prev => 
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selectedAthletes.length === filteredAthletes.length) {
      setSelectedAthletes([]);
    } else {
      setSelectedAthletes(filteredAthletes.map(a => a.id));
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navbar />
      
      {/* Header */}
      <div className="bg-gradient-to-b from-orange-600/20 to-transparent py-8 border-b border-orange-500/20">
        <div className="max-w-7xl mx-auto px-4">
          <Link 
            href="/recruiting" 
            className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Search
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <Star className="w-8 h-8" />
                My Prospects
              </h1>
              <p className="text-zinc-400 mt-1">
                {mockSavedAthletes.length} saved athletes across {mockProspectLists.length} lists
              </p>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="bg-white/10 border-white/20 hover:bg-white/20"
                onClick={() => setShowCreateList(true)}
              >
                <FolderPlus className="w-4 h-4 mr-2" />
                New List
              </Button>
              <Button variant="outline" className="bg-white/10 border-white/20 hover:bg-white/20">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Lists */}
          <div className="space-y-4">
            <Card className="bg-zinc-900 border-zinc-800 p-4">
              <h3 className="font-semibold mb-3 flex items-center justify-between">
                <span>Prospect Lists</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0"
                  onClick={() => setShowCreateList(true)}
                >
                  <FolderPlus className="w-4 h-4" />
                </Button>
              </h3>
              
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedList(null)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center justify-between ${
                    selectedList === null 
                      ? "bg-orange-500/20 text-orange-400" 
                      : "hover:bg-zinc-800 text-zinc-300"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    All Prospects
                  </span>
                  <Badge variant="outline" className="border-zinc-700">
                    {mockSavedAthletes.length}
                  </Badge>
                </button>

                {mockProspectLists.map((list) => (
                  <button
                    key={list.id}
                    onClick={() => setSelectedList(list.name)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center justify-between ${
                      selectedList === list.name 
                        ? "bg-orange-500/20 text-orange-400" 
                        : "hover:bg-zinc-800 text-zinc-300"
                    }`}
                  >
                    <span className="truncate">{list.name}</span>
                    <Badge variant="outline" className="border-zinc-700 flex-shrink-0">
                      {list.athleteCount}
                    </Badge>
                  </button>
                ))}
              </div>

              {/* Create List Modal */}
              {showCreateList && (
                <div className="mt-4 p-3 bg-zinc-800 rounded-lg">
                  <Input
                    placeholder="List name..."
                    value={newListName}
                    onChange={(e) => setNewListName(e.target.value)}
                    className="bg-zinc-700 border-zinc-600 mb-2"
                  />
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      className="flex-1 bg-orange-500 hover:bg-orange-600"
                      onClick={() => {
                        setShowCreateList(false);
                        setNewListName("");
                      }}
                    >
                      Create
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="border-zinc-600"
                      onClick={() => {
                        setShowCreateList(false);
                        setNewListName("");
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </Card>

            {/* Quick Stats */}
            <Card className="bg-zinc-900 border-zinc-800 p-4">
              <h3 className="font-semibold mb-3">Quick Stats</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Total Saved</span>
                  <span className="font-semibold">{mockSavedAthletes.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Class of 2025</span>
                  <span className="font-semibold">
                    {mockSavedAthletes.filter(a => a.gradYear === 2025).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Class of 2026</span>
                  <span className="font-semibold">
                    {mockSavedAthletes.filter(a => a.gradYear === 2026).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">With Notes</span>
                  <span className="font-semibold">
                    {mockSavedAthletes.filter(a => a.notes).length}
                  </span>
                </div>
              </div>
            </Card>
          </div>

          {/* Main Content - Athletes */}
          <div className="lg:col-span-3 space-y-4">
            {/* Search & Actions */}
            <Card className="bg-zinc-900 border-zinc-800 p-4">
              <div className="flex flex-col md:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                  <Input
                    placeholder="Search saved athletes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-zinc-800 border-zinc-700"
                  />
                </div>
                {selectedAthletes.length > 0 && (
                  <div className="flex gap-2">
                    <Button variant="outline" className="border-zinc-700">
                      <FolderPlus className="w-4 h-4 mr-2" />
                      Add to List
                    </Button>
                    <Button variant="outline" className="border-zinc-700">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Message All
                    </Button>
                    <Button variant="outline" className="border-red-900 text-red-400 hover:bg-red-900/20">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Remove
                    </Button>
                  </div>
                )}
              </div>
            </Card>

            {/* Select All */}
            <div className="flex items-center justify-between px-2">
              <label className="flex items-center gap-2 text-sm text-zinc-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedAthletes.length === filteredAthletes.length && filteredAthletes.length > 0}
                  onChange={selectAll}
                  className="rounded border-zinc-600 bg-zinc-800"
                />
                Select All ({filteredAthletes.length})
              </label>
              <span className="text-sm text-zinc-500">
                {selectedAthletes.length} selected
              </span>
            </div>

            {/* Athletes List */}
            <div className="space-y-3">
              {filteredAthletes.map((athlete) => (
                <Card 
                  key={athlete.id} 
                  className={`bg-zinc-900 border-zinc-800 p-4 transition-colors ${
                    selectedAthletes.includes(athlete.id) ? "border-orange-500/50" : ""
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Checkbox */}
                    <input
                      type="checkbox"
                      checked={selectedAthletes.includes(athlete.id)}
                      onChange={() => toggleSelectAthlete(athlete.id)}
                      className="mt-1 rounded border-zinc-600 bg-zinc-800"
                    />

                    {/* Avatar */}
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-lg font-bold flex-shrink-0">
                      {athlete.name.split(' ').map(n => n[0]).join('')}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Link 
                          href={`/recruiting/athlete/${athlete.id}`}
                          className="font-semibold hover:text-orange-400 transition-colors"
                        >
                          {athlete.name}
                        </Link>
                        <TierBadge tier={athlete.tier} size="sm" />
                        <Badge variant="outline" className="border-zinc-700 text-xs">
                          Class of {athlete.gradYear}
                        </Badge>
                      </div>
                      <p className="text-sm text-zinc-400">
                        {athlete.school} • {athlete.location}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-sm">
                        <span className="font-mono font-bold text-orange-400">
                          {athlete.primaryEvent}: {athlete.primaryTime}
                        </span>
                        <span className="text-zinc-500">
                          #{athlete.stateRank} State • #{athlete.nationalRank} National
                        </span>
                      </div>
                      {athlete.notes && (
                        <p className="mt-2 text-sm text-zinc-500 italic">
                          📝 {athlete.notes}
                        </p>
                      )}
                      <div className="flex items-center gap-4 mt-2 text-xs text-zinc-600">
                        <span>Saved {athlete.savedAt}</span>
                        <span>Last viewed {athlete.lastViewed}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Link href={`/recruiting/athlete/${athlete.id}`}>
                        <Button variant="outline" size="sm" className="border-zinc-700">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button variant="outline" size="sm" className="border-zinc-700">
                        <MessageSquare className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="border-zinc-700">
                        <Edit2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Empty State */}
            {filteredAthletes.length === 0 && (
              <Card className="bg-zinc-900 border-zinc-800 p-12 text-center">
                <Star className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No prospects found</h3>
                <p className="text-zinc-400 mb-4">
                  {selectedList 
                    ? `No athletes in "${selectedList}" list`
                    : "Start saving athletes from the search page"
                  }
                </p>
                <Link href="/recruiting">
                  <Button className="bg-orange-500 hover:bg-orange-600">
                    <Search className="w-4 h-4 mr-2" />
                    Find Athletes
                  </Button>
                </Link>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
