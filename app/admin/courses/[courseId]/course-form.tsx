"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function CourseForm({ initialData: _initialData, instructors: _instructors }: { initialData?: Record<string, unknown> | null, instructors?: { id: string; name: string }[] }) {
  return (
    <Card className="bg-background/50 backdrop-blur-xl border-primary/10">
      <CardHeader>
        <CardTitle>Course Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-muted-foreground">Course form implementation coming soon.</p>
          <Button variant="outline">Save Changes</Button>
        </div>
      </CardContent>
    </Card>
  );
}
