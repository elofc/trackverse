"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Play,
  Pause,
  RotateCcw,
  Layers,
  SplitSquareHorizontal,
  Blend,
} from "lucide-react";

type VideoComparisonProps = {
  leftVideo: {
    src: string;
    label: string;
    athleteName?: string;
  };
  rightVideo: {
    src: string;
    label: string;
    athleteName?: string;
  };
  onTimeSync?: (time: number) => void;
};

type ViewMode = "side-by-side" | "overlay" | "split";

export function VideoComparison({
  leftVideo,
  rightVideo,
  onTimeSync,
}: VideoComparisonProps) {
  const leftVideoRef = useRef<HTMLVideoElement>(null);
  const rightVideoRef = useRef<HTMLVideoElement>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [viewMode, setViewMode] = useState<ViewMode>("side-by-side");
  const [overlayOpacity, setOverlayOpacity] = useState(0.5);
  const [splitPosition, setSplitPosition] = useState(50);

  // Sync playback between videos
  const syncVideos = (time: number) => {
    if (leftVideoRef.current) leftVideoRef.current.currentTime = time;
    if (rightVideoRef.current) rightVideoRef.current.currentTime = time;
    setCurrentTime(time);
    onTimeSync?.(time);
  };

  const togglePlay = () => {
    if (isPlaying) {
      leftVideoRef.current?.pause();
      rightVideoRef.current?.pause();
    } else {
      leftVideoRef.current?.play();
      rightVideoRef.current?.play();
    }
    setIsPlaying(!isPlaying);
  };

  const restart = () => {
    syncVideos(0);
    if (isPlaying) {
      leftVideoRef.current?.play();
      rightVideoRef.current?.play();
    }
  };

  // Handle time updates
  useEffect(() => {
    const leftVideo = leftVideoRef.current;
    if (!leftVideo) return;

    const handleTimeUpdate = () => {
      setCurrentTime(leftVideo.currentTime);
      // Keep right video in sync
      if (rightVideoRef.current && Math.abs(rightVideoRef.current.currentTime - leftVideo.currentTime) > 0.1) {
        rightVideoRef.current.currentTime = leftVideo.currentTime;
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(leftVideo.duration);
    };

    const handleEnded = () => {
      setIsPlaying(false);
    };

    leftVideo.addEventListener("timeupdate", handleTimeUpdate);
    leftVideo.addEventListener("loadedmetadata", handleLoadedMetadata);
    leftVideo.addEventListener("ended", handleEnded);

    return () => {
      leftVideo.removeEventListener("timeupdate", handleTimeUpdate);
      leftVideo.removeEventListener("loadedmetadata", handleLoadedMetadata);
      leftVideo.removeEventListener("ended", handleEnded);
    };
  }, []);

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    const ms = Math.floor((time % 1) * 100);
    return `${minutes}:${seconds.toString().padStart(2, "0")}.${ms.toString().padStart(2, "0")}`;
  };

  return (
    <div className="bg-zinc-900 rounded-xl overflow-hidden">
      {/* View Mode Selector */}
      <div className="flex items-center justify-between p-4 border-b border-zinc-800">
        <h3 className="font-bold text-white">Form Comparison</h3>
        <div className="flex gap-1 bg-zinc-800 rounded-lg p-1">
          <button
            onClick={() => setViewMode("side-by-side")}
            className={`p-2 rounded-md transition-colors ${
              viewMode === "side-by-side" ? "bg-orange-500 text-white" : "text-zinc-400 hover:text-white"
            }`}
            title="Side by Side"
          >
            <SplitSquareHorizontal className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode("overlay")}
            className={`p-2 rounded-md transition-colors ${
              viewMode === "overlay" ? "bg-orange-500 text-white" : "text-zinc-400 hover:text-white"
            }`}
            title="Overlay"
          >
            <Layers className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode("split")}
            className={`p-2 rounded-md transition-colors ${
              viewMode === "split" ? "bg-orange-500 text-white" : "text-zinc-400 hover:text-white"
            }`}
            title="Split View"
          >
            <Blend className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Video Container */}
      <div className="relative aspect-video bg-black">
        {viewMode === "side-by-side" && (
          <div className="flex h-full">
            <div className="flex-1 relative">
              <video
                ref={leftVideoRef}
                src={leftVideo.src}
                className="w-full h-full object-contain"
                playsInline
                muted
              />
              <div className="absolute bottom-2 left-2 bg-black/70 px-2 py-1 rounded text-xs text-white">
                {leftVideo.label}
                {leftVideo.athleteName && (
                  <span className="text-orange-400 ml-1">{leftVideo.athleteName}</span>
                )}
              </div>
            </div>
            <div className="w-px bg-zinc-700" />
            <div className="flex-1 relative">
              <video
                ref={rightVideoRef}
                src={rightVideo.src}
                className="w-full h-full object-contain"
                playsInline
                muted
              />
              <div className="absolute bottom-2 left-2 bg-black/70 px-2 py-1 rounded text-xs text-white">
                {rightVideo.label}
                {rightVideo.athleteName && (
                  <span className="text-orange-400 ml-1">{rightVideo.athleteName}</span>
                )}
              </div>
            </div>
          </div>
        )}

        {viewMode === "overlay" && (
          <div className="relative h-full">
            <video
              ref={leftVideoRef}
              src={leftVideo.src}
              className="absolute inset-0 w-full h-full object-contain"
              playsInline
              muted
            />
            <video
              ref={rightVideoRef}
              src={rightVideo.src}
              className="absolute inset-0 w-full h-full object-contain"
              style={{ opacity: overlayOpacity }}
              playsInline
              muted
            />
            <div className="absolute bottom-2 left-2 flex gap-2">
              <div className="bg-black/70 px-2 py-1 rounded text-xs text-white">
                {leftVideo.label}
              </div>
              <div className="bg-orange-500/70 px-2 py-1 rounded text-xs text-white">
                {rightVideo.label} ({Math.round(overlayOpacity * 100)}%)
              </div>
            </div>
          </div>
        )}

        {viewMode === "split" && (
          <div className="relative h-full overflow-hidden">
            <video
              ref={leftVideoRef}
              src={leftVideo.src}
              className="absolute inset-0 w-full h-full object-contain"
              playsInline
              muted
            />
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${splitPosition}%` }}
            >
              <video
                ref={rightVideoRef}
                src={rightVideo.src}
                className="absolute inset-0 h-full object-contain"
                style={{ width: `${100 / (splitPosition / 100)}%` }}
                playsInline
                muted
              />
            </div>
            {/* Split line */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-orange-500 cursor-ew-resize"
              style={{ left: `${splitPosition}%` }}
              onMouseDown={(e) => {
                const handleMouseMove = (moveEvent: MouseEvent) => {
                  const container = e.currentTarget.parentElement;
                  if (!container) return;
                  const rect = container.getBoundingClientRect();
                  const newPosition = ((moveEvent.clientX - rect.left) / rect.width) * 100;
                  setSplitPosition(Math.max(10, Math.min(90, newPosition)));
                };
                const handleMouseUp = () => {
                  document.removeEventListener("mousemove", handleMouseMove);
                  document.removeEventListener("mouseup", handleMouseUp);
                };
                document.addEventListener("mousemove", handleMouseMove);
                document.addEventListener("mouseup", handleMouseUp);
              }}
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                <div className="w-1 h-4 bg-white rounded-full mx-0.5" />
                <div className="w-1 h-4 bg-white rounded-full mx-0.5" />
              </div>
            </div>
          </div>
        )}

        {/* Play button overlay */}
        {!isPlaying && (
          <button
            onClick={togglePlay}
            className="absolute inset-0 flex items-center justify-center bg-black/30"
          >
            <div className="w-16 h-16 rounded-full bg-orange-500/90 flex items-center justify-center hover:bg-orange-500 transition-colors">
              <Play className="w-8 h-8 text-white ml-1" fill="white" />
            </div>
          </button>
        )}
      </div>

      {/* Controls */}
      <div className="p-4 border-t border-zinc-800">
        {/* Progress bar */}
        <div
          className="h-2 bg-zinc-800 rounded-full cursor-pointer mb-4"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const percentage = (e.clientX - rect.left) / rect.width;
            syncVideos(percentage * duration);
          }}
        >
          <div
            className="h-full bg-orange-500 rounded-full"
            style={{ width: `${(currentTime / duration) * 100}%` }}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={togglePlay}
              className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors"
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 text-white" />
              ) : (
                <Play className="w-5 h-5 text-white" />
              )}
            </button>
            <button
              onClick={restart}
              className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors"
            >
              <RotateCcw className="w-5 h-5 text-white" />
            </button>
            <span className="text-white text-sm font-mono ml-2">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          {/* Overlay opacity slider */}
          {viewMode === "overlay" && (
            <div className="flex items-center gap-2">
              <span className="text-zinc-400 text-sm">Overlay:</span>
              <input
                type="range"
                min="0"
                max="100"
                value={overlayOpacity * 100}
                onChange={(e) => setOverlayOpacity(Number(e.target.value) / 100)}
                className="w-24 accent-orange-500"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
