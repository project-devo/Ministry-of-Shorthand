"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Trophy, Target, Clock, ArrowRight, RotateCcw, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type TestResultData = {
  id: string;
  score: number;
  accuracy: number;
  actualWpm: number;
  timeTaken: number;
  errorAnalysis: string[];
  test: {
    id: string;
    title: string;
    speedWPM: number;
  };
};

export function TestResult({ attempt }: { attempt: TestResultData }) {
  const isPass = attempt.accuracy >= 95 && attempt.actualWpm >= attempt.test.speedWPM * 0.9;
  
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="max-w-4xl mx-auto w-full space-y-6">
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", bounce: 0.5, duration: 0.6 }}
          className="inline-block relative mb-4"
        >
          <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
          <div className={cn(
            "relative p-6 rounded-full border-4 shadow-xl bg-background",
            isPass ? "border-green-500 text-green-500" : "border-primary text-primary"
          )}>
            <Trophy className="h-16 w-16" />
          </div>
        </motion.div>
        <h2 className="text-3xl font-bold tracking-tight">Test Completed!</h2>
        <p className="text-muted-foreground mt-2">{attempt.test.title}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
          <Card className="border-primary/20 bg-background/50 backdrop-blur-xl text-center">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-primary">{attempt.score}</div>
              <Progress value={attempt.score} className="h-2 mt-3" />
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
          <Card className="border-primary/20 bg-background/50 backdrop-blur-xl text-center relative overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Accuracy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{attempt.accuracy}%</div>
              <div className="mt-3 flex items-center justify-center text-xs font-medium text-muted-foreground">
                <Target className="mr-1 h-4 w-4" /> Goal: 95%
              </div>
            </CardContent>
            {attempt.accuracy >= 95 && (
              <div className="absolute top-0 right-0 p-2 text-green-500">
                <CheckCircle2 className="h-5 w-5" />
              </div>
            )}
          </Card>
        </motion.div>
        
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
          <Card className="border-primary/20 bg-background/50 backdrop-blur-xl text-center relative overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Speed (WPM)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{attempt.actualWpm}</div>
              <div className="mt-3 flex items-center justify-center text-xs font-medium text-muted-foreground">
                <Clock className="mr-1 h-4 w-4" /> Goal: {attempt.test.speedWPM} WPM
              </div>
            </CardContent>
            {attempt.actualWpm >= attempt.test.speedWPM && (
              <div className="absolute top-0 right-0 p-2 text-green-500">
                <CheckCircle2 className="h-5 w-5" />
              </div>
            )}
          </Card>
        </motion.div>
      </div>

      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
        <Card className="border-primary/20 bg-background/50 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-primary" />
              Performance Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6 bg-muted/30 p-3 rounded-lg border">
                <div><span className="font-medium text-foreground">Time taken:</span> {formatTime(attempt.timeTaken)}</div>
              </div>
              
              <ul className="space-y-3">
                {attempt.errorAnalysis && attempt.errorAnalysis.map((insight: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-3 text-sm">
                    <div className="mt-0.5 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                    <span>{insight}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div 
        initial={{ y: 20, opacity: 0 }} 
        animate={{ y: 0, opacity: 1 }} 
        transition={{ delay: 0.5 }}
        className="flex flex-col sm:flex-row justify-center gap-4 pt-4"
      >
        <Button variant="outline" size="lg" asChild className="sm:w-48 bg-background/50 backdrop-blur-xl">
          <Link href={`/dashboard/practice/${attempt.test.id}`}>
            <RotateCcw className="mr-2 h-4 w-4" /> Try Again
          </Link>
        </Button>
        <Button size="lg" asChild className="sm:w-48 shadow-lg">
          <Link href="/dashboard/practice">
            Back to Tests <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </motion.div>
    </div>
  );
}
