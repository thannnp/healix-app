import { z } from "zod";

export const patientSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  middle_name: z.string().optional().or(z.literal("")),
  last_name: z.string().min(1, "Last name is required"),
  date_of_birth: z.string().min(1, "Date of birth is required"),
  gender: z.string().min(1, "Gender is required"),
  phone_number: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^[0-9]{9,15}$/, "Invalid phone number"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address"),
  address: z.string().min(1, "Address is required"),
  preferred_language: z.string().min(1, "Preferred language is required"),
  nationality: z.string().min(1, "Nationality is required"),
  emergency_contact_name: z.string().optional().or(z.literal("")),
  emergency_contact_relationship: z.string().optional().or(z.literal("")),
  religion: z.string().optional().or(z.literal("")),
});

export type PatientSchema = z.infer<typeof patientSchema>;