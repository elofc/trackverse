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
  Search,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Mail,
  Phone,
  Calendar,
  TrendingUp,
  Flame,
  Target,
  Activity,
  CheckCircle2,
  Clock,
  UserPlus,
  Filter,
  Download,
  Upload,
  Trash2,
  Edit,
  Eye,
  MessageSquare,
  Award,
  Zap,
} from "lucide-react";

interface Athlete {
  id: string;
  name: string;
  email: string;
  phone?: string;
  grade: number;
  events: string[];
  tier: Tier;
  group: string;
  joinedAt: Date;
  stats: {
    workoutsCompleted: number;
    prsThisSeason: number;
    streak: number;
    completionRate: number;
  };
  status: "active" | "injured" | "inactive";
}

const mockAthletes: Athlete[] = [
  {
    id: "u1",
    name: "Jaylen Thompson",
    email: "jaylen.t@school.edu",
    phone: "(555) 123-4567",
    grade: 12,
    events: ["100m", "200m"],
    tier: "GODSPEED",
    group: "Sprints",
    joinedAt: new Date(2023, 8, 1),
    stats: { workoutsCompleted: 156, prsThisSeason: 5, streak: 14, completionRate: 98 },
    status: "active",
  },
  {
    id: "u2",
    name: "Marcus Johnson",
    email: "marcus.j@school.edu",
    grade: 11,
    events: ["200m", "400m"],
    tier: "WORLD_CLASS",
    group: "Sprints",
    joinedAt: new Date(2023, 8, 15),
    stats: { workoutsCompleted: 142, prsThisSeason: 3, streak: 12, completionRate: 95 },
    status: "active",
  },
  {
    id: "u3",
    name: "Maya Rodriguez",
    email: "maya.r@school.edu",
    grade: 10,
    events: ["100m", "200m"],
    tier: "ELITE",
    group: "Sprints",
    joinedAt: new Date(2024, 0, 10),
    stats: { workoutsCompleted: 89, prsThisSeason: 2, streak: 10, completionRate: 92 },
    status: "active",
  },
  {
    id: "u4",
    name: "Sarah Chen",
    email: "sarah.c@school.edu",
    grade: 11,
    events: ["Long Jump", "Triple Jump"],
    tier: "ALL_STATE",
    group: "Jumps",
    joinedAt: new Date(2023, 8, 1),
    stats: { workoutsCompleted: 134, prsThisSeason: 4, streak: 8, completionRate: 94 },
    status: "active",
  },
  {
    id: "u5",
    name: "Tyler Smith",
    email: "tyler.s@school.edu",
    grade: 12,
    events: ["400m", "800m"],
    tier: "NATIONAL",
    group: "Mid-Distance",
    joinedAt: new Date(2022, 8, 1),
    stats: { workoutsCompleted: 198, prsThisSeason: 2, streak: 6, completionRate: 97 },
    status: "active",
  },
  {
    id: "u6",
    name: "Emma Wilson",
    email: "emma.w@school.edu",
    grade: 10,
    events: ["100m Hurdles", "300m Hurdles"],
    tier: "VARSITY",
    group: "Hurdles",
    joinedAt: new Date(2024, 0, 5),
    stats: { workoutsCompleted: 45, prsThisSeason: 1, streak: 4, completionRate: 88 },
    status: "active",
  },
  {
    id: "u7",
    name: "Derek Thompson",
    email: "derek.t@school.edu",
    grade: 11,
    events: ["Shot Put", "Discus"],
    tier: "ELITE",
    group: "Throws",
    joinedAt: new Date(2023, 8, 1),
    stats: { workoutsCompleted: 112, prsThisSeason: 3, streak: 0, completionRate: 85 },
    status: "injured",
  },
  {
    id: "u8",
    name: "Alex Kim",
    email: "alex.k@school.edu",
    grade: 9,
    events: ["1600m", "3200m"],
    tier: "JV",
    group: "Distance",
    joinedAt: new Date(2024, 8, 1),
    stats: { workoutsCompleted: 28, prsThisSeason: 2, streak: 7, completionRate: 90 },
    status: "active",
  },
];

const groups = ["All", "Sprints", "Mid-Distance", "Distance", "Hurdles", "Jumps", "Throws"];

