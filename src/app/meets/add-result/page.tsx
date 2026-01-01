"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/trackverse/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { TierBadge } from "@/components/trackverse/tier-badge";
import { calculateTier, Tier } from "@/lib/rankings";
import {
  ChevronLeft,
  ChevronRight,
  Trophy,
  Timer,
  MapPin,
  Calendar,
  Wind,
  Video,
  Flame,
  Check,
  Ruler,
  Medal,
  Search,
} from "lucide-react";

const recentMeets = [
  { id: "meet-5", name: "Season Opener", date: new Date(2024, 11, 10), location: "Adams Field" },
  { id: "meet-6", name: "Holiday Classic", date: new Date(2024, 11, 20), location: "Madison Arena" },
  { id: "meet-1", name: "Regional Championships", date: new Date(2025, 0, 15), location: "Lincoln Stadium" },
];

const events = [
  { id: "100m", name: "100m", category: "Sprint", unit: "time" },
  { id: "200m", name: "200m", category: "Sprint", unit: "time" },
  { id: "400m", name: "400m", category: "Sprint", unit: "time" },
  { id: "800m", name: "800m", category: "Distance", unit: "time" },
  { id: "1600m", name: "1600m", category: "Distance", unit: "time" },
  { id: "110h", name: "110m Hurdles", category: "Hurdles", unit: "time" },
  { id: "300h", name: "300m Hurdles", category: "Hurdles", unit: "time" },
  { id: "hj", name: "High Jump", category: "Jumps", unit: "height" },
  { id: "lj", name: "Long Jump", category: "Jumps", unit: "distance" },
  { id: "tj", name: "Triple Jump", category: "Jumps", unit: "distance" },
  { id: "sp", name: "Shot Put", category: "Throws", unit: "distance" },
  { id: "disc", name: "Discus", category: "Throws", unit: "distance" },
];

