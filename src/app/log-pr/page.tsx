"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/trackverse/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Trophy, 
  Timer, 
  MapPin, 
  Calendar,
  Wind,
  Video,
  ChevronRight,
  Flame,
  Check,
  Ruler
} from "lucide-react";

const events = [
  // Sprints
  { id: "100m", name: "100m", category: "Sprint", unit: "time" },
  { id: "200m", name: "200m", category: "Sprint", unit: "time" },
  { id: "400m", name: "400m", category: "Sprint", unit: "time" },
  // Distance
  { id: "800m", name: "800m", category: "Distance", unit: "time" },
  { id: "1600m", name: "1600m", category: "Distance", unit: "time" },
  { id: "3200m", name: "3200m", category: "Distance", unit: "time" },
  // Hurdles
  { id: "110h", name: "110m Hurdles", category: "Hurdles", unit: "time" },
  { id: "100h", name: "100m Hurdles", category: "Hurdles", unit: "time" },
  { id: "300h", name: "300m Hurdles", category: "Hurdles", unit: "time" },
  { id: "400h", name: "400m Hurdles", category: "Hurdles", unit: "time" },
  // Jumps
  { id: "hj", name: "High Jump", category: "Jumps", unit: "height" },
  { id: "lj", name: "Long Jump", category: "Jumps", unit: "distance" },
  { id: "tj", name: "Triple Jump", category: "Jumps", unit: "distance" },
  { id: "pv", name: "Pole Vault", category: "Jumps", unit: "height" },
  // Throws
  { id: "sp", name: "Shot Put", category: "Throws", unit: "distance" },
  { id: "disc", name: "Discus", category: "Throws", unit: "distance" },
  { id: "jav", name: "Javelin", category: "Throws", unit: "distance" },
];

const categories = ["Sprint", "Distance", "Hurdles", "Jumps", "Throws"];

export default function LogPRPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  
  // Time inputs (for running events)
  const [minutes, setMinutes] = useState("");
  const [seconds, setSeconds] = useState("");
  const [milliseconds, setMilliseconds] = useState("");
  
  // Distance/Height inputs (for field events)
  const [feet, setFeet] = useState("");
  const [inches, setInches] = useState("");
  
  // Context
  const [location, setLocation] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [windSpeed, setWindSpeed] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [conditions, setConditions] = useState<"outdoor" | "indoor">("outdoor");

  const selectedEventData = events.find(e => e.id === selectedEvent);
  const isFieldEvent = selectedEventData?.unit === "distance" || selectedEventData?.unit === "height";

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

  const handleSubmit = async () => {
    setIsLoading(true);
    // TODO: Save PR to database
    await new Promise(resolve => setTimeout(resolve, 1500));
    router.push("/dashboard?pr=new");
  };

  const canProceed = () => {
    switch (step) {
      case 1: return selectedEvent !== null;
      case 2: 
        if (isFieldEvent) {
          return feet !== "" || inches !== "";
        }
        return seconds !== "";
      case 3: return true;
      default: return false;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/30 mb-4">
            <Trophy className="h-4 w-4 text-orange-500" />
            <span className="text-sm font-semibold text-orange-400">LOG NEW PR</span>
          </div>
          <h1 className="text-4xl font-black mb-2">DROP A NEW PR 🔥</h1>
          <p className="text-white/60">Record your personal best and watch your rank climb</p>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
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
              {step === 1 && "Select Event"}
              {step === 2 && "Enter Your Time"}
              {step === 3 && "Add Details (Optional)"}
            </CardTitle>
            <CardDescription className="text-white/60">
              {step === 1 && "What event did you PR in?"}
              {step === 2 && `Enter your ${selectedEventData?.name} PR`}
              {step === 3 && "Help verify your PR with additional info"}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Step 1: Select Event */}
            {step === 1 && (
              <div className="space-y-4">
                {/* Category Filter */}
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
                      className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                        selectedCategory === cat
                          ? 'bg-orange-500 text-white'
                          : 'bg-white/5 text-white/60 hover:bg-white/10'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Events Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-80 overflow-y-auto pr-2">
                  {events
                    .filter(e => !selectedCategory || e.category === selectedCategory)
                    .map((event) => (
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
                          <span className="font-bold">{event.name}</span>
                          {selectedEvent === event.id && (
                            <Check className="h-4 w-4 text-orange-500" />
                          )}
                        </div>
                        <span className="text-xs text-white/40">{event.category}</span>
                      </button>
                    ))}
                </div>
              </div>
            )}

            {/* Step 2: Enter Performance */}
            {step === 2 && (
              <div className="space-y-6">
                {isFieldEvent ? (
                  // Field Event Input (Distance/Height)
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
                    {(feet || inches) && (
                      <div className="text-center p-4 rounded-xl bg-orange-500/10 border border-orange-500/30">
                        <span className="text-sm text-white/60">Your PR</span>
                        <p className="text-4xl font-black text-orange-500">{formatDistance()}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  // Running Event Input (Time)
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-white/60 mb-2">
                      <Timer className="h-4 w-4" />
                      <span className="text-sm">Enter your time</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {/* Minutes (only for 800m+) */}
                      {["800m", "1600m", "3200m"].includes(selectedEvent || "") && (
                        <>
                          <div className="flex-1">
                            <label className="text-sm text-white/60 mb-1 block">Min</label>
                            <Input
                              type="number"
                              value={minutes}
                              onChange={(e) => setMinutes(e.target.value)}
                              placeholder="0"
                              className="bg-white/5 border-white/10 text-white text-center text-3xl font-mono h-16"
                              max={59}
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
                          max={59}
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
                          max={99}
                        />
                      </div>
                    </div>
                    {seconds && (
                      <div className="text-center p-4 rounded-xl bg-orange-500/10 border border-orange-500/30">
                        <span className="text-sm text-white/60">Your PR</span>
                        <p className="text-4xl font-black text-orange-500">{formatTime()}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Additional Details */}
            {step === 3 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-white/80 flex items-center gap-2">
                      <MapPin className="h-4 w-4" /> Location
                    </label>
                    <Input
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Meet name or venue"
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-white/80 flex items-center gap-2">
                      <Calendar className="h-4 w-4" /> Date
                    </label>
                    <Input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-white/80">Conditions</label>
                  <div className="flex gap-2">
                    {(["outdoor", "indoor"] as const).map((cond) => (
                      <button
                        key={cond}
                        onClick={() => setConditions(cond)}
                        className={`flex-1 py-3 rounded-lg font-semibold capitalize transition-all ${
                          conditions === cond
                            ? 'bg-orange-500 text-white'
                            : 'bg-white/5 text-white/60 hover:bg-white/10'
                        }`}
                      >
                        {cond}
                      </button>
                    ))}
                  </div>
                </div>

                {!isFieldEvent && conditions === "outdoor" && (
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
                    <p className="text-xs text-white/40">Wind-legal limit is +2.0 m/s</p>
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
                  <p className="text-xs text-white/40">Video helps verify your PR faster</p>
                </div>
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

              {step < 3 ? (
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
                      <Flame className="h-4 w-4" />
                      LOG PR
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
