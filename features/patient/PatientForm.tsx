"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Loader2,
  ArrowLeft,
  User,
  Phone,
  ShieldAlert,
  type LucideIcon,
  ArrowLeftIcon,
} from "lucide-react";
import PatientStepProgress from "./form/StepProgress";
import PatientSuccess from "./PatientSuccess";
import InformationPatient from "./form/InformationPatient";
import ContactPatient from "./form/ContactPatient";
import EmergencyContactPatient from "./form/EmergencyContactPatient";
import { patientSchema, type PatientSchema } from "./patient.schema";

const stepFieldsValidation: (keyof PatientSchema)[][] = [
  [
    "first_name",
    "middle_name",
    "last_name",
    "date_of_birth",
    "gender",
    "preferred_language",
    "nationality",
    "religion",
  ],
  ["phone_number", "email", "address"],
  ["emergency_contact_name", "emergency_contact_relationship"],
];

const steps = [
  { id: 0, label: "Patient Info" },
  { id: 1, label: "Contact" },
  { id: 2, label: "Emergency" },
] as const;

const stepTitles: { sub: string; main: string; icon: LucideIcon }[] = [
  { sub: "Let's start with", main: "Information", icon: User },
  { sub: "How can we", main: "Reach You", icon: Phone },
  { sub: "In case of", main: "Emergency", icon: ShieldAlert },
];

export default function PatientForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const { handleSubmit, control, trigger } = useForm<PatientSchema>({
    mode: "all",
    resolver: zodResolver(patientSchema),
    defaultValues: {
      first_name: "",
      middle_name: "",
      last_name: "",
      date_of_birth: "",
      gender: "",
      phone_number: "",
      email: "",
      address: "",
      preferred_language: "",
      nationality: "",
      emergency_contact_name: "",
      emergency_contact_relationship: "",
      religion: "",
    },
  });

  const handleNext = async () => {
    const fields = stepFieldsValidation[currentStep];
    const valid = await trigger(fields);
    if (valid) {
      setCurrentStep((s) => Math.min(s + 1, steps.length - 1));
    }
  };

  const handleBack = () => {
    setCurrentStep((s) => Math.max(s - 1, 0));
  };

  const onSubmit = async (data: PatientSchema) => {
    setIsSubmitting(true);
    // Simulate submit — will be replaced by Supabase INSERT
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log("Submitted:", data);
    setIsSubmitting(false);
    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <PatientSuccess
        onReset={() => {
          setIsSuccess(false);
          setCurrentStep(0);
        }}
      />
    );
  }

  const isLastStep = currentStep === steps.length - 1;

  return (
    <div>
      {/* Back to home */}
      <div className="mb-4">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-white/80 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
      </div>

      <PatientStepProgress
        steps={steps}
        currentStep={currentStep}
        onStepClick={setCurrentStep}
      />

      {/* Card */}
      <form id="form-" onSubmit={handleSubmit(onSubmit)}>
        <div className="rounded-2xl bg-white p-6 shadow-xl sm:p-8">
          {/* Step Title */}
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
              {(() => {
                const Icon = stepTitles[currentStep].icon;
                return <Icon className="h-5 w-5 text-primary" />;
              })()}
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                {stepTitles[currentStep].sub}
              </p>
              <h2 className="text-xl font-bold text-foreground sm:text-2xl">
                {stepTitles[currentStep].main}
              </h2>
            </div>
          </div>

          {/* Step Content */}
          <div className="space-y-5">
            {currentStep === 0 && <InformationPatient control={control} />}
            {currentStep === 1 && <ContactPatient control={control} />}
            {currentStep === 2 && <EmergencyContactPatient control={control} />}
          </div>

          {/* Actions */}
          <div className="mt-8 flex items-center justify-between">
            <div>
        
              {currentStep > 0 && (
                <Button variant="outline" size="icon" aria-label="Go Back" type="button" onClick={handleBack}>
                  <ArrowLeftIcon />
                </Button>
              )}
            </div>

            <div className="flex items-center gap-4">
              {isLastStep ? (
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-11 rounded-full px-8 text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit"
                  )}
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleNext}
                  className="h-11 rounded-full px-8 text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Continue
                </Button>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
