"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { PoseFrame, Keypoint, POSE_CONNECTIONS, POSE_KEYPOINTS } from "@/lib/video/types";

// Note: In production, you would use @tensorflow-models/pose-detection
// This is a mock implementation for demonstration

type PoseDetectorProps = {
  videoRef: React.RefObject<HTMLVideoElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  isActive: boolean;
  onPoseDetected?: (pose: PoseFrame) => void;
  showSkeleton?: boolean;
  showKeypoints?: boolean;
  skeletonColor?: string;
  keypointColor?: string;
};

export function usePoseDetector({
  videoRef,
  canvasRef,
  isActive,
  onPoseDetected,
  showSkeleton = true,
  showKeypoints = true,
  skeletonColor = "#f97316",
  keypointColor = "#22c55e",
}: PoseDetectorProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const animationFrameRef = useRef<number>();
  const detectorRef = useRef<any>(null);

  // Initialize pose detector (mock)
  const initDetector = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // In production, initialize TensorFlow.js pose detection here:
      // const detector = await poseDetection.createDetector(
      //   poseDetection.SupportedModels.MoveNet,
      //   { modelType: poseDetection.movenet.modelType.SINGLEPOSE_THUNDER }
      // );
      
      // Simulate loading time
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      detectorRef.current = { ready: true };
      setIsReady(true);
    } catch (err) {
      setError("Failed to load pose detection model");
      console.error("Pose detection init error:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Generate mock pose data for demonstration
  const generateMockPose = useCallback((video: HTMLVideoElement): PoseFrame => {
    const width = video.videoWidth;
    const height = video.videoHeight;
    
    // Generate realistic-looking keypoints for a running pose
    const baseY = height * 0.3;
    const centerX = width * 0.5;
    
    const keypoints: Keypoint[] = POSE_KEYPOINTS.map((name, i) => {
      let x = centerX;
      let y = baseY;
      
      // Position keypoints roughly like a running figure
      switch (name) {
        case "nose": x = centerX; y = baseY; break;
        case "left_eye": x = centerX - 15; y = baseY - 10; break;
        case "right_eye": x = centerX + 15; y = baseY - 10; break;
        case "left_ear": x = centerX - 25; y = baseY - 5; break;
        case "right_ear": x = centerX + 25; y = baseY - 5; break;
        case "left_shoulder": x = centerX - 40; y = baseY + 50; break;
        case "right_shoulder": x = centerX + 40; y = baseY + 50; break;
        case "left_elbow": x = centerX - 60; y = baseY + 90; break;
        case "right_elbow": x = centerX + 70; y = baseY + 70; break;
        case "left_wrist": x = centerX - 50; y = baseY + 130; break;
        case "right_wrist": x = centerX + 90; y = baseY + 50; break;
        case "left_hip": x = centerX - 25; y = baseY + 150; break;
        case "right_hip": x = centerX + 25; y = baseY + 150; break;
        case "left_knee": x = centerX - 40; y = baseY + 250; break;
        case "right_knee": x = centerX + 60; y = baseY + 220; break;
        case "left_ankle": x = centerX - 30; y = baseY + 350; break;
        case "right_ankle": x = centerX + 80; y = baseY + 320; break;
      }
      
      // Add some animation based on video time
      const time = video.currentTime;
      const phase = Math.sin(time * 10) * 20;
      
      if (name.includes("knee") || name.includes("ankle")) {
        y += phase * (name.includes("left") ? 1 : -1);
      }
      if (name.includes("elbow") || name.includes("wrist")) {
        x += phase * (name.includes("left") ? -0.5 : 0.5);
      }
      
      return {
        name,
        x,
        y,
        confidence: 0.85 + Math.random() * 0.15,
      };
    });

    return {
      timestamp: video.currentTime * 1000,
      keypoints,
      confidence: 0.9,
    };
  }, []);

  // Draw pose on canvas
  const drawPose = useCallback((pose: PoseFrame, ctx: CanvasRenderingContext2D) => {
    const { keypoints } = pose;
    
    // Create keypoint lookup
    const keypointMap = new Map(keypoints.map(kp => [kp.name, kp]));

    // Draw skeleton connections
    if (showSkeleton) {
      ctx.strokeStyle = skeletonColor;
      ctx.lineWidth = 3;
      ctx.lineCap = "round";

      POSE_CONNECTIONS.forEach(([start, end]) => {
        const startKp = keypointMap.get(start);
        const endKp = keypointMap.get(end);
        
        if (startKp && endKp && startKp.confidence > 0.5 && endKp.confidence > 0.5) {
          ctx.beginPath();
          ctx.moveTo(startKp.x, startKp.y);
          ctx.lineTo(endKp.x, endKp.y);
          ctx.stroke();
        }
      });
    }

    // Draw keypoints
    if (showKeypoints) {
      keypoints.forEach(kp => {
        if (kp.confidence > 0.5) {
          ctx.fillStyle = keypointColor;
          ctx.beginPath();
          ctx.arc(kp.x, kp.y, 5, 0, 2 * Math.PI);
          ctx.fill();
          
          // Draw confidence ring
          ctx.strokeStyle = keypointColor;
          ctx.lineWidth = 2;
          ctx.globalAlpha = kp.confidence;
          ctx.beginPath();
          ctx.arc(kp.x, kp.y, 8, 0, 2 * Math.PI);
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      });
    }
  }, [showSkeleton, showKeypoints, skeletonColor, keypointColor]);

  // Detection loop
  const detectPose = useCallback(async () => {
    if (!isActive || !videoRef.current || !canvasRef.current || !detectorRef.current) {
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (!ctx || video.paused || video.ended) {
      animationFrameRef.current = requestAnimationFrame(detectPose);
      return;
    }

    // Match canvas size to video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // In production, detect pose from video frame:
    // const poses = await detectorRef.current.estimatePoses(video);
    
    // For demo, generate mock pose
    const pose = generateMockPose(video);
    
    // Draw pose
    drawPose(pose, ctx);
    
    // Callback
    onPoseDetected?.(pose);

    // Continue loop
    animationFrameRef.current = requestAnimationFrame(detectPose);
  }, [isActive, videoRef, canvasRef, generateMockPose, drawPose, onPoseDetected]);

  // Start/stop detection
  useEffect(() => {
    if (isActive && isReady) {
      detectPose();
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isActive, isReady, detectPose]);

  // Initialize on mount
  useEffect(() => {
    initDetector();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [initDetector]);

  return {
    isLoading,
    isReady,
    error,
    reinitialize: initDetector,
  };
}

// Standalone component for pose overlay
type PoseOverlayProps = {
  videoRef: React.RefObject<HTMLVideoElement>;
  isActive: boolean;
  onPoseDetected?: (pose: PoseFrame) => void;
};

export function PoseOverlay({ videoRef, isActive, onPoseDetected }: PoseOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const { isLoading, isReady, error } = usePoseDetector({
    videoRef,
    canvasRef,
    isActive,
    onPoseDetected,
  });

  return (
    <>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ objectFit: "contain" }}
      />
      
      {isLoading && (
        <div className="absolute top-4 left-4 bg-black/70 px-3 py-1.5 rounded-full text-sm text-white">
          Loading pose detection...
        </div>
      )}
      
      {error && (
        <div className="absolute top-4 left-4 bg-red-500/70 px-3 py-1.5 rounded-full text-sm text-white">
          {error}
        </div>
      )}
      
      {isReady && isActive && (
        <div className="absolute top-4 left-4 bg-green-500/70 px-3 py-1.5 rounded-full text-sm text-white flex items-center gap-2">
          <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
          Pose Detection Active
        </div>
      )}
    </>
  );
}
