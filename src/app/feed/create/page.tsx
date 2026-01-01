"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/trackverse/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { TierBadge } from "@/components/trackverse/tier-badge";
import { calculateTier, Tier } from "@/lib/rankings";
import {
  ChevronLeft,
  Flame,
  Dumbbell,
  Medal,
  Trophy,
  Timer,
  Image as ImageIcon,
  Video,
  Send,
  X,
  Plus,
  Zap,
} from "lucide-react";

type PostType = "pr" | "workout" | "meet" | "general";

const postTypes = [
  { id: "pr" as PostType, name: "Share PR", icon: Flame, color: "orange", description: "Celebrate your new personal record" },
  { id: "workout" as PostType, name: "Share Workout", icon: Dumbbell, color: "blue", description: "Share your training session" },
  { id: "meet" as PostType, name: "Meet Result", icon: Medal, color: "yellow", description: "Share your competition result" },
  { id: "general" as PostType, name: "General Post", icon: Trophy, color: "purple", description: "Share anything track related" },
];

const events = ["100m", "200m", "400m", "800m", "1600m", "110m Hurdles", "300m Hurdles", "High Jump", "Long Jump", "Triple Jump", "Shot Put", "Discus"];

export default function CreatePostPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialType = searchParams.get('type') as PostType || null;
  
  const [postType, setPostType] = useState<PostType | null>(initialType);
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // PR fields
  const [prEvent, setPrEvent] = useState("");
  const [prMinutes, setPrMinutes] = useState("");
  const [prSeconds, setPrSeconds] = useState("");
  const [prMilliseconds, setPrMilliseconds] = useState("");
  const [prFeet, setPrFeet] = useState("");
  const [prInches, setPrInches] = useState("");
  
  // Workout fields
  const [workoutTitle, setWorkoutTitle] = useState("");
  const [workoutDuration, setWorkoutDuration] = useState("");
  const [workoutEffort, setWorkoutEffort] = useState(5);
  
  // Meet fields
  const [meetName, setMeetName] = useState("");
  const [meetEvent, setMeetEvent] = useState("");
  const [meetPlace, setMeetPlace] = useState("");

  const isFieldEvent = prEvent && ["High Jump", "Long Jump", "Triple Jump", "Shot Put", "Discus"].includes(prEvent);

  const getPerformanceMs = () => {
    const min = parseInt(prMinutes) || 0;
    const sec = parseInt(prSeconds) || 0;
    const ms = parseInt(prMilliseconds) || 0;
    return (min * 60 * 1000) + (sec * 1000) + (ms * 10);
  };

  const formatTime = () => {
    const min = parseInt(prMinutes) || 0;
    const sec = parseInt(prSeconds) || 0;
    const ms = parseInt(prMilliseconds) || 0;
    if (min > 0) {
      return `${min}:${sec.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
    }
    return `${sec}.${ms.toString().padStart(2, '0')}`;
  };

  const formatDistance = () => {
    const ft = parseInt(prFeet) || 0;
    const inc = parseFloat(prInches) || 0;
    return `${ft}' ${inc.toFixed(2)}"`;
  };

  const getCalculatedTier = (): Tier | null => {
    if (!prEvent) return null;
    if (isFieldEvent) {
      const cm = ((parseInt(prFeet) || 0) * 12 + (parseFloat(prInches) || 0)) * 2.54;
      if (cm > 0) return calculateTier(prEvent.toUpperCase().replace(" ", "_"), cm, true);
    } else {
      const ms = getPerformanceMs();
      if (ms > 0) return calculateTier(prEvent.replace("m", "").replace(" Hurdles", "H"), ms, false);
    }
    return null;
  };

  const calculatedTier = getCalculatedTier();

  const handleSubmit = async () => {
    setIsLoading(true);
    // TODO: Save post to database
    await new Promise(resolve => setTimeout(resolve, 1500));
    router.push("/feed?posted=true");
  };

  const canSubmit = () => {
    if (!content.trim()) return false;
    if (postType === "pr" && !prEvent) return false;
    if (postType === "pr" && !isFieldEvent && !prSeconds) return false;
    if (postType === "pr" && isFieldEvent && !prFeet && !prInches) return false;
    if (postType === "workout" && !workoutTitle) return false;
    if (postType === "meet" && (!meetName || !meetEvent)) return false;
    return true;
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Back Button */}
        <Link href="/feed" className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-6 transition-colors">
          <ChevronLeft className="h-4 w-4" />
          Back to Feed
        </Link>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black mb-2">CREATE POST</h1>
          <p className="text-white/60">Share your achievements with the community</p>
        </div>

        {/* Post Type Selection */}
        {!postType && (
          <div className="grid grid-cols-2 gap-4 mb-8">
            {postTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setPostType(type.id)}
                className={`p-6 rounded-xl text-left transition-all bg-white/5 border-2 border-transparent hover:border-${type.color}-500/50 hover:bg-white/10`}
              >
                <div className={`w-12 h-12 rounded-xl mb-3 flex items-center justify-center bg-${type.color}-500/20`}>
                  <type.icon className={`h-6 w-6 text-${type.color}-500`} />
                </div>
                <p className="font-bold text-white">{type.name}</p>
                <p className="text-sm text-white/50">{type.description}</p>
              </button>
            ))}
          </div>
        )}

        {/* Post Form */}
        {postType && (
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                  {postType === "pr" && <><Flame className="h-5 w-5 text-orange-500" /> Share Your PR</>}
                  {postType === "workout" && <><Dumbbell className="h-5 w-5 text-blue-500" /> Share Workout</>}
                  {postType === "meet" && <><Medal className="h-5 w-5 text-yellow-500" /> Share Meet Result</>}
                  {postType === "general" && <><Trophy className="h-5 w-5 text-purple-500" /> General Post</>}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setPostType(null)}
                  className="text-white/50 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* PR Form */}
              {postType === "pr" && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-white/80">Event</label>
                    <div className="grid grid-cols-3 gap-2">
                      {events.map((event) => (
                        <button
                          key={event}
                          onClick={() => setPrEvent(event)}
                          className={`py-2 px-3 rounded-lg text-sm font-semibold transition-all ${
                            prEvent === event
                              ? 'bg-orange-500 text-white'
                              : 'bg-white/5 text-white/60 hover:bg-white/10'
                          }`}
                        >
                          {event}
                        </button>
                      ))}
                    </div>
                  </div>

                  {prEvent && (
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-white/80">
                        {isFieldEvent ? "Distance/Height" : "Time"}
                      </label>
                      {isFieldEvent ? (
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            value={prFeet}
                            onChange={(e) => setPrFeet(e.target.value)}
                            placeholder="Feet"
                            className="bg-white/5 border-white/10 text-white text-center text-xl font-mono"
                          />
                          <span className="text-white/40">&apos;</span>
                          <Input
                            type="number"
                            step="0.25"
                            value={prInches}
                            onChange={(e) => setPrInches(e.target.value)}
                            placeholder="Inches"
                            className="bg-white/5 border-white/10 text-white text-center text-xl font-mono"
                          />
                          <span className="text-white/40">&quot;</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          {["800m", "1600m"].includes(prEvent) && (
                            <>
                              <Input
                                type="number"
                                value={prMinutes}
                                onChange={(e) => setPrMinutes(e.target.value)}
                                placeholder="Min"
                                className="bg-white/5 border-white/10 text-white text-center text-xl font-mono"
                              />
                              <span className="text-white/40">:</span>
                            </>
                          )}
                          <Input
                            type="number"
                            value={prSeconds}
                            onChange={(e) => setPrSeconds(e.target.value)}
                            placeholder="Sec"
                            className="bg-white/5 border-white/10 text-white text-center text-xl font-mono"
                          />
                          <span className="text-white/40">.</span>
                          <Input
                            type="number"
                            value={prMilliseconds}
                            onChange={(e) => setPrMilliseconds(e.target.value)}
                            placeholder="Ms"
                            className="bg-white/5 border-white/10 text-white text-center text-xl font-mono"
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* PR Preview */}
                  {(prSeconds || prFeet || prInches) && (
                    <div className="p-4 rounded-xl bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-white/60">{prEvent}</p>
                          <p className="text-3xl font-black text-white">
                            {isFieldEvent ? formatDistance() : formatTime()}
                          </p>
                        </div>
                        {calculatedTier && <TierBadge tier={calculatedTier} size="lg" />}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Workout Form */}
              {postType === "workout" && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-white/80">Workout Title</label>
                    <Input
                      value={workoutTitle}
                      onChange={(e) => setWorkoutTitle(e.target.value)}
                      placeholder="e.g., Sprint Intervals"
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-white/80">Duration (min)</label>
                      <Input
                        type="number"
                        value={workoutDuration}
                        onChange={(e) => setWorkoutDuration(e.target.value)}
                        placeholder="45"
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-white/80">Effort (1-10)</label>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
                          <button
                            key={level}
                            onClick={() => setWorkoutEffort(level)}
                            className={`flex-1 h-10 rounded font-bold text-xs transition-all ${
                              level <= workoutEffort
                                ? level <= 3 ? 'bg-green-500 text-white'
                                  : level <= 6 ? 'bg-yellow-500 text-black'
                                  : level <= 8 ? 'bg-orange-500 text-white'
                                  : 'bg-red-500 text-white'
                                : 'bg-white/10 text-white/30'
                            }`}
                          >
                            {level}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Workout Preview */}
                  {workoutTitle && (
                    <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                          <Dumbbell className="h-5 w-5 text-blue-400" />
                        </div>
                        <div>
                          <p className="font-bold text-white">{workoutTitle}</p>
                          <p className="text-sm text-white/50">
                            {workoutDuration && `${workoutDuration}min • `}Effort: {workoutEffort}/10
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Meet Form */}
              {postType === "meet" && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-white/80">Meet Name</label>
                    <Input
                      value={meetName}
                      onChange={(e) => setMeetName(e.target.value)}
                      placeholder="e.g., Regional Championships"
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-white/80">Event</label>
                      <select
                        value={meetEvent}
                        onChange={(e) => setMeetEvent(e.target.value)}
                        className="w-full h-10 px-3 rounded-md bg-white/5 border border-white/10 text-white"
                      >
                        <option value="">Select event</option>
                        {events.map((event) => (
                          <option key={event} value={event}>{event}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-white/80">Place</label>
                      <Input
                        type="number"
                        value={meetPlace}
                        onChange={(e) => setMeetPlace(e.target.value)}
                        placeholder="1"
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                      />
                    </div>
                  </div>

                  {/* Meet Preview */}
                  {meetName && meetEvent && (
                    <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/30">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-yellow-500/20 flex items-center justify-center text-xl">
                          {meetPlace === "1" ? "🥇" : meetPlace === "2" ? "🥈" : meetPlace === "3" ? "🥉" : "🏅"}
                        </div>
                        <div>
                          <p className="font-bold text-white">{meetName}</p>
                          <p className="text-sm text-white/50">
                            {meetEvent} • {meetPlace ? `${meetPlace}${meetPlace === "1" ? "st" : meetPlace === "2" ? "nd" : meetPlace === "3" ? "rd" : "th"} Place` : ""}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Content */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-white/80">What&apos;s on your mind?</label>
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={
                    postType === "pr" ? "Share your PR story! How did it feel? #PRAlert #TrackLife" :
                    postType === "workout" ? "Tell us about your workout! #TrackTraining" :
                    postType === "meet" ? "Share your meet experience! #MeetDay" :
                    "Share something with the track community..."
                  }
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 min-h-[120px]"
                />
              </div>

              {/* Media Buttons */}
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="bg-white/5 border-white/10 text-white hover:bg-white/10">
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Add Photo
                </Button>
                <Button variant="outline" size="sm" className="bg-white/5 border-white/10 text-white hover:bg-white/10">
                  <Video className="h-4 w-4 mr-2" />
                  Add Video
                </Button>
              </div>

              {/* Submit */}
              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <p className="text-sm text-white/50">
                  {content.length}/500 characters
                </p>
                <Button
                  onClick={handleSubmit}
                  disabled={!canSubmit() || isLoading}
                  className="btn-track text-white font-bold px-6"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Posting...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Send className="h-4 w-4" />
                      Post
                    </span>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
