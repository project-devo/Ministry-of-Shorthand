"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export function PracticeFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const level = searchParams.get("level") || "ALL";
  const speed = searchParams.get("speed") || "ALL";

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === "ALL") {
        params.delete(name);
      } else {
        params.set(name, value);
      }
      return params.toString();
    },
    [searchParams]
  );

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <Tabs 
        value={level} 
        onValueChange={(val) => {
          if (val) router.push(`/dashboard/practice?${createQueryString("level", val)}`);
        }}
        className="w-full sm:w-auto"
      >
        <TabsList className="grid w-full grid-cols-4 sm:w-auto sm:inline-flex bg-background/50 backdrop-blur-xl border border-primary/20">
          <TabsTrigger value="ALL">All Levels</TabsTrigger>
          <TabsTrigger value="BEGINNER">Beginner</TabsTrigger>
          <TabsTrigger value="INTERMEDIATE">Intermediate</TabsTrigger>
          <TabsTrigger value="ADVANCED">Advanced</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex items-center gap-2">
        <Label htmlFor="speed" className="whitespace-nowrap">Speed:</Label>
        <Select 
          value={speed} 
          onValueChange={(val) => {
            if (val) router.push(`/dashboard/practice?${createQueryString("speed", val)}`);
          }}
        >
          <SelectTrigger id="speed" className="w-[140px] bg-background/50 backdrop-blur-xl border-primary/20">
            <SelectValue placeholder="All Speeds" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Speeds</SelectItem>
            <SelectItem value="60">60 WPM</SelectItem>
            <SelectItem value="80">80 WPM</SelectItem>
            <SelectItem value="100">100 WPM</SelectItem>
            <SelectItem value="120">120 WPM</SelectItem>
            <SelectItem value="140">140 WPM</SelectItem>
            <SelectItem value="160">160 WPM</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
