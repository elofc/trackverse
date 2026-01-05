"use client";

import { useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Share2,
  Download,
  MoreVertical,
  Pencil,
  Eye,
  EyeOff,
  Users,
} from "lucide-react";
import { Navbar } from "@/components/trackverse/navbar";
import { VideoPlayer } from "@/components/video/video-player";
import { VideoComparison } from "@/components/video/video-comparison";
import { AnalysisResults } from "@/components/video/analysis-results";
import { CoachFeedback } from "@/components/video/coach-feedback";
import { Video, VideoAnalysis, VideoFeedback, Annotation } from "@/lib/video/types";

// Mock data
const mockVideo: Video = {
  id: "v1",
  userId: "u1",
  title: "100m Finals - Regional Championships",
  description: "My best race this season - broke 11 seconds!",
  url: "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  thumbnailUrl: "/thumbnails/race1.jpg",
  duration: 12.5,
  width: 1920,
  height: 1080,
  size: 45000000,
  status: "ready",
  eventType: "100m",
  analysis: {
    id: "a1",
    videoId: "v1",
    status: "complete",
    reactionTime: 0.142,
    totalTime: 10.85,
    splitTimes: [
      { distance: 30, time: 4.12, velocity: 7.28 },
      { distance: 60, time: 6.89, velocity: 8.71 },
      { distance: 100, time: 10.85, velocity: 9.22 },
    ],
    formMetrics: {
      strideLength: 2.15,
      strideFrequency: 4.8,
      groundContactTime: 98,
      flightTime: 112,
      trunkLean: 12,
      kneeAngle: 145,
      startScore: 85,
      drivePhaseScore: 78,
      topSpeedScore: 92,
      finishScore: 88,
      overallScore: 86,
    },
    insights: [
      {
        type: "positive",
        category: "start",
        title: "Excellent Reaction Time",
        description: "Your 0.142s reaction is in the elite range. This puts you ahead of most competitors right from the gun.",
        metric: "Reaction Time",
        value: 0.142,
        benchmark: 0.15,
        timestamp: 0,
      },
      {
        type: "warning",
        category: "drive",
        title: "Drive Phase Posture",
        description: "Slight forward lean detected during drive phase. Try to maintain a more upright posture after the first 20 meters.",
        timestamp: 2500,
      },
      {
        type: "positive",
        category: "top_speed",
        title: "Strong Top Speed Maintenance",
        description: "Excellent speed maintenance through 60-100m. Your top speed of 9.22 m/s is competitive at the state level.",
        timestamp: 7000,
      },
      {
        type: "improvement",
        category: "finish",
        title: "Finish Line Technique",
        description: "Consider working on your lean at the finish. A proper dip could save 0.02-0.05 seconds.",
        timestamp: 10500,
      },
    ],
    recommendations: [
      "Focus on maintaining upright posture during the drive phase (20-40m)",
      "Work on hip mobility exercises to increase stride length from 2.15m to 2.25m",
      "Practice block starts 3x per week to improve first 10m acceleration",
      "Add finish line lean drills to your training routine",
    ],
    comparisonScore: 78,
    createdAt: "2026-01-04T10:00:00Z",
    completedAt: "2026-01-04T10:02:00Z",
  },
  annotations: [],
  createdAt: "2026-01-04T10:00:00Z",
  updatedAt: "2026-01-04T10:02:00Z",
};

const mockFeedback: VideoFeedback[] = [
  {
    id: "f1",
    videoId: "v1",
    coachId: "c1",
    coachName: "Coach Williams",
    athleteId: "u1",
    message: "Great race! Your start was excellent. Let's work on that drive phase posture in practice this week.",
    timestamp: 2500,
    createdAt: "2026-01-04T11:00:00Z",
    readAt: "2026-01-04T11:30:00Z",
  },
  {
    id: "f2",
    videoId: "v1",
    coachId: "c1",
    coachName: "Coach Williams",
    athleteId: "u1",
    message: "Notice how your arms start to cross your body slightly at top speed. Keep them driving straight forward.",
    timestamp: 7500,
    createdAt: "2026-01-04T11:05:00Z",
  },
];

const eliteComparisonVideo = {
  src: "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
  label: "Elite Reference",
  athleteName: "Usain Bolt",
};

