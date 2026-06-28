import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-black/5 dark:bg-grid-white/5 [mask-image:linear-gradient(0deg,transparent,black)]" />
      
      <div className="absolute top-4 left-4 md:top-8 md:left-8 z-10">
        <Link href="/" className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>
      </div>
      
      <div className="w-full max-w-md relative z-10">
        <div className="flex justify-center mb-8">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="h-10 w-10 bg-primary text-primary-foreground flex items-center justify-center rounded-xl font-bold text-xl shadow-lg group-hover:scale-105 transition-transform">
              MO
            </div>
            <span className="font-extrabold text-2xl tracking-tight hidden sm:inline-block">
              Ministry of Shorthand
            </span>
          </Link>
        </div>
        
        {children}
      </div>
    </div>
  );
}
