export interface PatientRow {
  id: string;
  first_name: string;
  last_name: string;
  middle_name: string | null;
  date_of_birth: string;
  gender: string;
  phone_number: string;
  email: string;
  address: string;
  preferred_language: string;
  nationality: string;
  emergency_contact_name: string | null;
  emergency_contact_relationship: string | null;
  religion: string | null;
  created_at: string;
}
