import { cn } from "@/lib/utils";

export const Progress = ({
  className,
  value,
}: {
  className?: string;
  value: number;
}) => {
  const normalizedValue = Math.min(100, Math.max(0, value));

  return (
    <div className={cn("h-2 w-full overflow-hidden rounded-full bg-secondary", className)}>
      <div
        className="h-full rounded-full bg-primary transition-all"
        style={{ width: `${normalizedValue}%` }}
      />
    </div>
  );
};
