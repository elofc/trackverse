"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn, getTimeAgo, formatTime } from "@/lib/utils";
import { Heart, MessageCircle, Share2, MoreHorizontal, Trophy } from "lucide-react";
import { useState } from "react";

interface PostCardProps {
  author: {
    name: string;
    avatarUrl?: string;
    school?: string;
  };
  content: string;
  mediaUrl?: string;
  prData?: {
    event: string;
    time: number;
    improvement?: number;
  };
  likes: number;
  comments: number;
  shares: number;
  createdAt: Date;
  isLiked?: boolean;
  className?: string;
}

export function PostCard({
  author,
  content,
  mediaUrl,
  prData,
  likes,
  comments,
  shares,
  createdAt,
  isLiked = false,
  className,
}: PostCardProps) {
  const [liked, setLiked] = useState(isLiked);
  const [likeCount, setLikeCount] = useState(likes);

  const initials = author.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
  };

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={author.avatarUrl} alt={author.name} />
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-foreground">{author.name}</h3>
              <p className="text-xs text-muted-foreground">
                {author.school && `${author.school} • `}
                {getTimeAgo(createdAt)}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <p className="mt-3 text-foreground whitespace-pre-wrap">{content}</p>

        {/* PR Achievement */}
        {prData && (
          <div className="mt-3 rounded-lg bg-gradient-to-r from-orange-500/10 to-blue-500/10 p-4 border border-primary/20">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="h-5 w-5 text-primary" />
              <span className="font-semibold text-primary">New Personal Record!</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{prData.event}</p>
                <p className="time-display text-2xl font-bold">{formatTime(prData.time)}</p>
              </div>
              {prData.improvement && (
                <Badge variant="success" className="text-sm">
                  -{(prData.improvement / 1000).toFixed(2)}s
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Media */}
        {mediaUrl && (
          <div className="mt-3 overflow-hidden rounded-lg">
            <img
              src={mediaUrl}
              alt="Post media"
              className="w-full object-cover max-h-96"
            />
          </div>
        )}

        {/* Actions */}
        <div className="mt-4 flex items-center justify-between border-t pt-3">
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "gap-1.5",
                liked && "text-red-500 hover:text-red-600"
              )}
              onClick={handleLike}
            >
              <Heart className={cn("h-4 w-4", liked && "fill-current")} />
              <span>{likeCount}</span>
            </Button>
            <Button variant="ghost" size="sm" className="gap-1.5">
              <MessageCircle className="h-4 w-4" />
              <span>{comments}</span>
            </Button>
            <Button variant="ghost" size="sm" className="gap-1.5">
              <Share2 className="h-4 w-4" />
              <span>{shares}</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
