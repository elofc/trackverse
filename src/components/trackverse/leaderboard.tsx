"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn, formatTime, getRankChangeIndicator } from "@/lib/utils";
import { Trophy, Medal, Award } from "lucide-react";

interface LeaderboardEntry {
  rank: number;
  name: string;
  school: string;
  avatarUrl?: string;
  time: number;
  tier: "rookie" | "varsity" | "elite" | "all-state" | "national" | "world-class";
  rankChange?: number;
}

interface LeaderboardProps {
  title: string;
  event: string;
  entries: LeaderboardEntry[];
  className?: string;
}

export function Leaderboard({ title, event, entries, className }: LeaderboardProps) {
  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-5 w-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />;
    if (rank === 3) return <Award className="h-5 w-5 text-amber-600" />;
    return null;
  };

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10 pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{title}</CardTitle>
          <Badge variant="secondary">{event}</Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {entries.map((entry) => {
            const initials = entry.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase();
            const { icon, color } = getRankChangeIndicator(entry.rankChange || 0);

            return (
              <div
                key={entry.rank}
                className={cn(
                  "flex items-center gap-4 p-4 transition-colors hover:bg-muted/50",
                  entry.rank <= 3 && "bg-gradient-to-r from-primary/5 to-transparent"
                )}
              >
                {/* Rank */}
                <div className="flex w-12 items-center justify-center">
                  {getRankIcon(entry.rank) || (
                    <span className="rank-display text-xl text-muted-foreground">
                      {entry.rank}
                    </span>
                  )}
                </div>

                {/* Avatar & Info */}
                <div className="flex flex-1 items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={entry.avatarUrl} alt={entry.name} />
                    <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-foreground truncate">{entry.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{entry.school}</p>
                  </div>
                </div>

                {/* Time */}
                <div className="text-right">
                  <p className="time-display text-lg font-bold">{formatTime(entry.time)}</p>
                  <div className="flex items-center justify-end gap-1">
                    <Badge variant={entry.tier} className="text-xs capitalize">
                      {entry.tier.replace("-", " ")}
                    </Badge>
                    {entry.rankChange !== undefined && entry.rankChange !== 0 && (
                      <span className={cn("text-xs font-medium", color)}>
                        {icon}
                        {Math.abs(entry.rankChange)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
