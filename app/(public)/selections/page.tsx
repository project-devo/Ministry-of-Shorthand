import Image from "next/image";
import { getPublishedSelectionResults } from "@/lib/selections";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Star } from "lucide-react";

export const metadata = {
  title: "Selection Results | Ministry of Shorthand",
  description: "Meet our successful students who have cleared top stenography exams.",
};

export default async function SelectionsPage() {
  const selections = await getPublishedSelectionResults();

  return (
    <div className="container py-16">
      <div className="text-center mb-16 max-w-3xl mx-auto">
        <Badge variant="secondary" className="mb-4">Our Hall of Fame</Badge>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">Successful Selections</h1>
        <p className="text-lg text-muted-foreground">
          We measure our success by the success of our students. Here are some of the talented individuals who cleared their skill tests after preparing with us.
        </p>
      </div>

      {selections.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {selections.map((selection) => (
            <Card key={selection.id} className="overflow-hidden border-border/50 hover:border-primary/50 transition-colors flex flex-col h-full bg-muted/10">
              <CardContent className="p-8 flex-1 flex flex-col items-center text-center">
                <div className="h-32 w-32 rounded-full bg-secondary overflow-hidden mb-6 relative border-4 border-background shadow-md">
                  {selection.image ? (
                    <Image src={selection.image} alt={selection.name} fill className="object-cover" />
                  ) : (
                    <UserIcon className="h-16 w-16 absolute top-8 left-8 text-muted-foreground" />
                  )}
                </div>
                
                <h3 className="font-bold text-2xl mb-1">{selection.name}</h3>
                <p className="text-muted-foreground text-sm mb-4">Batch: {selection.batch}</p>
                
                <Badge className="mb-6 py-1.5 px-3 bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary">
                  <Trophy className="h-3.5 w-3.5 mr-2 inline" />
                  {selection.achievement}
                </Badge>
                
                {selection.quote && (
                  <div className="mt-auto relative">
                    <Star className="h-8 w-8 text-muted-foreground/20 absolute -top-4 -left-2 -z-10" />
                    <p className="italic text-muted-foreground relative z-10 leading-relaxed">
                      "{selection.quote}"
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-muted/30 rounded-lg border border-dashed max-w-4xl mx-auto">
          <Trophy className="mx-auto h-16 w-16 text-muted-foreground mb-4 opacity-50" />
          <h3 className="text-xl font-medium">No selections posted yet</h3>
          <p className="text-muted-foreground mt-2">
            The results of our latest batches will be published here soon.
          </p>
        </div>
      )}
    </div>
  );
}

function UserIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
