"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Play, Square, Clock, Loader2, Send } from "lucide-react";
import { cn } from "@/lib/utils";

type TestData = {
  id: string;
  title: string;
  audioUrl: string | null;
  speedWPM: number;
};

export function TestRunner({ test }: { test: TestData }) {
  const router = useRouter();
  
  const [testState, setTestState] = useState<"IDLE" | "DICTATION" | "TRANSCRIPTION">("IDLE");
  const [audioPlayed, setAudioPlayed] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [timeRemaining, setTimeRemaining] = useState(60 * 60); // 60 minutes default
  const [timeTaken, setTimeTaken] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Timer logic
  useEffect(() => {
    if (testState === "TRANSCRIPTION") {
      timerRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            handleSubmit(); // Auto submit
            return 0;
          }
          return prev - 1;
        });
        setTimeTaken((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [testState]);

  const handleStartDictation = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
    setTestState("DICTATION");
  };

  const handleStartTranscription = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setAudioPlayed(true);
    setTestState("TRANSCRIPTION");
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    if (timerRef.current) clearInterval(timerRef.current);

    // Calculate actual WPM based on typed words and time taken
    const words = transcript.trim().split(/\s+/).filter(Boolean).length;
    const minutesTaken = timeTaken / 60;
    const actualWpm = minutesTaken > 0 ? Math.round(words / minutesTaken) : 0;

    try {
      const res = await fetch("/api/tests/attempts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          testId: test.id,
          responseText: transcript,
          timeTaken,
          actualWpm,
        }),
      });

      if (!res.ok) throw new Error("Failed to submit test");
      const data = await res.json();
      
      toast.success("Test Submitted!");
      router.push(`/dashboard/practice/${test.id}/result?attemptId=${data.attemptId}`);
    } catch (error) {
      toast.error("Submission failed", {
        description: "Could not save your test results. Please try again.",
      });
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] gap-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl border-primary/20 bg-background/50 backdrop-blur-xl border shadow-sm">
        <div>
          <h2 className="text-xl font-bold">{test.title}</h2>
          <p className="text-sm text-muted-foreground">{test.speedWPM} WPM • Standard Dictation</p>
        </div>
        
        <div className="flex items-center gap-4">
          {testState === "TRANSCRIPTION" && (
            <div className={cn(
              "flex items-center gap-2 font-mono text-xl font-bold px-4 py-2 rounded-lg bg-muted/50",
              timeRemaining < 300 ? "text-destructive" : "text-primary"
            )}>
              <Clock className="h-5 w-5" />
              {formatTime(timeRemaining)}
            </div>
          )}
          
          <div className="text-sm text-muted-foreground font-medium">
            {transcript.trim().split(/\s+/).filter(Boolean).length} words
          </div>
        </div>
      </div>

      <Card className="flex-1 flex flex-col overflow-hidden border-primary/20 bg-background/50 backdrop-blur-xl">
        <CardContent className="flex-1 flex flex-col p-0">
          {testState === "IDLE" && (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-6">
              <div className="max-w-md space-y-4">
                <h3 className="text-2xl font-bold">Ready to begin?</h3>
                <p className="text-muted-foreground">
                  The dictation will play automatically. Keep your notebook and pen ready. Once the dictation ends, you will have 60 minutes to type your transcription.
                </p>
                
                <div className="pt-4">
                  <Button size="lg" className="w-full text-lg h-14 rounded-xl shadow-lg hover:scale-[1.02] transition-all" onClick={handleStartDictation}>
                    <Play className="mr-2 h-5 w-5 fill-current" />
                    Start Dictation
                  </Button>
                </div>
              </div>
            </div>
          )}

          {testState === "DICTATION" && (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-8 animate-in zoom-in-95 duration-500">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
                <div className="relative bg-primary/10 p-8 rounded-full border-2 border-primary/30">
                  <Play className="h-16 w-16 text-primary fill-primary animate-pulse" />
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-primary">Dictation in progress...</h3>
                <p className="text-muted-foreground max-w-sm mx-auto">
                  Take notes in your notebook. When the audio finishes, click below to start transcribing.
                </p>
              </div>

              {test.audioUrl && (
                <audio 
                  ref={audioRef} 
                  src={test.audioUrl} 
                  onEnded={handleStartTranscription}
                  className="hidden"
                />
              )}

              <Button variant="secondary" size="lg" onClick={handleStartTranscription}>
                <Square className="mr-2 h-4 w-4" /> Skip to Transcription
              </Button>
            </div>
          )}

          {testState === "TRANSCRIPTION" && (
            <div className="flex-1 flex flex-col animate-in fade-in duration-500">
              <Textarea
                placeholder="Start typing your transcription here..."
                className="flex-1 resize-none border-0 focus-visible:ring-0 p-6 text-lg leading-relaxed bg-transparent"
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                disabled={isSubmitting}
                spellCheck={false}
                autoFocus
              />
              
              <div className="p-4 border-t bg-muted/20 flex justify-between items-center">
                <p className="text-sm text-muted-foreground">
                  Your progress is not autosaved. Do not refresh this page.
                </p>
                <Button 
                  onClick={handleSubmit} 
                  disabled={isSubmitting || transcript.trim().length === 0}
                  className="shadow-md"
                >
                  {isSubmitting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="mr-2 h-4 w-4" />
                  )}
                  Submit Test
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
