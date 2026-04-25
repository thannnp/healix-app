import type { Control } from "react-hook-form";
import type { PatientSchema } from "./patient.schema";

export interface PatientStepFormProps {
  control: Control<PatientSchema>;
}