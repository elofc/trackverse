"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Film,
  Upload,
  Zap,
  Users,
  TrendingUp,
  Play,
  Clock,
  Eye,
} from "lucide-react";
import { Navbar } from "@/components/trackverse/navbar";
import { VideoUpload } from "@/components/video/video-upload";
import { VideoAnalysis, Video } from "@/lib/video/types";

// Mock video data
const mockVideos: Video[] = [
  {
    id: "v1",
    userId: "u1",
    title: "100m Finals - Regional Championships",
    description: "My best race this season",
    url: "/videos/race1.mp4",
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
          description: "Your 0.142s reaction is in the elite range",
          metric: "Reaction Time",
          value: 0.142,
          benchmark: 0.15,
        },
        {
          type: "warning",
          category: "drive",
          title: "Drive Phase Could Improve",
          description: "Slight forward lean detected in drive phase",
          timestamp: 1500,
        },
        {
          type: "positive",
          category: "top_speed",
          title: "Strong Top Speed",
          description: "Maintained 9.22 m/s through the finish",
        },
      ],
      recommendations: [
        "Focus on maintaining upright posture during drive phase",
        "Work on hip mobility to increase stride length",
        "Practice block starts to improve first 10m acceleration",
      ],
      comparisonScore: 78,
      createdAt: "2026-01-04T10:00:00Z",
      completedAt: "2026-01-04T10:02:00Z",
    },
    createdAt: "2026-01-04T10:00:00Z",
    updatedAt: "2026-01-04T10:02:00Z",
  },
  {
    id: "v2",
    userId: "u1",
    title: "200m Heat 3",
    url: "/videos/race2.mp4",
    duration: 22.3,
    width: 1920,
    height: 1080,
    size: 78000000,
    status: "ready",
    eventType: "200m",
    createdAt: "2026-01-02T14:00:00Z",
    updatedAt: "2026-01-02T14:00:00Z",
  },
  {
    id: "v3",
    userId: "u1",
    title: "Practice - Block Starts",
    url: "/videos/practice1.mp4",
    duration: 45.0,
    width: 1920,
    height: 1080,
    size: 120000000,
    status: "analyzing",
    eventType: "100m",
    createdAt: "2026-01-04T16:00:00Z",
    updatedAt: "2026-01-04T16:00:00Z",
  },
];

export default function VideoPage() {
  const [videos, setVideos] = useState<Video[]>(mockVideos);
  const [showUpload, setShowUpload] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  const handleUploadComplete = (videoUrl: string, videoId: string) => {
    const newVideo: Video = {
      id: videoId,
      userId: "u1",
      title: "New Upload",
      url: videoUrl,
      duration: 0,
      width: 1920,
      height: 1080,
      size: 0,
      status: "processing",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setVideos([newVideo, ...videos]);
    setShowUpload(false);
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getStatusBadge = (status: Video["status"]) => {
    switch (status) {
      case "ready":
        return <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">Ready</span>;
      case "analyzing":
        return <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded-full animate-pulse">Analyzing</span>;
      case "processing":
        return <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full animate-pulse">Processing</span>;
      case "uploading":
        return <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full">Uploading</span>;
      case "error":
        return <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full">Error</span>;
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Film className="w-8 h-8 text-orange-500" />
              <h1 className="text-3xl font-black text-white">Video Analysis</h1>
            </div>
            <p className="text-zinc-400">AI-powered form analysis to improve your technique</p>
          </div>
          <button
            onClick={() => setShowUpload(!showUpload)}
            className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors"
          >
            <Upload className="w-4 h-4" />
            Upload Video
          </button>
        </div>

        {/* Upload Section */}
        {showUpload && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <VideoUpload
              onUploadComplete={handleUploadComplete}
              onUploadError={(error) => console.error(error)}
            />
          </motion.div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Videos Analyzed", value: "12", icon: Film, color: "orange" },
            { label: "Total Watch Time", value: "2.5h", icon: Clock, color: "blue" },
            { label: "Avg. Form Score", value: "84", icon: TrendingUp, color: "green" },
            { label: "Coach Reviews", value: "8", icon: Users, color: "purple" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <stat.icon className={`w-4 h-4 text-${stat.color}-500`} style={{ color: stat.color === "orange" ? "#f97316" : stat.color === "blue" ? "#3b82f6" : stat.color === "green" ? "#22c55e" : "#a855f7" }} />
                <span className="text-zinc-500 text-sm">{stat.label}</span>
              </div>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Video Grid */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-white mb-4">Your Videos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {videos.map((video) => (
              <motion.div
                key={video.id}
                whileHover={{ scale: 1.02 }}
                className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden cursor-pointer group"
                onClick={() => setSelectedVideo(video)}
              >
                {/* Thumbnail */}
                <div className="relative aspect-video bg-zinc-800">
                  {video.thumbnailUrl ? (
                    <img
                      src={video.thumbnailUrl}
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Film className="w-12 h-12 text-zinc-700" />
                    </div>
                  )}
                  
                  {/* Play Overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-orange-500 flex items-center justify-center">
                      <Play className="w-6 h-6 text-white ml-1" fill="white" />
                    </div>
                  </div>

                  {/* Duration */}
                  <div className="absolute bottom-2 right-2 bg-black/70 px-2 py-0.5 rounded text-xs text-white font-mono">
                    {formatDuration(video.duration)}
                  </div>

                  {/* Analysis Badge */}
                  {video.analysis && (
                    <div className="absolute top-2 left-2 bg-orange-500/90 px-2 py-0.5 rounded text-xs text-white flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      Analyzed
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-medium text-white line-clamp-1">{video.title}</h3>
                    {getStatusBadge(video.status)}
                  </div>
                  
                  <div className="flex items-center gap-3 text-xs text-zinc-500">
                    {video.eventType && (
                      <span className="bg-zinc-800 px-2 py-0.5 rounded">{video.eventType}</span>
                    )}
                    <span>{new Date(video.createdAt).toLocaleDateString()}</span>
                  </div>

                  {/* Analysis Preview */}
                  {video.analysis?.formMetrics?.overallScore && (
                    <div className="mt-3 pt-3 border-t border-zinc-800 flex items-center justify-between">
                      <span className="text-zinc-500 text-sm">Form Score</span>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-orange-500 rounded-full"
                            style={{ width: `${video.analysis.formMetrics.overallScore}%` }}
                          />
                        </div>
                        <span className="text-orange-500 font-bold text-sm">
                          {video.analysis.formMetrics.overallScore}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Empty State */}
        {videos.length === 0 && (
          <div className="text-center py-16">
            <Film className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No videos yet</h3>
            <p className="text-zinc-500 mb-6">Upload your first race video to get AI-powered analysis</p>
            <button
              onClick={() => setShowUpload(true)}
              className="px-6 py-3 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors"
            >
              Upload Your First Video
            </button>
          </div>
        )}

        {/* Features Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: Zap,
              title: "AI Form Analysis",
              description: "Get instant feedback on your technique with pose detection and biomechanics analysis",
            },
            {
              icon: Users,
              title: "Elite Comparison",
              description: "Compare your form side-by-side with elite athletes to identify areas for improvement",
            },
            {
              icon: TrendingUp,
              title: "Track Progress",
              description: "Monitor your form improvements over time with detailed metrics and trends",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6"
            >
              <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-orange-500" />
              </div>
              <h3 className="font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-zinc-500 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
