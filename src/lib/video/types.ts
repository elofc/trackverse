// Video Analysis Types

export type VideoStatus = "uploading" | "processing" | "analyzing" | "ready" | "error";

export type Video = {
  id: string;
  userId: string;
  title: string;
  description?: string;
  url: string;
  thumbnailUrl?: string;
  duration: number; // seconds
  width: number;
  height: number;
  size: number; // bytes
  status: VideoStatus;
  eventType?: string; // "100m", "200m", "long_jump", etc.
  meetId?: string;
  analysis?: VideoAnalysis;
  annotations?: Annotation[];
  createdAt: string;
  updatedAt: string;
};

export type VideoAnalysis = {
  id: string;
  videoId: string;
  status: "pending" | "processing" | "complete" | "failed";
  
  // Timing Analysis
  reactionTime?: number; // seconds
  splitTimes?: SplitTime[];
  totalTime?: number;
  
  // Form Analysis
  poseData?: PoseFrame[];
  formMetrics?: FormMetrics;
  
  // AI Insights
  insights?: AnalysisInsight[];
  recommendations?: string[];
  
  // Comparison
  comparisonAthleteId?: string;
  comparisonScore?: number; // 0-100
  
  createdAt: string;
  completedAt?: string;
};

export type SplitTime = {
  distance: number; // meters
  time: number; // seconds
  velocity: number; // m/s
};

export type PoseFrame = {
  timestamp: number; // ms
  keypoints: Keypoint[];
  confidence: number;
};

export type Keypoint = {
  name: string; // "nose", "left_shoulder", "right_hip", etc.
  x: number;
  y: number;
  confidence: number;
};

export type FormMetrics = {
  // Sprint-specific
  strideLength?: number; // meters
  strideFrequency?: number; // steps/second
  groundContactTime?: number; // ms
  flightTime?: number; // ms
  
  // Body angles
  trunkLean?: number; // degrees
  kneeAngle?: number; // degrees at max flex
  armAngle?: number; // degrees
  
  // Overall scores (0-100)
  startScore?: number;
  drivePhaseScore?: number;
  topSpeedScore?: number;
  finishScore?: number;
  overallScore?: number;
};

export type AnalysisInsight = {
  type: "positive" | "warning" | "improvement";
  category: "start" | "drive" | "top_speed" | "finish" | "form" | "general";
  title: string;
  description: string;
  timestamp?: number; // ms in video
  metric?: string;
  value?: number;
  benchmark?: number;
};

export type Annotation = {
  id: string;
  videoId: string;
  userId: string;
  type: "drawing" | "text" | "arrow" | "circle" | "rectangle";
  timestamp: number; // ms in video
  duration?: number; // how long to show (ms)
  data: AnnotationData;
  color: string;
  createdAt: string;
};

export type AnnotationData = 
  | { type: "drawing"; points: Array<{ x: number; y: number }> }
  | { type: "text"; x: number; y: number; text: string; fontSize: number }
  | { type: "arrow"; startX: number; startY: number; endX: number; endY: number }
  | { type: "circle"; centerX: number; centerY: number; radius: number }
  | { type: "rectangle"; x: number; y: number; width: number; height: number };

export type VideoFeedback = {
  id: string;
  videoId: string;
  coachId: string;
  coachName: string;
  athleteId: string;
  message: string;
  annotations?: Annotation[];
  timestamp?: number; // specific moment in video
  createdAt: string;
  readAt?: string;
};

// Upload types
export type UploadProgress = {
  loaded: number;
  total: number;
  percentage: number;
  status: "idle" | "uploading" | "processing" | "complete" | "error";
  error?: string;
};

// Pose detection keypoint names (MoveNet/BlazePose compatible)
export const POSE_KEYPOINTS = [
  "nose",
  "left_eye",
  "right_eye",
  "left_ear",
  "right_ear",
  "left_shoulder",
  "right_shoulder",
  "left_elbow",
  "right_elbow",
  "left_wrist",
  "right_wrist",
  "left_hip",
  "right_hip",
  "left_knee",
  "right_knee",
  "left_ankle",
  "right_ankle",
] as const;

export type PoseKeypointName = typeof POSE_KEYPOINTS[number];

// Skeleton connections for drawing
export const POSE_CONNECTIONS: Array<[PoseKeypointName, PoseKeypointName]> = [
  ["left_shoulder", "right_shoulder"],
  ["left_shoulder", "left_elbow"],
  ["left_elbow", "left_wrist"],
  ["right_shoulder", "right_elbow"],
  ["right_elbow", "right_wrist"],
  ["left_shoulder", "left_hip"],
  ["right_shoulder", "right_hip"],
  ["left_hip", "right_hip"],
  ["left_hip", "left_knee"],
  ["left_knee", "left_ankle"],
  ["right_hip", "right_knee"],
  ["right_knee", "right_ankle"],
];