export default function RosterPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("All");
  const [selectedAthletes, setSelectedAthletes] = useState<string[]>([]);

  const filteredAthletes = mockAthletes.filter(athlete => {
    const matchesSearch = athlete.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         athlete.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGroup = selectedGroup === "All" || athlete.group === selectedGroup;
    return matchesSearch && matchesGroup;
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
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link href="/coach" className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-6 transition-colors">
          <ChevronLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-black flex items-center gap-3">
              <Users className="h-10 w-10 text-orange-500" />
              ROSTER
            </h1>
            <p className="text-white/60 mt-1">
              {mockAthletes.length} athletes • {groups.length - 1} groups
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="bg-white/5 border-white/10 text-white hover:bg-white/10">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" className="bg-white/5 border-white/10 text-white hover:bg-white/10">
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>
            <Link href="/coach/roster/invite">
              <Button className="btn-track text-white font-bold">
                <UserPlus className="h-4 w-4 mr-2" />
                Invite Athletes
              </Button>
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search athletes..."
              className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/30"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {groups.map((group) => (
              <Button
                key={group}
                variant="outline"
                size="sm"
                onClick={() => setSelectedGroup(group)}
                className={`whitespace-nowrap ${
                  selectedGroup === group
                    ? 'bg-orange-500 border-orange-500 text-white'
                    : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                }`}
              >
                {group}
              </Button>
            ))}
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedAthletes.length > 0 && (
          <div className="flex items-center gap-4 p-4 mb-6 rounded-xl bg-orange-500/10 border border-orange-500/30">
            <span className="text-sm text-white">
              <span className="font-bold">{selectedAthletes.length}</span> athletes selected
            </span>
            <div className="flex-1" />
            <Button size="sm" variant="outline" className="bg-white/5 border-white/10 text-white hover:bg-white/10">
              <MessageSquare className="h-4 w-4 mr-2" />
              Message
            </Button>
            <Button size="sm" variant="outline" className="bg-white/5 border-white/10 text-white hover:bg-white/10">
              <Target className="h-4 w-4 mr-2" />
              Assign Workout
            </Button>
            <Button size="sm" variant="outline" className="bg-red-500/20 border-red-500/30 text-red-400 hover:bg-red-500/30">
              <Trash2 className="h-4 w-4 mr-2" />
              Remove
            </Button>
          </div>
        )}

        {/* Athletes Table */}
        <Card className="bg-white/5 border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="p-4 text-left">
                    <input
                      type="checkbox"
                      checked={selectedAthletes.length === filteredAthletes.length && filteredAthletes.length > 0}
                      onChange={selectAll}
                      className="rounded border-white/30 bg-white/5"
                    />
                  </th>
                  <th className="p-4 text-left text-sm font-bold text-white/60">Athlete</th>
                  <th className="p-4 text-left text-sm font-bold text-white/60">Events</th>
                  <th className="p-4 text-left text-sm font-bold text-white/60">Tier</th>
                  <th className="p-4 text-left text-sm font-bold text-white/60">Group</th>
                  <th className="p-4 text-left text-sm font-bold text-white/60">Stats</th>
                  <th className="p-4 text-left text-sm font-bold text-white/60">Status</th>
                  <th className="p-4 text-left text-sm font-bold text-white/60"></th>
                </tr>
              </thead>
              <tbody>
                {filteredAthletes.map((athlete) => (
                  <tr key={athlete.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      <input
                        type="checkbox"
                        checked={selectedAthletes.includes(athlete.id)}
                        onChange={() => toggleSelectAthlete(athlete.id)}
                        className="rounded border-white/30 bg-white/5"
                      />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-sm font-black">
                          {athlete.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="font-bold text-white">{athlete.name}</p>
                          <p className="text-xs text-white/50">Grade {athlete.grade} • {athlete.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {athlete.events.map((event, i) => (
                          <span key={i} className="px-2 py-0.5 rounded-full bg-white/10 text-white/70 text-xs">
                            {event}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-4">
                      <TierBadge tier={athlete.tier} size="sm" />
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold">
                        {athlete.group}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-4 text-xs">
                        <div className="flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3 text-green-500" />
                          <span className="text-white/70">{athlete.stats.completionRate}%</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Flame className="h-3 w-3 text-orange-500" />
                          <span className="text-white/70">{athlete.stats.prsThisSeason} PRs</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Zap className="h-3 w-3 text-yellow-500" />
                          <span className="text-white/70">{athlete.stats.streak}d</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        athlete.status === 'active' ? 'bg-green-500/20 text-green-400' :
                        athlete.status === 'injured' ? 'bg-red-500/20 text-red-400' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {athlete.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Link href={`/coach/athletes/${athlete.id}`}>
                          <Button size="icon" variant="ghost" className="text-white/50 hover:text-white h-8 w-8">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button size="icon" variant="ghost" className="text-white/50 hover:text-white h-8 w-8">
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="text-white/50 hover:text-white h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </main>
    </div>
  );
}
