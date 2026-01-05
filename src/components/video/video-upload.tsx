"use client";

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  X,
  Film,
  CheckCircle,
  AlertCircle,
  Loader2,
  FileVideo,
} from "lucide-react";
import { UploadProgress } from "@/lib/video/types";

type VideoUploadProps = {
  onUploadComplete: (videoUrl: string, videoId: string) => void;
  onUploadError?: (error: string) => void;
  maxSizeMB?: number;
  acceptedFormats?: string[];
};

export function VideoUpload({
  onUploadComplete,
  onUploadError,
  maxSizeMB = 500,
  acceptedFormats = ["video/mp4", "video/quicktime", "video/webm"],
}: VideoUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [progress, setProgress] = useState<UploadProgress>({
    loaded: 0,
    total: 0,
    percentage: 0,
    status: "idle",
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    if (!acceptedFormats.includes(file.type)) {
      return `Invalid format. Accepted: ${acceptedFormats.map(f => f.split('/')[1]).join(', ')}`;
    }
    if (file.size > maxSizeMB * 1024 * 1024) {
      return `File too large. Maximum size: ${maxSizeMB}MB`;
    }
    return null;
  };

  const handleFile = useCallback((file: File) => {
    const error = validateFile(file);
    if (error) {
      setProgress({ ...progress, status: "error", error });
      onUploadError?.(error);
      return;
    }

    setSelectedFile(file);
    
    // Create video preview
    const url = URL.createObjectURL(file);
    setPreview(url);
    
    setProgress({
      loaded: 0,
      total: file.size,
      percentage: 0,
      status: "idle",
    });
  }, [acceptedFormats, maxSizeMB, onUploadError, progress]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  }, [handleFile]);

  const uploadVideo = async () => {
    if (!selectedFile) return;

    setProgress({ ...progress, status: "uploading" });

    try {
      // Simulate upload progress (replace with actual upload logic)
      const totalChunks = 20;
      for (let i = 1; i <= totalChunks; i++) {
        await new Promise(resolve => setTimeout(resolve, 100));
        const loaded = (selectedFile.size / totalChunks) * i;
        setProgress({
          loaded,
          total: selectedFile.size,
          percentage: Math.round((i / totalChunks) * 100),
          status: "uploading",
        });
      }

      // Processing phase
      setProgress(prev => ({ ...prev, status: "processing", percentage: 100 }));
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Complete
      const videoId = `video_${Date.now()}`;
      const videoUrl = preview || "";
      
      setProgress(prev => ({ ...prev, status: "complete" }));
      onUploadComplete(videoUrl, videoId);
    } catch (error) {
      setProgress({
        ...progress,
        status: "error",
        error: "Upload failed. Please try again.",
      });
      onUploadError?.("Upload failed");
    }
  };

  const resetUpload = () => {
    setSelectedFile(null);
    setPreview(null);
    setProgress({
      loaded: 0,
      total: 0,
      percentage: 0,
      status: "idle",
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedFormats.join(",")}
        onChange={handleFileSelect}
        className="hidden"
      />

      <AnimatePresence mode="wait">
        {!selectedFile ? (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
            className={`
              relative cursor-pointer rounded-xl border-2 border-dashed p-12
              transition-all duration-200
              ${isDragging 
                ? "border-orange-500 bg-orange-500/10" 
                : "border-zinc-700 bg-zinc-900/50 hover:border-zinc-600 hover:bg-zinc-900"
              }
            `}
          >
            <div className="flex flex-col items-center gap-4 text-center">
              <div className={`
                w-16 h-16 rounded-full flex items-center justify-center
                ${isDragging ? "bg-orange-500/20" : "bg-zinc-800"}
              `}>
                <Upload className={`w-8 h-8 ${isDragging ? "text-orange-500" : "text-zinc-400"}`} />
              </div>
              <div>
                <p className="text-white font-medium mb-1">
                  {isDragging ? "Drop your video here" : "Drag & drop your race video"}
                </p>
                <p className="text-zinc-500 text-sm">
                  or click to browse • MP4, MOV, WebM up to {maxSizeMB}MB
                </p>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="preview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="rounded-xl border border-zinc-800 bg-zinc-900/50 overflow-hidden"
          >
            {/* Video Preview */}
            <div className="relative aspect-video bg-black">
              {preview && (
                <video
                  src={preview}
                  className="w-full h-full object-contain"
                  controls={progress.status === "idle"}
                />
              )}
              
              {/* Upload Overlay */}
              {progress.status !== "idle" && progress.status !== "complete" && (
                <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                  <div className="text-center">
                    {progress.status === "uploading" && (
                      <>
                        <Loader2 className="w-12 h-12 text-orange-500 animate-spin mx-auto mb-4" />
                        <p className="text-white font-medium mb-2">Uploading...</p>
                        <div className="w-48 h-2 bg-zinc-800 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-orange-500"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress.percentage}%` }}
                          />
                        </div>
                        <p className="text-zinc-400 text-sm mt-2">
                          {formatFileSize(progress.loaded)} / {formatFileSize(progress.total)}
                        </p>
                      </>
                    )}
                    {progress.status === "processing" && (
                      <>
                        <Film className="w-12 h-12 text-orange-500 animate-pulse mx-auto mb-4" />
                        <p className="text-white font-medium">Processing video...</p>
                        <p className="text-zinc-400 text-sm mt-1">This may take a moment</p>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Success Overlay */}
              {progress.status === "complete" && (
                <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                  <div className="text-center">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <p className="text-white font-bold text-lg">Upload Complete!</p>
                    <p className="text-zinc-300 text-sm mt-1">Ready for analysis</p>
                  </div>
                </div>
              )}

              {/* Error Overlay */}
              {progress.status === "error" && (
                <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center">
                  <div className="text-center">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <p className="text-white font-bold text-lg">Upload Failed</p>
                    <p className="text-red-300 text-sm mt-1">{progress.error}</p>
                  </div>
                </div>
              )}

              {/* Close Button */}
              {progress.status === "idle" && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    resetUpload();
                  }}
                  className="absolute top-3 right-3 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              )}
            </div>

            {/* File Info & Actions */}
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
                    <FileVideo className="w-5 h-5 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-white font-medium truncate max-w-[200px]">
                      {selectedFile.name}
                    </p>
                    <p className="text-zinc-500 text-sm">
                      {formatFileSize(selectedFile.size)}
                    </p>
                  </div>
                </div>

                {progress.status === "idle" && (
                  <div className="flex gap-2">
                    <button
                      onClick={resetUpload}
                      className="px-4 py-2 rounded-lg bg-zinc-800 text-zinc-300 hover:bg-zinc-700 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={uploadVideo}
                      className="px-4 py-2 rounded-lg bg-orange-500 text-white font-medium hover:bg-orange-600 transition-colors"
                    >
                      Upload & Analyze
                    </button>
                  </div>
                )}

                {progress.status === "complete" && (
                  <button
                    onClick={resetUpload}
                    className="px-4 py-2 rounded-lg bg-zinc-800 text-zinc-300 hover:bg-zinc-700 transition-colors"
                  >
                    Upload Another
                  </button>
                )}

                {progress.status === "error" && (
                  <button
                    onClick={() => setProgress({ ...progress, status: "idle" })}
                    className="px-4 py-2 rounded-lg bg-orange-500 text-white font-medium hover:bg-orange-600 transition-colors"
                  >
                    Try Again
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
