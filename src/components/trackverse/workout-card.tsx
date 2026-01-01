"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Dumbbell, Timer, Flame, MapPin } from "lucide-react";

interface WorkoutCardProps {
  title: string;
  type: "sprint" | "tempo" | "distance" | "lift" | "plyo" | "recovery" | "drills";
  date: Date;
  totalDistance?: number;
  duration?: number;
  effort: number;
  description?: string;
  className?: string;
}

const typeIcons = {
  sprint: "⚡",
  tempo: "🏃",
  distance: "🛤️",
  lift: "🏋️",
  plyo: "🦘",
  recovery: "🧘",
  drills: "🎯",
};

const typeColors = {
  sprint: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  tempo: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  distance: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  lift: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  plyo: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400",
  recovery: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400",
  drills: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
};

export function WorkoutCard({
  title,
  type,
  date,
  totalDistance,
  duration,
  effort,
  description,
  className,
}: WorkoutCardProps) {
  const formattedDate = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return (
    <Card className={cn("card-hover overflow-hidden", className)}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-lg text-xl",
                typeColors[type]
              )}
            >
              {typeIcons[type]}
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{title}</h3>
              <p className="text-sm text-muted-foreground capitalize">{type} Workout</p>
            </div>
          </div>
          <span className="text-sm text-muted-foreground">{formattedDate}</span>
        </div>

        {description && (
          <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
            {description}
          </p>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-4">
          {totalDistance && (
            <div className="flex items-center gap-1.5 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{(totalDistance / 1000).toFixed(1)}km</span>
            </div>
          )}
          {duration && (
            <div className="flex items-center gap-1.5 text-sm">
              <Timer className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{duration}min</span>
            </div>
          )}
          <div className="flex items-center gap-1.5 text-sm">
            <Flame className="h-4 w-4 text-orange-500" />
            <span className="font-medium">{effort}/10</span>
          </div>
        </div>

        <div className="mt-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
            <span>Effort</span>
            <span>{effort}/10</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className={cn(
                "h-full transition-all",
                effort <= 3 && "bg-green-500",
                effort > 3 && effort <= 6 && "bg-yellow-500",
                effort > 6 && effort <= 8 && "bg-orange-500",
                effort > 8 && "bg-red-500"
              )}
              style={{ width: `${effort * 10}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
