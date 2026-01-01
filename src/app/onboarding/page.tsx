"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  School, 
  Trophy, 
  ChevronRight, 
  ChevronLeft,
  Check,
  Flame,
  Target
} from "lucide-react";

const events = [
  { id: "100m", name: "100m", category: "Sprint" },
  { id: "200m", name: "200m", category: "Sprint" },
  { id: "400m", name: "400m", category: "Sprint" },
  { id: "800m", name: "800m", category: "Distance" },
  { id: "1600m", name: "1600m", category: "Distance" },
  { id: "3200m", name: "3200m", category: "Distance" },
  { id: "110h", name: "110m Hurdles", category: "Hurdles" },
  { id: "300h", name: "300m Hurdles", category: "Hurdles" },
  { id: "400h", name: "400m Hurdles", category: "Hurdles" },
  { id: "hj", name: "High Jump", category: "Jumps" },
  { id: "lj", name: "Long Jump", category: "Jumps" },
  { id: "tj", name: "Triple Jump", category: "Jumps" },
  { id: "pv", name: "Pole Vault", category: "Jumps" },
  { id: "sp", name: "Shot Put", category: "Throws" },
  { id: "disc", name: "Discus", category: "Throws" },
  { id: "jav", name: "Javelin", category: "Throws" },
];

const gradYears = [2025, 2026, 2027, 2028, 2029];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  // Form state
  const [displayName, setDisplayName] = useState("");
  const [school, setSchool] = useState("");
  const [gradYear, setGradYear] = useState<number | null>(null);
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const [primaryEvent, setPrimaryEvent] = useState<string | null>(null);

  const toggleEvent = (eventId: string) => {
    if (selectedEvents.includes(eventId)) {
      setSelectedEvents(selectedEvents.filter(e => e !== eventId));
      if (primaryEvent === eventId) setPrimaryEvent(null);
    } else {
      setSelectedEvents([...selectedEvents, eventId]);
    }
  };

  const handleComplete = async () => {
    setIsLoading(true);
    // TODO: Save profile to database
    // For now, simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    router.push("/dashboard");
  };

  const canProceed = () => {
    switch (step) {
      case 1: return displayName.length >= 2;
      case 2: return school.length >= 2 && gradYear !== null;
      case 3: return selectedEvents.length > 0 && primaryEvent !== null;
      default: return false;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-600/20 via-transparent to-transparent" />
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-orange-500/30 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-red-600/20 rounded-full blur-[150px]" />
      </div>

      <Card className="w-full max-w-2xl relative z-10 bg-black/50 border-orange-500/30">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-600 shadow-lg shadow-orange-500/30">
              <span className="text-xl font-black text-white">TV</span>
            </div>
          </div>
          
          {/* Progress indicator */}
          <div className="flex items-center justify-center gap-2 mb-6">
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

          <CardTitle className="text-3xl font-black">
            {step === 1 && "LET'S GET STARTED"}
            {step === 2 && "YOUR SCHOOL"}
            {step === 3 && "YOUR EVENTS"}
          </CardTitle>
          <CardDescription className="text-white/60">
            {step === 1 && "Tell us who you are"}
            {step === 2 && "Where do you compete?"}
            {step === 3 && "What events do you run?"}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-white/80">Display Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
                  <Input
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Your name"
                    className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/30 h-12"
                  />
                </div>
                <p className="text-xs text-white/40">This is how other athletes will see you</p>
              </div>
            </div>
          )}

          {/* Step 2: School Info */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-white/80">School Name</label>
                <div className="relative">
                  <School className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
                  <Input
                    value={school}
                    onChange={(e) => setSchool(e.target.value)}
                    placeholder="Lincoln High School"
                    className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/30 h-12"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-white/80">Graduation Year</label>
                <div className="grid grid-cols-5 gap-2">
                  {gradYears.map((year) => (
                    <button
                      key={year}
                      onClick={() => setGradYear(year)}
                      className={`py-3 rounded-lg font-bold transition-all ${
                        gradYear === year
                          ? 'bg-orange-500 text-white'
                          : 'bg-white/5 text-white/60 hover:bg-white/10'
                      }`}
                    >
                      {year}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Events */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-white/80">Select Your Events</label>
                <p className="text-xs text-white/40">Choose all events you compete in, then select your primary event</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-64 overflow-y-auto pr-2">
                {events.map((event) => (
                  <button
                    key={event.id}
                    onClick={() => toggleEvent(event.id)}
                    className={`p-3 rounded-lg text-left transition-all ${
                      selectedEvents.includes(event.id)
                        ? 'bg-orange-500/20 border-2 border-orange-500'
                        : 'bg-white/5 border-2 border-transparent hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm">{event.name}</span>
                      {selectedEvents.includes(event.id) && (
                        <Check className="h-4 w-4 text-orange-500" />
                      )}
                    </div>
                    <span className="text-xs text-white/40">{event.category}</span>
                  </button>
                ))}
              </div>

              {selectedEvents.length > 0 && (
                <div className="space-y-2 pt-4 border-t border-white/10">
                  <label className="text-sm font-semibold text-white/80">Primary Event</label>
                  <div className="flex flex-wrap gap-2">
                    {selectedEvents.map((eventId) => {
                      const event = events.find(e => e.id === eventId);
                      return (
                        <button
                          key={eventId}
                          onClick={() => setPrimaryEvent(eventId)}
                          className={`px-4 py-2 rounded-full font-semibold text-sm transition-all ${
                            primaryEvent === eventId
                              ? 'bg-orange-500 text-white'
                              : 'bg-white/10 text-white/70 hover:bg-white/20'
                          }`}
                        >
                          {primaryEvent === eventId && <Trophy className="inline h-3 w-3 mr-1" />}
                          {event?.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between pt-4">
            {step > 1 ? (
              <Button
                variant="ghost"
                onClick={() => setStep(step - 1)}
                className="text-white/60 hover:text-white"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
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
                onClick={handleComplete}
                disabled={!canProceed() || isLoading}
                className="btn-track text-white font-bold px-6 rounded-full"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Setting up...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Flame className="h-4 w-4" />
                    LET'S GO
                  </span>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