export default function AddResultPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  // Step 1: Meet selection
  const [selectedMeet, setSelectedMeet] = useState<string | null>(null);
  const [customMeetName, setCustomMeetName] = useState("");
  const [customMeetDate, setCustomMeetDate] = useState("");
  const [customMeetLocation, setCustomMeetLocation] = useState("");
  
  // Step 2: Event selection
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  
  // Step 3: Performance
  const [minutes, setMinutes] = useState("");
  const [seconds, setSeconds] = useState("");
  const [milliseconds, setMilliseconds] = useState("");
  const [feet, setFeet] = useState("");
  const [inches, setInches] = useState("");
  
  // Step 4: Details
  const [place, setPlace] = useState("");
  const [heat, setHeat] = useState("");
  const [lane, setLane] = useState("");
  const [windSpeed, setWindSpeed] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [isPR, setIsPR] = useState(false);

  const selectedEventData = events.find(e => e.id === selectedEvent);
  const isFieldEvent = selectedEventData?.unit === "distance" || selectedEventData?.unit === "height";

  const getPerformanceMs = () => {
    const min = parseInt(minutes) || 0;
    const sec = parseInt(seconds) || 0;
    const ms = parseInt(milliseconds) || 0;
    return (min * 60 * 1000) + (sec * 1000) + (ms * 10);
  };

  const formatTime = () => {
    const min = parseInt(minutes) || 0;
    const sec = parseInt(seconds) || 0;
    const ms = parseInt(milliseconds) || 0;
    if (min > 0) {
      return `${min}:${sec.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
    }
    return `${sec}.${ms.toString().padStart(2, '0')}`;
  };

  const formatDistance = () => {
    const ft = parseInt(feet) || 0;
    const inc = parseFloat(inches) || 0;
    return `${ft}' ${inc.toFixed(2)}"`;
  };

  const getCalculatedTier = (): Tier | null => {
    if (!selectedEvent) return null;
    if (isFieldEvent) {
      const cm = ((parseInt(feet) || 0) * 12 + (parseFloat(inches) || 0)) * 2.54;
      if (cm > 0) return calculateTier(selectedEvent.toUpperCase(), cm, true);
    } else {
      const ms = getPerformanceMs();
      if (ms > 0) return calculateTier(selectedEvent, ms, false);
    }
    return null;
  };

  const calculatedTier = getCalculatedTier();

  const handleSubmit = async () => {
    setIsLoading(true);
    // TODO: Save result to database
    await new Promise(resolve => setTimeout(resolve, 1500));
    router.push("/meets?result=added");
  };

  const canProceed = () => {
    switch (step) {
      case 1: return selectedMeet !== null || (customMeetName && customMeetDate);
      case 2: return selectedEvent !== null;
      case 3: 
        if (isFieldEvent) return feet !== "" || inches !== "";
        return seconds !== "";
      case 4: return true;
      default: return false;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Back Button */}
        <Link href="/meets" className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-6 transition-colors">
          <ChevronLeft className="h-4 w-4" />
          Back to Meets
        </Link>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/30 mb-4">
            <Medal className="h-4 w-4 text-orange-500" />
            <span className="text-sm font-semibold text-orange-400">ADD MEET RESULT</span>
          </div>
          <h1 className="text-4xl font-black mb-2">LOG YOUR PERFORMANCE 🏁</h1>
          <p className="text-white/60">Record your meet result and track your progress</p>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`h-2 rounded-full transition-all duration-300 ${
                s === step 
                  ? 'w-8 bg-orange-500' 
                  : s < step 
                    ? 'w-2 bg-orange-500' 
                    : 'w-2 bg-white/20'
              }`}
            />
          ))}
        </div>

        <Card className="bg-white/5 border-orange-500/20">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-white">
              {step === 1 && "Select Meet"}
              {step === 2 && "Select Event"}
              {step === 3 && "Enter Performance"}
              {step === 4 && "Additional Details"}
            </CardTitle>
            <CardDescription className="text-white/60">
              {step === 1 && "Which meet did you compete in?"}
              {step === 2 && "What event did you compete in?"}
              {step === 3 && `Enter your ${selectedEventData?.name || ''} result`}
              {step === 4 && "Add placement and other details"}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Step 1: Select Meet */}
            {step === 1 && (
              <div className="space-y-4">
                <p className="text-sm text-white/60 font-semibold">Recent Meets</p>
                <div className="space-y-2">
                  {recentMeets.map((meet) => (
                    <button
                      key={meet.id}
                      onClick={() => setSelectedMeet(meet.id)}
                      className={`w-full p-4 rounded-xl text-left transition-all ${
                        selectedMeet === meet.id
                          ? 'bg-orange-500/20 border-2 border-orange-500'
                          : 'bg-white/5 border-2 border-transparent hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-bold text-white">{meet.name}</p>
                          <p className="text-sm text-white/50">
                            {meet.date.toLocaleDateString()} • {meet.location}
                          </p>
                        </div>
                        {selectedMeet === meet.id && (
                          <Check className="h-5 w-5 text-orange-500" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-black/50 px-2 text-white/40">Or add new meet</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Input
                    value={customMeetName}
                    onChange={(e) => { setCustomMeetName(e.target.value); setSelectedMeet(null); }}
                    placeholder="Meet name"
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      type="date"
                      value={customMeetDate}
                      onChange={(e) => { setCustomMeetDate(e.target.value); setSelectedMeet(null); }}
                      className="bg-white/5 border-white/10 text-white"
                    />
                    <Input
                      value={customMeetLocation}
                      onChange={(e) => setCustomMeetLocation(e.target.value)}
                      placeholder="Location"
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Select Event */}
            {step === 2 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-80 overflow-y-auto pr-2">
                {events.map((event) => (
                  <button
                    key={event.id}
                    onClick={() => setSelectedEvent(event.id)}
                    className={`p-4 rounded-xl text-left transition-all ${
                      selectedEvent === event.id
                        ? 'bg-orange-500/20 border-2 border-orange-500'
                        : 'bg-white/5 border-2 border-transparent hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">{event.name}</span>
                      {selectedEvent === event.id && (
                        <Check className="h-4 w-4 text-orange-500" />
                      )}
                    </div>
                    <span className="text-xs text-white/40">{event.category}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Step 3: Enter Performance */}
            {step === 3 && (
              <div className="space-y-6">
                {isFieldEvent ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-white/60 mb-2">
                      <Ruler className="h-4 w-4" />
                      <span className="text-sm">Enter {selectedEventData?.unit}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <label className="text-sm text-white/60 mb-1 block">Feet</label>
                        <Input
                          type="number"
                          value={feet}
                          onChange={(e) => setFeet(e.target.value)}
                          placeholder="0"
                          className="bg-white/5 border-white/10 text-white text-center text-3xl font-mono h-16"
                        />
                      </div>
                      <span className="text-3xl text-white/40 mt-6">&apos;</span>
                      <div className="flex-1">
                        <label className="text-sm text-white/60 mb-1 block">Inches</label>
                        <Input
                          type="number"
                          step="0.25"
                          value={inches}
                          onChange={(e) => setInches(e.target.value)}
                          placeholder="0.00"
                          className="bg-white/5 border-white/10 text-white text-center text-3xl font-mono h-16"
                        />
                      </div>
                      <span className="text-3xl text-white/40 mt-6">&quot;</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-white/60 mb-2">
                      <Timer className="h-4 w-4" />
                      <span className="text-sm">Enter your time</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {["800m", "1600m"].includes(selectedEvent || "") && (
                        <>
                          <div className="flex-1">
                            <label className="text-sm text-white/60 mb-1 block">Min</label>
                            <Input
                              type="number"
                              value={minutes}
                              onChange={(e) => setMinutes(e.target.value)}
                              placeholder="0"
                              className="bg-white/5 border-white/10 text-white text-center text-3xl font-mono h-16"
                            />
                          </div>
                          <span className="text-3xl text-white/40 mt-6">:</span>
                        </>
                      )}
                      <div className="flex-1">
                        <label className="text-sm text-white/60 mb-1 block">Sec</label>
                        <Input
                          type="number"
                          value={seconds}
                          onChange={(e) => setSeconds(e.target.value)}
                          placeholder="00"
                          className="bg-white/5 border-white/10 text-white text-center text-3xl font-mono h-16"
                        />
                      </div>
                      <span className="text-3xl text-white/40 mt-6">.</span>
                      <div className="flex-1">
                        <label className="text-sm text-white/60 mb-1 block">Ms</label>
                        <Input
                          type="number"
                          value={milliseconds}
                          onChange={(e) => setMilliseconds(e.target.value)}
                          placeholder="00"
                          className="bg-white/5 border-white/10 text-white text-center text-3xl font-mono h-16"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Preview */}
                {(seconds || feet || inches) && (
                  <div className="text-center p-4 rounded-xl bg-orange-500/10 border border-orange-500/30">
                    <span className="text-sm text-white/60">Your Result</span>
                    <p className="text-4xl font-black text-orange-500">
                      {isFieldEvent ? formatDistance() : formatTime()}
                    </p>
                    {calculatedTier && (
                      <div className="mt-2">
                        <TierBadge tier={calculatedTier} size="md" showDescription />
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Step 4: Additional Details */}
            {step === 4 && (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-white/80">Place</label>
                    <Input
                      type="number"
                      value={place}
                      onChange={(e) => setPlace(e.target.value)}
                      placeholder="1"
                      className="bg-white/5 border-white/10 text-white text-center"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-white/80">Heat</label>
                    <Input
                      type="number"
                      value={heat}
                      onChange={(e) => setHeat(e.target.value)}
                      placeholder="1"
                      className="bg-white/5 border-white/10 text-white text-center"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-white/80">Lane</label>
                    <Input
                      type="number"
                      value={lane}
                      onChange={(e) => setLane(e.target.value)}
                      placeholder="5"
                      className="bg-white/5 border-white/10 text-white text-center"
                    />
                  </div>
                </div>

                {!isFieldEvent && (
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-white/80 flex items-center gap-2">
                      <Wind className="h-4 w-4" /> Wind Speed (m/s)
                    </label>
                    <Input
                      type="number"
                      step="0.1"
                      value={windSpeed}
                      onChange={(e) => setWindSpeed(e.target.value)}
                      placeholder="+0.0"
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-white/80 flex items-center gap-2">
                    <Video className="h-4 w-4" /> Video URL (optional)
                  </label>
                  <Input
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="YouTube or TikTok link"
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                  />
                </div>

                <button
                  onClick={() => setIsPR(!isPR)}
                  className={`w-full p-4 rounded-xl flex items-center justify-between transition-all ${
                    isPR
                      ? 'bg-green-500/20 border-2 border-green-500'
                      : 'bg-white/5 border-2 border-transparent hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Flame className={`h-5 w-5 ${isPR ? 'text-green-500' : 'text-white/40'}`} />
                    <span className="font-bold text-white">This is a PR!</span>
                  </div>
                  {isPR && <Check className="h-5 w-5 text-green-500" />}
                </button>
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              {step > 1 ? (
                <Button
                  variant="ghost"
                  onClick={() => setStep(step - 1)}
                  className="text-white/60 hover:text-white"
                >
                  Back
                </Button>
              ) : (
                <div />
              )}

              {step < 4 ? (
                <Button
                  onClick={() => setStep(step + 1)}
                  disabled={!canProceed()}
                  className="btn-track text-white font-bold px-6 rounded-full"
                >
                  Continue
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="btn-track text-white font-bold px-6 rounded-full"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Saving...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Trophy className="h-4 w-4" />
                      SAVE RESULT
                    </span>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
