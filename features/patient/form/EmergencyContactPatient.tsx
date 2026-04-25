
"use client";

import { Controller } from "react-hook-form";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { PatientStepFormProps } from "../types";

export default function EmergencyContactPatient({ control }: PatientStepFormProps) {
  return (
    <>
      <FieldGroup>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
          <Controller
            name="emergency_contact_name"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel
                  htmlFor="form-emergency-contact-name"
                  className="text-xs font-medium text-muted-foreground uppercase tracking-wide"
                >
                  Contact Name
                </FieldLabel>
                <Input
                  {...field}
                  id="form-emergency-contact-name"
                  aria-invalid={fieldState.invalid}
                  placeholder="Optional"
                  autoComplete="off"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="emergency_contact_relationship"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel
                  htmlFor="form-emergency-contact-relationship"
                  className="text-xs font-medium text-muted-foreground uppercase tracking-wide"
                >
                  Relationship
                </FieldLabel>
                <Input
                  {...field}
                  id="form-emergency-contact-relationship"
                  aria-invalid={fieldState.invalid}
                  placeholder="e.g. Spouse, Parent"
                  autoComplete="off"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>
      </FieldGroup>
    </>
  );
}
