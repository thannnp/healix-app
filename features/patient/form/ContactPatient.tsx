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

export default function ContactPatient({ control }: PatientStepFormProps) {
  return (
    <>
      <FieldGroup>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
          <Controller
            name="phone_number"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel
                  htmlFor="form-phone-number"
                  className="text-xs font-medium text-muted-foreground uppercase tracking-wide"
                >
                  Phone Number
                </FieldLabel>
                <Input
                  {...field}
                  id="form-phone-number"
                  aria-invalid={fieldState.invalid}
                  placeholder="0812345678"
                  autoComplete="off"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="email"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel
                  htmlFor="form-email"
                  className="text-xs font-medium text-muted-foreground uppercase tracking-wide"
                >
                  Email
                </FieldLabel>
                <Input
                  type="email"
                  {...field}
                  id="form-email"
                  aria-invalid={fieldState.invalid}
                  placeholder="john@example.com"
                  autoComplete="off"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>
        <Controller
          name="address"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel
                htmlFor="form-address"
                className="text-xs font-medium text-muted-foreground uppercase tracking-wide"
              >
                Address
              </FieldLabel>
              <textarea
                {...field}
                id="form-address"
                aria-invalid={fieldState.invalid}
                placeholder="123 Street, City, Country"
                rows={3}
                className="w-full rounded-lg border border-input bg-transparent px-3 py-2.5 text-sm outline-none transition-colors resize-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive"
              />
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />
      </FieldGroup>
    </>
  );
}