export default function VideoDetailPage() {
  const params = useParams();
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const [video] = useState<Video>(mockVideo);
  const [currentTime, setCurrentTime] = useState(0);
  const [showPoseOverlay, setShowPoseOverlay] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [feedback, setFeedback] = useState<VideoFeedback[]>(mockFeedback);
  const [activeTab, setActiveTab] = useState<"analysis" | "comparison" | "feedback">("analysis");

  const handleTimeUpdate = (time: number) => {
    setCurrentTime(time);
  };

  const handleSeekToTimestamp = (timestamp: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = timestamp / 1000;
    }
  };

  const handleSendFeedback = (message: string, timestamp?: number) => {
    const newFeedback: VideoFeedback = {
      id: `f${Date.now()}`,
      videoId: video.id,
      coachId: "c1",
      coachName: "Coach Williams",
      athleteId: video.userId,
      message,
      timestamp,
      createdAt: new Date().toISOString(),
    };
    setFeedback([...feedback, newFeedback]);
  };

  const handleAnnotationAdd = (annotation: Omit<Annotation, "id" | "createdAt">) => {
    const newAnnotation: Annotation = {
      ...annotation,
      id: `ann_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setAnnotations([...annotations, newAnnotation]);
  };

  const handleAnnotationDelete = (id: string) => {
    setAnnotations(annotations.filter((a) => a.id !== id));
  };

  return (
    <div className="min-h-screen bg-zinc-950">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-white">{video.title}</h1>
              <p className="text-zinc-500 text-sm">{video.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors">
              <Share2 className="w-5 h-5 text-white" />
            </button>
            <button className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors">
              <Download className="w-5 h-5 text-white" />
            </button>
            <button className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors">
              <MoreVertical className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Video Player Section */}
          <div className="lg:col-span-2 space-y-4">
            {/* Main Video or Comparison */}
            {showComparison ? (
              <VideoComparison
                leftVideo={{
                  src: video.url,
                  label: "Your Race",
                  athleteName: "You",
                }}
                rightVideo={eliteComparisonVideo}
                onTimeSync={setCurrentTime}
              />
            ) : (
              <div className="relative">
                <VideoPlayer
                  src={video.url}
                  poster={video.thumbnailUrl}
                  onTimeUpdate={handleTimeUpdate}
                  showPoseOverlay={showPoseOverlay}
                />
              </div>
            )}

            {/* Video Controls */}
            <div className="flex items-center justify-between bg-zinc-900 border border-zinc-800 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowPoseOverlay(!showPoseOverlay)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                    showPoseOverlay
                      ? "bg-orange-500 text-white"
                      : "bg-zinc-800 text-zinc-400 hover:text-white"
                  }`}
                >
                  {showPoseOverlay ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  Pose Overlay
                </button>
                <button
                  onClick={() => setShowComparison(!showComparison)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                    showComparison
                      ? "bg-orange-500 text-white"
                      : "bg-zinc-800 text-zinc-400 hover:text-white"
                  }`}
                >
                  <Users className="w-4 h-4" />
                  Compare to Elite
                </button>
              </div>
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm bg-zinc-800 text-zinc-400 hover:text-white transition-colors">
                  <Pencil className="w-4 h-4" />
                  Annotate
                </button>
              </div>
            </div>

            {/* Tabs for Mobile */}
            <div className="lg:hidden flex gap-1 bg-zinc-900 border border-zinc-800 rounded-lg p-1">
              {[
                { id: "analysis", label: "Analysis" },
                { id: "comparison", label: "Compare" },
                { id: "feedback", label: "Feedback" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? "bg-orange-500 text-white"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Analysis Results */}
            {video.analysis && (
              <div className={`${activeTab !== "analysis" ? "hidden lg:block" : ""}`}>
                <AnalysisResults
                  analysis={video.analysis}
                  onSeekToTimestamp={handleSeekToTimestamp}
                />
              </div>
            )}

            {/* Coach Feedback */}
            <div className={`${activeTab !== "feedback" ? "hidden lg:block" : ""}`}>
              <CoachFeedback
                videoId={video.id}
                athleteId={video.userId}
                athleteName="Elias"
                feedback={feedback}
                currentTime={currentTime}
                isCoach={true}
                onSendFeedback={handleSendFeedback}
                onSeekToTimestamp={handleSeekToTimestamp}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
