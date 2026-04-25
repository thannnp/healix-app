import { cn } from "@/lib/utils";
import type { PatientStatus } from "@/types/patient";

const statusConfig: Record<
  PatientStatus,
  { label: string; color: string; pulse: boolean }
> = {
  typing: {
    label: "Filling in",
    color: "bg-green-500",
    pulse: true,
  },
  idle: {
    label: "Inactive",
    color: "bg-amber-400",
    pulse: false,
  },
  submitted: {
    label: "Submitted",
    color: "bg-primary",
    pulse: false,
  },
  disconnected: {
    label: "Disconnected",
    color: "bg-gray-400",
    pulse: false,
  },
};

interface StatusIndicatorProps {
  status: PatientStatus;
  className?: string;
}

export default function StatusIndicator({
  status,
  className,
}: StatusIndicatorProps) {
  const config = statusConfig[status];

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className="relative flex h-2.5 w-2.5">
        {config.pulse && (
          <span
            className={cn(
              "absolute inline-flex h-full w-full animate-ping rounded-full opacity-75",
              config.color
            )}
          />
        )}
        <span
          className={cn(
            "relative inline-flex h-2.5 w-2.5 rounded-full",
            config.color
          )}
        />
      </span>
      <span className="text-xs font-medium text-muted-foreground">
        {config.label}
      </span>
    </div>
  );
}
