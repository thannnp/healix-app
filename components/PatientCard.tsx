import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import StatusIndicator from "@/components/StatusIndicator";
import { cn } from "@/lib/utils";
import { Phone, Mail, ChevronRight } from "lucide-react";
import type { PatientSession } from "@/types/patient";

interface PatientCardProps {
  patient: PatientSession;
  onClick: () => void;
}

export default function PatientCard({ patient, onClick }: PatientCardProps) {
  const { formData, activeField, status, lastActivity } = patient;

  const displayName =
    [formData.first_name, formData.last_name].filter(Boolean).join(" ") ||
    "New Patient";

  const filledCount = Object.values(formData).filter(
    (v) => typeof v === "string" && v.trim() !== ""
  ).length;

  return (
    <Card
      onClick={onClick}
      className={cn(
        "cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 overflow-hidden",
        status === "typing" &&
          "ring-2 ring-green-400/50 shadow-md shadow-green-100",
        status === "submitted" && "ring-2 ring-primary/20",
        status === "disconnected" && "opacity-60"
      )}
    >
      <div className="p-4">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div
            className={cn(
              "flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white",
              status === "submitted"
                ? "bg-primary"
                : status === "typing"
                  ? "bg-green-500"
                  : "bg-primary/60"
            )}
          >
            {(formData.first_name?.[0] || "?").toUpperCase()}
          </div>

          {/* Info */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-foreground truncate">
                {displayName}
              </h3>
              <StatusIndicator status={status} />
            </div>

            {/* Quick info row */}
            <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
              {formData.phone_number && (
                <span className="flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  {formData.phone_number}
                </span>
              )}
              {formData.email && (
                <span className="flex items-center gap-1 truncate">
                  <Mail className="h-3 w-3 shrink-0" />
                  <span className="truncate">{formData.email}</span>
                </span>
              )}
              {!formData.phone_number && !formData.email && (
                <span className="text-muted-foreground/50 italic">
                  No contact info yet
                </span>
              )}
            </div>
          </div>

          {/* Right side */}
          <div className="flex shrink-0 flex-col items-end gap-1.5">
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0.5">
              {filledCount}/12
            </Badge>
            <ChevronRight className="h-4 w-4 text-muted-foreground/40" />
          </div>
        </div>

        {/* Active field indicator */}
        {activeField && status === "typing" && (
          <div className="mt-3 flex items-center gap-2 rounded-md bg-green-50 px-3 py-1.5 text-xs">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
            </span>
            <span className="text-green-700">
              Typing in <span className="font-medium">{activeField.replace(/_/g, " ")}</span>
            </span>
          </div>
        )}

        {/* Last activity */}
        {lastActivity && (
          <p className="mt-2 text-[10px] text-muted-foreground/60 text-right">
            {new Date(lastActivity).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        )}
      </div>
    </Card>
  );
}
