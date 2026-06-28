"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function SectionsList({ sections }: { courseId?: string, sections: { id: string; title: string; [key: string]: unknown }[] }) {
  return (
    <Card className="bg-background/50 backdrop-blur-xl border-primary/10">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Curriculum</CardTitle>
        <Button variant="ghost" size="icon">
          <Plus className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        {sections.length === 0 ? (
          <p className="text-sm text-muted-foreground">No sections yet.</p>
        ) : (
          <ul className="space-y-2">
            {sections.map(section => (
              <li key={section.id} className="text-sm border p-2 rounded">
                {section.title}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
