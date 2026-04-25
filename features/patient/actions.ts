"use server";

import { createClient } from "@/lib/supabase/server";
import { patientSchema } from "./patient.schema";

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
