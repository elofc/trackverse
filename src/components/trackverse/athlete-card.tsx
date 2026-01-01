"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn, formatTime, getRankChangeIndicator } from "@/lib/utils";

interface AthleteCardProps {
  name: string;
  school: string;
  gradYear: number;
  avatarUrl?: string;
  rank?: number;
  rankChange?: number;
  tier: "rookie" | "varsity" | "elite" | "all-state" | "national" | "world-class";
  events: { name: string; time: number }[];
  className?: string;
}

export function AthleteCard({
  name,
  school,
  gradYear,
  avatarUrl,
  rank,
  rankChange = 0,
  tier,
  events,
  className,
}: AthleteCardProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const { icon, color } = getRankChangeIndicator(rankChange);

  return (
    <Card className={cn("card-hover overflow-hidden", className)}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 border-2 border-primary/20">
              <AvatarImage src={avatarUrl} alt={name} />
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-foreground">{name}</h3>
              <p className="text-sm text-muted-foreground">
                {school} • Class of {gradYear}
              </p>
            </div>
          </div>
          {rank && (
            <div className="text-right">
              <span className="rank-display text-3xl text-foreground">#{rank}</span>
              {rankChange !== 0 && (
                <p className={cn("text-sm font-medium", color)}>
                  {icon}
                  {Math.abs(rankChange)}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {events.slice(0, 3).map((event) => (
            <div
              key={event.name}
              className="flex items-center gap-1.5 rounded-lg bg-muted px-2.5 py-1"
            >
              <span className="text-xs text-muted-foreground">{event.name}:</span>
              <span className="time-display text-sm font-bold">
                {formatTime(event.time)}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-3 flex items-center justify-between">
          <Badge variant={tier} className="capitalize">
            {tier.replace("-", " ")}
          </Badge>
          <div className="h-2 w-24 overflow-hidden rounded-full bg-muted">
            <div
              className={cn(
                "h-full transition-all",
                tier === "rookie" && "w-[16%] bg-gray-400",
                tier === "varsity" && "w-[33%] bg-emerald-500",
                tier === "elite" && "w-[50%] bg-blue-500",
                tier === "all-state" && "w-[66%] bg-purple-500",
                tier === "national" && "w-[83%] bg-amber-500",
                tier === "world-class" && "w-full bg-red-500"
              )}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
