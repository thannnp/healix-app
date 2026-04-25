"use client";

import { Controller } from "react-hook-form";
import {
  Field,
  FieldError,
  FieldLabel,
  FieldGroup,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, ChevronDownIcon } from "lucide-react";
import { format, parse } from "date-fns";
import { cn } from "@/lib/utils";
import type { PatientStepFormProps } from "../types";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function InformationPatient({ control }: PatientStepFormProps) {
  return (
    <>
      <FieldGroup>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
          <Controller
            name="first_name"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel
                  htmlFor="form-first-name"
                  className="text-xs font-medium text-muted-foreground uppercase tracking-wide"
                >
                  First Name
                </FieldLabel>
                <Input
                  {...field}
                  id="form-first-name"
                  aria-invalid={fieldState.invalid}
                  placeholder="First name"
                  autoComplete="off"
                  className="h-10"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="middle_name"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel
                  htmlFor="form-middle-name"
                  className="text-xs font-medium text-muted-foreground uppercase tracking-wide"
                >
                  Middle Name
                  <span className="ml-1 text-muted-foreground/60 normal-case font-normal">(Optional)</span>
                </FieldLabel>
                <Input
                  {...field}
                  id="form-middle-name"
                  aria-invalid={fieldState.invalid}
                  placeholder="e.g. James"
                  autoComplete="off"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="last_name"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel
                  htmlFor="form-last-name"
                  className="text-xs font-medium text-muted-foreground uppercase tracking-wide"
                >
                  Last Name
                </FieldLabel>
                <Input
                  {...field}
                  id="form-last-name"
                  aria-invalid={fieldState.invalid}
                  placeholder="Last name"
                  autoComplete="off"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
          <Controller
            name="date_of_birth"
            control={control}
            render={({ field, fieldState }) => {
              const selectedDate = field.value
                ? parse(field.value, "yyyy-MM-dd", new Date())
                : undefined;
              return (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Date of Birth
                  </FieldLabel>
                  <Popover>
                    <PopoverTrigger
                      render={
                        <Button
                          variant="outline"
                          aria-invalid={fieldState.invalid}
                          className={cn(
                            "h-10 w-full justify-between text-left font-normal bg-transparent",
                            !field.value && "text-muted-foreground",
                          )}
                        />
                      }
                    >
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value
                          ? format(selectedDate!, "PPP")
                          : "Pick a date"}
                      </div>

                      <ChevronDownIcon />
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => {
                          field.onChange(date ? format(date, "yyyy-MM-dd") : "");
                          field.onBlur();
                        }}
                        captionLayout="dropdown"
                        defaultMonth={selectedDate}
                      />
                    </PopoverContent>
                  </Popover>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              );
            }}
          />
          <Controller
            name="gender"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Gender
                </FieldLabel>
                <Select
                  name={field.name}
                  value={field.value}
                  onValueChange={(value) => {
                    field.onChange(value);
                    field.onBlur();
                  }}
                >
                  <SelectTrigger className="w-full" aria-invalid={fieldState.invalid}>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Select gender</SelectLabel>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="preferred_language"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel
                  htmlFor="form-preferred-language"
                  className="text-xs font-medium text-muted-foreground uppercase tracking-wide"
                >
                  Preferred Language
                </FieldLabel>
                <Input
                  {...field}
                  id="form-preferred-language"
                  aria-invalid={fieldState.invalid}
                  placeholder="e.g. English, Thai"
                  autoComplete="off"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="nationality"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel
                  htmlFor="form-nationality"
                  className="text-xs font-medium text-muted-foreground uppercase tracking-wide"
                >
                  Nationality
                </FieldLabel>
                <Input
                  {...field}
                  id="form-nationality"
                  aria-invalid={fieldState.invalid}
                  placeholder="e.g. Thai"
                  autoComplete="off"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="religion"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel
                  htmlFor="form-religion"
                  className="text-xs font-medium text-muted-foreground uppercase tracking-wide"
                >
                  Religion
                  <span className="ml-1 text-muted-foreground/60 normal-case font-normal">(Optional)</span>
                </FieldLabel>
                <Input
                  {...field}
                  id="form-religion"
                  aria-invalid={fieldState.invalid}
                  placeholder="e.g. Buddhism, Christianity"
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
