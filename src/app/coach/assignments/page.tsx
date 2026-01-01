"use client";

import { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/trackverse/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Calendar,
  Clock,
  Users,
  CheckCircle2,
  AlertTriangle,
  Filter,
  ClipboardList,
  Dumbbell,
  Timer,
  Target,
  Flame,
  Copy,
  Trash2,
  Edit,
  Eye,
  BarChart3,
} from "lucide-react";

interface Assignment {
  id: string;
  title: string;
  type: "workout" | "drill" | "recovery" | "video" | "assessment";
  description: string;
  dueDate: Date;
  assignedTo: "all" | "group" | "individual";
  targetGroup?: string;
  targetAthletes?: string[];
  status: "active" | "completed" | "draft";
  submissions: {
    total: number;
    completed: number;
    late: number;
  };
  createdAt: Date;
}

const mockAssignments: Assignment[] = [
  {
    id: "a1",
    title: "6x200m Sprint Intervals",
    type: "workout",
    description: "Complete 6 reps of 200m at 90% effort with 3min rest between reps. Log your splits.",
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    assignedTo: "group",
    targetGroup: "Sprints",
    status: "active",
    submissions: { total: 12, completed: 8, late: 1 },
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: "a2",
    title: "Tempo Run - 20min",
    type: "workout",
    description: "20 minute tempo run at 75% effort. Focus on maintaining consistent pace.",
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    assignedTo: "group",
    targetGroup: "Mid-Distance",
    status: "active",
    submissions: { total: 8, completed: 5, late: 0 },
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
  {
    id: "a3",
    title: "Plyometric Circuit",
    type: "drill",
    description: "Complete the plyometric circuit: Box jumps (3x10), Bounds (3x20m), Hurdle hops (3x8)",
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    assignedTo: "all",
    status: "active",
    submissions: { total: 42, completed: 28, late: 2 },
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
  {
    id: "a4",
    title: "Recovery & Stretching",
    type: "recovery",
    description: "30 minute recovery session: foam rolling, static stretching, and mobility work.",
    dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    assignedTo: "all",
    status: "completed",
    submissions: { total: 42, completed: 40, late: 5 },
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
  {
    id: "a5",
    title: "Race Strategy Video Review",
    type: "video",
    description: "Watch the race strategy video and submit a 100-word reflection on key takeaways.",
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    assignedTo: "group",
    targetGroup: "Sprints",
    status: "active",
    submissions: { total: 12, completed: 3, late: 0 },
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
];

const getTypeStyle = (type: string) => {
  switch (type) {
    case "workout": return { bg: "bg-orange-500/20", border: "border-orange-500/30", text: "text-orange-400", icon: "💪" };
    case "drill": return { bg: "bg-blue-500/20", border: "border-blue-500/30", text: "text-blue-400", icon: "🎯" };
    case "recovery": return { bg: "bg-green-500/20", border: "border-green-500/30", text: "text-green-400", icon: "🧘" };
    case "video": return { bg: "bg-purple-500/20", border: "border-purple-500/30", text: "text-purple-400", icon: "📹" };
    case "assessment": return { bg: "bg-yellow-500/20", border: "border-yellow-500/30", text: "text-yellow-400", icon: "📊" };
    default: return { bg: "bg-gray-500/20", border: "border-gray-500/30", text: "text-gray-400", icon: "📋" };
  }
};

const formatDueDate = (date: Date) => {
  const now = new Date();
  const diff = date.getTime() - now.getTime();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  
  if (days < 0) return { text: `${Math.abs(days)}d overdue`, color: "text-red-400" };
  if (days === 0) return { text: "Due today", color: "text-yellow-400" };
  if (days === 1) return { text: "Due tomorrow", color: "text-yellow-400" };
  return { text: `Due in ${days} days`, color: "text-white/50" };
};

export default function AssignmentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("active");

  const activeAssignments = mockAssignments.filter(a => a.status === "active");
  const completedAssignments = mockAssignments.filter(a => a.status === "completed");
  const draftAssignments = mockAssignments.filter(a => a.status === "draft");

  const getFilteredAssignments = () => {
    let assignments = selectedTab === "active" ? activeAssignments :
                      selectedTab === "completed" ? completedAssignments :
                      draftAssignments;
    
    if (searchQuery) {
      assignments = assignments.filter(a => 
        a.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return assignments;
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
              <ClipboardList className="h-10 w-10 text-orange-500" />
              ASSIGNMENTS
            </h1>
            <p className="text-white/60 mt-1">
              {activeAssignments.length} active • {completedAssignments.length} completed
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/coach/assignments/templates">
              <Button variant="outline" className="bg-white/5 border-white/10 text-white hover:bg-white/10">
                <Copy className="h-4 w-4 mr-2" />
                Templates
              </Button>
            </Link>
            <Link href="/coach/assignments/create">
              <Button className="btn-track text-white font-bold">
                <Plus className="h-4 w-4 mr-2" />
                Create Assignment
              </Button>
            </Link>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search assignments..."
              className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/30"
            />
          </div>
          <Button variant="outline" className="bg-white/5 border-white/10 text-white hover:bg-white/10">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="active" className="w-full" onValueChange={setSelectedTab}>
          <TabsList className="bg-white/5 border border-white/10 mb-6">
            <TabsTrigger value="active" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              Active ({activeAssignments.length})
            </TabsTrigger>
            <TabsTrigger value="completed" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              Completed ({completedAssignments.length})
            </TabsTrigger>
            <TabsTrigger value="drafts" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              Drafts ({draftAssignments.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            {getFilteredAssignments().map((assignment) => {
              const style = getTypeStyle(assignment.type);
              const due = formatDueDate(assignment.dueDate);
              const completionRate = Math.round((assignment.submissions.completed / assignment.submissions.total) * 100);
              
              return (
                <Card key={assignment.id} className="bg-white/5 border-white/10 hover:border-orange-500/30 transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      {/* Type Icon */}
                      <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl ${style.bg} ${style.border} border flex-shrink-0`}>
                        {style.icon}
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-bold text-white text-lg">{assignment.title}</h3>
                              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${style.bg} ${style.border} ${style.text} border`}>
                                {assignment.type}
                              </span>
                            </div>
                            <p className="text-white/60 text-sm line-clamp-2">{assignment.description}</p>
                          </div>
                          <Button variant="ghost" size="icon" className="text-white/50 hover:text-white flex-shrink-0">
                            <MoreHorizontal className="h-5 w-5" />
                          </Button>
                        </div>
                        
                        {/* Meta */}
                        <div className="flex flex-wrap items-center gap-4 mt-4">
                          <div className="flex items-center gap-1 text-sm">
                            <Clock className="h-4 w-4 text-white/40" />
                            <span className={due.color}>{due.text}</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm">
                            <Users className="h-4 w-4 text-white/40" />
                            <span className="text-white/60">
                              {assignment.assignedTo === "all" ? "All Athletes" : 
                               assignment.assignedTo === "group" ? assignment.targetGroup : 
                               `${assignment.targetAthletes?.length} athletes`}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1 text-sm">
                              <CheckCircle2 className="h-4 w-4 text-green-500" />
                              <span className="text-white/60">{assignment.submissions.completed}/{assignment.submissions.total}</span>
                            </div>
                            {assignment.submissions.late > 0 && (
                              <div className="flex items-center gap-1 text-sm">
                                <AlertTriangle className="h-4 w-4 text-red-500" />
                                <span className="text-red-400">{assignment.submissions.late} late</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mt-4">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-white/50">Completion</span>
                            <span className="text-white/70 font-bold">{completionRate}%</span>
                          </div>
                          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-orange-500 to-green-500 rounded-full transition-all"
                              style={{ width: `${completionRate}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/10">
                      <Link href={`/coach/assignments/${assignment.id}`} className="flex-1">
                        <Button variant="outline" className="w-full bg-white/5 border-white/10 text-white hover:bg-white/10">
                          <Eye className="h-4 w-4 mr-2" />
                          View Submissions
                        </Button>
                      </Link>
                      <Link href={`/coach/assignments/${assignment.id}/edit`}>
                        <Button variant="outline" size="icon" className="bg-white/5 border-white/10 text-white hover:bg-white/10">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button variant="outline" size="icon" className="bg-white/5 border-white/10 text-white hover:bg-white/10">
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {getFilteredAssignments().length === 0 ? (
              <Card className="p-8 text-center bg-white/5 border-white/10">
                <CheckCircle2 className="h-12 w-12 mx-auto text-green-500/50 mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">No Completed Assignments</h3>
                <p className="text-white/50">Completed assignments will appear here</p>
              </Card>
            ) : (
              getFilteredAssignments().map((assignment) => {
                const style = getTypeStyle(assignment.type);
                return (
                  <Card key={assignment.id} className="bg-white/5 border-white/10 opacity-75">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl ${style.bg} ${style.border} border`}>
                          {style.icon}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-white">{assignment.title}</h3>
                          <p className="text-sm text-white/50">
                            {assignment.submissions.completed}/{assignment.submissions.total} completed • {assignment.submissions.late} late
                          </p>
                        </div>
                        <Link href={`/coach/assignments/${assignment.id}`}>
                          <Button variant="outline" size="sm" className="bg-white/5 border-white/10 text-white hover:bg-white/10">
                            <BarChart3 className="h-4 w-4 mr-2" />
                            Results
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </TabsContent>

          <TabsContent value="drafts" className="space-y-4">
            <Card className="p-8 text-center bg-white/5 border-white/10">
              <ClipboardList className="h-12 w-12 mx-auto text-orange-500/50 mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">No Drafts</h3>
              <p className="text-white/50 mb-4">Save assignments as drafts to publish later</p>
              <Link href="/coach/assignments/create">
                <Button className="btn-track text-white font-bold">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Assignment
                </Button>
              </Link>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
