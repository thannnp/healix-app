export interface PatientFormData {
  first_name: string;
  middle_name?: string;
  last_name: string;
  date_of_birth: string;
  gender: string;
  phone_number: string;
  email: string;
  address: string;
  preferred_language: string;
  nationality: string;
  emergency_contact_name?: string;
  emergency_contact_relationship?: string;
  religion?: string;
}

export interface PatientSession {
  sessionId: string;
  formData: Partial<PatientFormData>;
  activeField: string | null;
  status: "typing" | "idle" | "submitted" | "disconnected";
  lastActivity: string;
}

export type PatientStatus = PatientSession["status"];
