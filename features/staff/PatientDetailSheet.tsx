import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import StatusIndicator from "@/features/staff/StatusIndicator";
import { cn } from "@/lib/utils";
import {
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Heart,
  Globe,
  Languages,
  Flag,
  Church,
} from "lucide-react";
import type { PatientSession } from "@/types/patient";

interface PatientDetailSheetProps {
  patient: PatientSession | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const fieldConfig: {
  key: string;
  label: string;
  icon: React.ReactNode;
  section: string;
}[] = [
  { key: "first_name", label: "First Name", icon: <User className="h-4 w-4" />, section: "personal" },
  { key: "middle_name", label: "Middle Name", icon: <User className="h-4 w-4" />, section: "personal" },
  { key: "last_name", label: "Last Name", icon: <User className="h-4 w-4" />, section: "personal" },
  { key: "date_of_birth", label: "Date of Birth", icon: <Calendar className="h-4 w-4" />, section: "personal" },
  { key: "gender", label: "Gender", icon: <User className="h-4 w-4" />, section: "personal" },
  { key: "phone_number", label: "Phone Number", icon: <Phone className="h-4 w-4" />, section: "contact" },
  { key: "email", label: "Email", icon: <Mail className="h-4 w-4" />, section: "contact" },
  { key: "address", label: "Address", icon: <MapPin className="h-4 w-4" />, section: "contact" },
  { key: "preferred_language", label: "Preferred Language", icon: <Languages className="h-4 w-4" />, section: "additional" },
  { key: "nationality", label: "Nationality", icon: <Flag className="h-4 w-4" />, section: "additional" },
  { key: "emergency_contact_name", label: "Emergency Contact", icon: <Heart className="h-4 w-4" />, section: "emergency" },
  { key: "emergency_contact_relationship", label: "Relationship", icon: <Globe className="h-4 w-4" />, section: "emergency" },
  { key: "religion", label: "Religion", icon: <Church className="h-4 w-4" />, section: "additional" },
];

const sections = [
  { id: "personal", title: "Personal Information" },
  { id: "contact", title: "Contact Details" },
  { id: "additional", title: "Additional Information" },
  { id: "emergency", title: "Emergency Contact" },
];

export default function PatientDetailSheet({
  patient,
  open,
  onOpenChange,
}: PatientDetailSheetProps) {
  if (!patient) return null;

  const { formData, activeField, status, sessionId, lastActivity } = patient;

  const displayName =
    [formData.first_name, formData.last_name].filter(Boolean).join(" ") ||
    "New Patient";

  const filledCount = Object.values(formData).filter(
    (v) => typeof v === "string" && v.trim() !== ""
  ).length;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto p-0">
        {/* Header */}
        <div className="bg-primary px-6 pt-8 pb-6">
          <SheetHeader className="text-left">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 text-lg font-bold text-white">
                {(formData.first_name?.[0] || "?").toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <SheetTitle className="text-white text-lg truncate">
                  {displayName}
                </SheetTitle>
                <p className="text-primary-foreground/70 text-sm mt-0.5">
                  ID: {sessionId.slice(0, 8)}
                </p>
              </div>
            </div>
          </SheetHeader>

          <div className="mt-4 flex items-center gap-3">
            <StatusIndicator status={status} className="[&_span:last-child]:text-white/80" />
            <Badge
              variant="secondary"
              className="bg-white/15 text-white border-0 text-xs"
            >
              {filledCount}/12 fields
            </Badge>
            {lastActivity && (
              <span className="text-xs text-white/50 ml-auto">
                {new Date(lastActivity).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            )}
          </div>
        </div>

        {/* Field sections */}
        <div className="px-6 py-4 space-y-6">
          {sections.map((section) => {
            const fields = fieldConfig.filter((f) => f.section === section.id);

            return (
              <div key={section.id}>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                  {section.title}
                </h4>
                <div className="space-y-1">
                  {fields.map((field) => {
                    const value = formData[field.key as keyof typeof formData];
                    const isActive = activeField === field.key;

                    return (
                      <div
                        key={field.key}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-200",
                          isActive && "bg-green-50 ring-1 ring-green-300",
                          !isActive && "hover:bg-muted/50"
                        )}
                      >
                        <span
                          className={cn(
                            "shrink-0",
                            isActive
                              ? "text-green-600"
                              : value
                                ? "text-primary"
                                : "text-muted-foreground/30"
                          )}
                        >
                          {field.icon}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-[11px] text-muted-foreground">
                            {field.label}
                          </p>
                          <p
                            className={cn(
                              "text-sm truncate",
                              value
                                ? "text-foreground font-medium"
                                : "text-muted-foreground/40 italic"
                            )}
                          >
                            {(typeof value === "string" && value) || "Not provided"}
                          </p>
                        </div>
                        {isActive && (
                          <span className="relative flex h-2.5 w-2.5 shrink-0">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
                <Separator className="mt-4" />
              </div>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
}
