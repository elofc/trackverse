"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Pencil,
  Type,
  ArrowRight,
  Circle,
  Square,
  Eraser,
  Undo,
  Redo,
  Trash2,
  Save,
  Palette,
} from "lucide-react";
import { Annotation, AnnotationData } from "@/lib/video/types";

type AnnotationTool = "draw" | "text" | "arrow" | "circle" | "rectangle" | "eraser";

type VideoAnnotationsProps = {
  videoId: string;
  currentTime: number;
  width: number;
  height: number;
  annotations: Annotation[];
  onAnnotationAdd: (annotation: Omit<Annotation, "id" | "createdAt">) => void;
  onAnnotationDelete: (id: string) => void;
  onAnnotationsChange?: (annotations: Annotation[]) => void;
  userId: string;
};

const COLORS = [
  "#f97316", // orange
  "#ef4444", // red
  "#22c55e", // green
  "#3b82f6", // blue
  "#a855f7", // purple
  "#eab308", // yellow
  "#ffffff", // white
];

export function VideoAnnotations({
  videoId,
  currentTime,
  width,
  height,
  annotations,
  onAnnotationAdd,
  onAnnotationDelete,
  onAnnotationsChange,
  userId,
}: VideoAnnotationsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeTool, setActiveTool] = useState<AnnotationTool>("draw");
  const [activeColor, setActiveColor] = useState(COLORS[0]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPath, setCurrentPath] = useState<Array<{ x: number; y: number }>>([]);
  const [textInput, setTextInput] = useState("");
  const [textPosition, setTextPosition] = useState<{ x: number; y: number } | null>(null);
  const [arrowStart, setArrowStart] = useState<{ x: number; y: number } | null>(null);
  const [shapeStart, setShapeStart] = useState<{ x: number; y: number } | null>(null);
  const [history, setHistory] = useState<Annotation[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [showColorPicker, setShowColorPicker] = useState(false);

  // Get visible annotations for current time
  const visibleAnnotations = annotations.filter(
    (a) => currentTime * 1000 >= a.timestamp && currentTime * 1000 <= a.timestamp + (a.duration || 3000)
  );

  // Draw annotations on canvas
  const drawAnnotations = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    visibleAnnotations.forEach((annotation) => {
      ctx.strokeStyle = annotation.color;
      ctx.fillStyle = annotation.color;
      ctx.lineWidth = 3;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      const data = annotation.data;

      switch (data.type) {
        case "drawing":
          if (data.points.length < 2) return;
          ctx.beginPath();
          ctx.moveTo(data.points[0].x, data.points[0].y);
          data.points.forEach((point) => {
            ctx.lineTo(point.x, point.y);
          });
          ctx.stroke();
          break;

        case "text":
          ctx.font = `${data.fontSize}px Inter, sans-serif`;
          ctx.fillText(data.text, data.x, data.y);
          break;

        case "arrow":
          // Draw line
          ctx.beginPath();
          ctx.moveTo(data.startX, data.startY);
          ctx.lineTo(data.endX, data.endY);
          ctx.stroke();

          // Draw arrowhead
          const angle = Math.atan2(data.endY - data.startY, data.endX - data.startX);
          const headLength = 15;
          ctx.beginPath();
          ctx.moveTo(data.endX, data.endY);
          ctx.lineTo(
            data.endX - headLength * Math.cos(angle - Math.PI / 6),
            data.endY - headLength * Math.sin(angle - Math.PI / 6)
          );
          ctx.moveTo(data.endX, data.endY);
          ctx.lineTo(
            data.endX - headLength * Math.cos(angle + Math.PI / 6),
            data.endY - headLength * Math.sin(angle + Math.PI / 6)
          );
          ctx.stroke();
          break;

        case "circle":
          ctx.beginPath();
          ctx.arc(data.centerX, data.centerY, data.radius, 0, 2 * Math.PI);
          ctx.stroke();
          break;

        case "rectangle":
          ctx.strokeRect(data.x, data.y, data.width, data.height);
          break;
      }
    });

    // Draw current drawing in progress
    if (isDrawing && currentPath.length > 1) {
      ctx.strokeStyle = activeColor;
      ctx.beginPath();
      ctx.moveTo(currentPath[0].x, currentPath[0].y);
      currentPath.forEach((point) => {
        ctx.lineTo(point.x, point.y);
      });
      ctx.stroke();
    }
  }, [visibleAnnotations, width, height, isDrawing, currentPath, activeColor]);

  useEffect(() => {
    drawAnnotations();
  }, [drawAnnotations]);

  // Get mouse position relative to canvas
  const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>): { x: number; y: number } => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  // Mouse event handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const pos = getMousePos(e);

    switch (activeTool) {
      case "draw":
        setIsDrawing(true);
        setCurrentPath([pos]);
        break;
      case "text":
        setTextPosition(pos);
        break;
      case "arrow":
        setArrowStart(pos);
        break;
      case "circle":
      case "rectangle":
        setShapeStart(pos);
        break;
      case "eraser":
        // Find and delete annotation at this position
        const toDelete = visibleAnnotations.find((a) => {
          // Simple hit detection - could be improved
          if (a.data.type === "drawing") {
            return a.data.points.some(
              (p) => Math.abs(p.x - pos.x) < 10 && Math.abs(p.y - pos.y) < 10
            );
          }
          return false;
        });
        if (toDelete) {
          onAnnotationDelete(toDelete.id);
        }
        break;
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing && activeTool !== "draw") return;

    const pos = getMousePos(e);

    if (activeTool === "draw" && isDrawing) {
      setCurrentPath((prev) => [...prev, pos]);
    }
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const pos = getMousePos(e);

    if (activeTool === "draw" && isDrawing && currentPath.length > 1) {
      const annotation: Omit<Annotation, "id" | "createdAt"> = {
        videoId,
        userId,
        type: "drawing",
        timestamp: currentTime * 1000,
        duration: 3000,
        data: { type: "drawing", points: currentPath },
        color: activeColor,
      };
      onAnnotationAdd(annotation);
    }

    if (activeTool === "arrow" && arrowStart) {
      const annotation: Omit<Annotation, "id" | "createdAt"> = {
        videoId,
        userId,
        type: "arrow",
        timestamp: currentTime * 1000,
        duration: 3000,
        data: {
          type: "arrow",
          startX: arrowStart.x,
          startY: arrowStart.y,
          endX: pos.x,
          endY: pos.y,
        },
        color: activeColor,
      };
      onAnnotationAdd(annotation);
      setArrowStart(null);
    }

    if ((activeTool === "circle" || activeTool === "rectangle") && shapeStart) {
      if (activeTool === "circle") {
        const radius = Math.sqrt(
          Math.pow(pos.x - shapeStart.x, 2) + Math.pow(pos.y - shapeStart.y, 2)
        );
        const annotation: Omit<Annotation, "id" | "createdAt"> = {
          videoId,
          userId,
          type: "circle",
          timestamp: currentTime * 1000,
          duration: 3000,
          data: {
            type: "circle",
            centerX: shapeStart.x,
            centerY: shapeStart.y,
            radius,
          },
          color: activeColor,
        };
        onAnnotationAdd(annotation);
      } else {
        const annotation: Omit<Annotation, "id" | "createdAt"> = {
          videoId,
          userId,
          type: "rectangle",
          timestamp: currentTime * 1000,
          duration: 3000,
          data: {
            type: "rectangle",
            x: Math.min(shapeStart.x, pos.x),
            y: Math.min(shapeStart.y, pos.y),
            width: Math.abs(pos.x - shapeStart.x),
            height: Math.abs(pos.y - shapeStart.y),
          },
          color: activeColor,
        };
        onAnnotationAdd(annotation);
      }
      setShapeStart(null);
    }

    setIsDrawing(false);
    setCurrentPath([]);
  };

  // Handle text input
  const handleTextSubmit = () => {
    if (!textPosition || !textInput.trim()) return;

    const annotation: Omit<Annotation, "id" | "createdAt"> = {
      videoId,
      userId,
      type: "text",
      timestamp: currentTime * 1000,
      duration: 3000,
      data: {
        type: "text",
        x: textPosition.x,
        y: textPosition.y,
        text: textInput,
        fontSize: 24,
      },
      color: activeColor,
    };
    onAnnotationAdd(annotation);
    setTextInput("");
    setTextPosition(null);
  };

  const tools: Array<{ id: AnnotationTool; icon: React.ReactNode; label: string }> = [
    { id: "draw", icon: <Pencil className="w-4 h-4" />, label: "Draw" },
    { id: "text", icon: <Type className="w-4 h-4" />, label: "Text" },
    { id: "arrow", icon: <ArrowRight className="w-4 h-4" />, label: "Arrow" },
    { id: "circle", icon: <Circle className="w-4 h-4" />, label: "Circle" },
    { id: "rectangle", icon: <Square className="w-4 h-4" />, label: "Rectangle" },
    { id: "eraser", icon: <Eraser className="w-4 h-4" />, label: "Eraser" },
  ];

  return (
    <div className="relative">
      {/* Canvas */}
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="absolute inset-0 cursor-crosshair"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => {
          setIsDrawing(false);
          setCurrentPath([]);
        }}
      />

      {/* Text Input Modal */}
      {textPosition && (
        <div
          className="absolute bg-zinc-900 border border-zinc-700 rounded-lg p-2 shadow-lg"
          style={{ left: textPosition.x, top: textPosition.y }}
        >
          <input
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleTextSubmit()}
            placeholder="Enter text..."
            className="bg-zinc-800 text-white px-2 py-1 rounded text-sm w-40"
            autoFocus
          />
          <div className="flex gap-1 mt-2">
            <button
              onClick={handleTextSubmit}
              className="px-2 py-1 bg-orange-500 text-white text-xs rounded"
            >
              Add
            </button>
            <button
              onClick={() => {
                setTextPosition(null);
                setTextInput("");
              }}
              className="px-2 py-1 bg-zinc-700 text-white text-xs rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-zinc-900/90 backdrop-blur-sm border border-zinc-700 rounded-lg p-1">
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => setActiveTool(tool.id)}
            className={`p-2 rounded-md transition-colors ${
              activeTool === tool.id
                ? "bg-orange-500 text-white"
                : "text-zinc-400 hover:text-white hover:bg-zinc-800"
            }`}
            title={tool.label}
          >
            {tool.icon}
          </button>
        ))}

        <div className="w-px h-6 bg-zinc-700 mx-1" />

        {/* Color Picker */}
        <div className="relative">
          <button
            onClick={() => setShowColorPicker(!showColorPicker)}
            className="p-2 rounded-md hover:bg-zinc-800 transition-colors"
            title="Color"
          >
            <div
              className="w-4 h-4 rounded-full border-2 border-white"
              style={{ backgroundColor: activeColor }}
            />
          </button>

          {showColorPicker && (
            <div className="absolute bottom-full left-0 mb-2 bg-zinc-900 border border-zinc-700 rounded-lg p-2 flex gap-1">
              {COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => {
                    setActiveColor(color);
                    setShowColorPicker(false);
                  }}
                  className={`w-6 h-6 rounded-full border-2 ${
                    activeColor === color ? "border-white" : "border-transparent"
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          )}
        </div>

        <div className="w-px h-6 bg-zinc-700 mx-1" />

        {/* Clear All */}
        <button
          onClick={() => {
            visibleAnnotations.forEach((a) => onAnnotationDelete(a.id));
          }}
          className="p-2 rounded-md text-zinc-400 hover:text-red-400 hover:bg-zinc-800 transition-colors"
          title="Clear All"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
