"use client";

import { useState } from "react";
import PatientCard from "@/components/PatientCard";
import PatientDetailSheet from "@/components/PatientDetailSheet";
import Link from "next/link";
import { Activity, Users, CheckCircle2, Clock, ArrowLeft } from "lucide-react";
import type { PatientSession } from "@/types/patient";

// Mock data for UI preview — will be replaced by Supabase Realtime
const mockPatients: PatientSession[] = [
  {
    sessionId: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    formData: {
      first_name: "Somchai",
      last_name: "Jaidee",
      date_of_birth: "1990-05-15",
      gender: "Male",
      phone_number: "0812345678",
      email: "somchai@email.com",
      address: "123 Sukhumvit Rd, Bangkok",
      preferred_language: "Thai",
      nationality: "Thai",
    },
    activeField: "email",
    status: "typing",
    lastActivity: new Date().toISOString(),
  },
  {
    sessionId: "b2c3d4e5-f6a7-8901-bcde-f12345678901",
    formData: {
      first_name: "Jane",
      last_name: "Doe",
      date_of_birth: "1985-11-20",
      gender: "Female",
      phone_number: "0898765432",
      email: "jane.doe@email.com",
      address: "456 Silom Rd, Bangkok",
      preferred_language: "English",
      nationality: "American",
      emergency_contact_name: "John Doe",
      emergency_contact_relationship: "Spouse",
      religion: "Christian",
    },
    activeField: null,
    status: "submitted",
    lastActivity: new Date(Date.now() - 120000).toISOString(),
  },
  {
    sessionId: "c3d4e5f6-a7b8-9012-cdef-123456789012",
    formData: {
      first_name: "Tanaka",
      last_name: "",
      gender: "Male",
    },
    activeField: null,
    status: "idle",
    lastActivity: new Date(Date.now() - 300000).toISOString(),
  },
  {
    sessionId: "d4e5f6a7-b8c9-0123-defa-234567890123",
    formData: {
      first_name: "Maria",
      last_name: "Garcia",
      phone_number: "0876543210",
    },
    activeField: null,
    status: "disconnected",
    lastActivity: new Date(Date.now() - 600000).toISOString(),
  },
];

export default function StaffPage() {
  const [patients] = useState<PatientSession[]>(mockPatients);
  const [selectedPatient, setSelectedPatient] = useState<PatientSession | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const stats = {
    total: patients.length,
    typing: patients.filter((p) => p.status === "typing").length,
    submitted: patients.filter((p) => p.status === "submitted").length,
    idle: patients.filter((p) => p.status === "idle").length,
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15 transition-colors hover:bg-white/25"
              >
                <ArrowLeft className="h-4 w-4" />
              </Link>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
                <Activity className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight">
                  Healix Staff Dashboard
                </h1>
                <p className="text-sm text-primary-foreground/70">
                  Real-time patient monitoring
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-green-400" />
              </span>
              <span className="text-sm font-medium text-primary-foreground/80">
                Live
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Bar */}
      <div className="border-b bg-card">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-4 py-4 sm:grid-cols-4">
            <StatItem
              icon={<Users className="h-4 w-4" />}
              label="Total Patients"
              value={stats.total}
              color="text-primary"
            />
            <StatItem
              icon={<Activity className="h-4 w-4" />}
              label="Active"
              value={stats.typing}
              color="text-green-600"
            />
            <StatItem
              icon={<CheckCircle2 className="h-4 w-4" />}
              label="Submitted"
              value={stats.submitted}
              color="text-primary"
            />
            <StatItem
              icon={<Clock className="h-4 w-4" />}
              label="Idle"
              value={stats.idle}
              color="text-amber-500"
            />
          </div>
        </div>
      </div>

      {/* Patient Cards */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {patients.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-lg font-semibold text-foreground">
              No patients yet
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Waiting for patients to start filling in their forms...
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {patients.map((patient) => (
              <PatientCard
                key={patient.sessionId}
                patient={patient}
                onClick={() => {
                  setSelectedPatient(patient);
                  setSheetOpen(true);
                }}
              />
            ))}
          </div>
        )}
      </main>

      <PatientDetailSheet
        patient={selectedPatient}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
      />
    </div>
  );
}

function StatItem({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className={`${color}`}>{icon}</div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-lg font-bold text-foreground">{value}</p>
      </div>
    </div>
  );
}
