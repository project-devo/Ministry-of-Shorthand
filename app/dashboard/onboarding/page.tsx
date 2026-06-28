"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Loader2, ChevronRight, ChevronLeft, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

const LEVELS = [
  { id: "BEGINNER", title: "Beginner", description: "Just starting out (0-60 WPM)" },
  { id: "INTERMEDIATE", title: "Intermediate", description: "Building speed (60-100 WPM)" },
  { id: "ADVANCED", title: "Advanced", description: "Exam ready (100+ WPM)" },
];

const EXAM_TARGETS = [
  "SSC Stenographer",
  "Court Reporter",
  "Parliamentary Reporter",
  "State PSC",
  "Other",
];

const SPEEDS = [60, 80, 100, 120, 140, 160];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  const [level, setLevel] = useState("BEGINNER");
  const [target, setTarget] = useState("");
  const [customTarget, setCustomTarget] = useState("");
  const [speed, setSpeed] = useState(80);

  const handleNext = () => setStep((s) => s + 1);
  const handlePrev = () => setStep((s) => s - 1);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/profile/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shorthandLevel: level,
          examTarget: target === "Other" ? customTarget : target,
          preferredSpeed: speed,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save onboarding data");
      }

      toast.success("Profile Setup Complete", {
        description: "Welcome to your dashboard!",
      });
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      toast.error("Error", {
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors",
                  step === i
                    ? "border-primary bg-primary text-primary-foreground"
                    : step > i
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-muted-foreground text-muted-foreground"
                )}
              >
                {step > i ? <CheckCircle2 className="h-5 w-5" /> : i}
              </div>
              {i < 3 && (
                <div
                  className={cn(
                    "h-[2px] w-12 sm:w-24 mx-2 transition-colors",
                    step > i ? "bg-primary" : "bg-muted-foreground/30"
                  )}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <Card className="border-primary/20 shadow-xl glass-card">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            {step === 1 && "What is your current level?"}
            {step === 2 && "What is your exam target?"}
            {step === 3 && "What is your target speed?"}
          </CardTitle>
          <CardDescription>
            {step === 1 && "This helps us recommend the right practice tests for you."}
            {step === 2 && "We'll tailor your experience to this exam format."}
            {step === 3 && "You can always change this later in your settings."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === 1 && (
            <div className="grid gap-4">
              {LEVELS.map((l) => (
                <div
                  key={l.id}
                  className={cn(
                    "flex flex-col gap-1 rounded-xl border-2 p-4 cursor-pointer hover:border-primary/50 transition-all",
                    level === l.id ? "border-primary bg-primary/5" : "border-muted"
                  )}
                  onClick={() => setLevel(l.id)}
                >
                  <span className="font-semibold">{l.title}</span>
                  <span className="text-sm text-muted-foreground">{l.description}</span>
                </div>
              ))}
            </div>
          )}

          {step === 2 && (
            <div className="grid gap-4">
              {EXAM_TARGETS.map((t) => (
                <div
                  key={t}
                  className={cn(
                    "rounded-xl border-2 p-4 cursor-pointer hover:border-primary/50 transition-all text-center font-medium",
                    target === t ? "border-primary bg-primary/5" : "border-muted"
                  )}
                  onClick={() => setTarget(t)}
                >
                  {t}
                </div>
              ))}
              
              {target === "Other" && (
                <div className="mt-2 space-y-2 animate-in fade-in slide-in-from-top-4">
                  <Label htmlFor="customTarget">Specify Exam</Label>
                  <Input 
                    id="customTarget" 
                    placeholder="e.g. State High Court" 
                    value={customTarget}
                    onChange={(e) => setCustomTarget(e.target.value)}
                  />
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {SPEEDS.map((s) => (
                <div
                  key={s}
                  className={cn(
                    "flex flex-col items-center justify-center rounded-xl border-2 p-6 cursor-pointer hover:border-primary/50 transition-all",
                    speed === s ? "border-primary bg-primary/5 text-primary" : "border-muted"
                  )}
                  onClick={() => setSpeed(s)}
                >
                  <span className="text-2xl font-bold">{s}</span>
                  <span className="text-sm font-medium">WPM</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-6">
          <Button 
            variant="outline" 
            onClick={handlePrev} 
            disabled={step === 1 || isLoading}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          
          {step < 3 ? (
            <Button onClick={handleNext} disabled={step === 2 && target === "Other" && !customTarget}>
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Complete Setup
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
