"use server";

import { createClient } from "@/lib/supabase/server";
import { patientSchema } from "./patient.schema";
import type { PatientRow } from "@/types/database";

export async function getSubmittedPatients() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("patients")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Supabase select error:", error);
    return [];
  }

  return ((data as PatientRow[]) ?? []).map((row) => ({
    sessionId: `db-${row.id}`,
    formData: {
      first_name: row.first_name ?? "",
      middle_name: row.middle_name ?? undefined,
      last_name: row.last_name ?? "",
      date_of_birth: row.date_of_birth ?? "",
      gender: row.gender ?? "",
      phone_number: row.phone_number ?? "",
      email: row.email ?? "",
      address: row.address ?? "",
      preferred_language: row.preferred_language ?? "",
      nationality: row.nationality ?? "",
      emergency_contact_name: row.emergency_contact_name ?? undefined,
      emergency_contact_relationship: row.emergency_contact_relationship ?? undefined,
      religion: row.religion ?? undefined,
    },
    activeField: null,
    status: "submitted" as const,
    lastActivity: row.created_at ?? new Date().toISOString(),
  }));
}

export async function submitPatientForm(formData: unknown) {
  // Validate input server-side
  const parsed = patientSchema.safeParse(formData);

  if (!parsed.success) {
    return {
      success: false as const,
      error: parsed.error.issues.map((e: { message: string }) => e.message).join(", "),
    };
  }

  const supabase = await createClient();

  const { error } = await supabase.from("patients").insert({
    first_name: parsed.data.first_name,
    last_name: parsed.data.last_name,
    middle_name: parsed.data.middle_name || null,
    date_of_birth: parsed.data.date_of_birth,
    gender: parsed.data.gender,
    phone_number: parsed.data.phone_number,
    email: parsed.data.email,
    address: parsed.data.address,
    preferred_language: parsed.data.preferred_language,
    nationality: parsed.data.nationality,
    emergency_contact_name: parsed.data.emergency_contact_name || null,
    emergency_contact_relationship:
      parsed.data.emergency_contact_relationship || null,
    religion: parsed.data.religion || null,
  });

  if (error) {
    console.error("Supabase insert error:", error);
    return { success: false as const, error: error.message };
  }

  return { success: true as const };
}
