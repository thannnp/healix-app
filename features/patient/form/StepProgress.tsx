"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface PatientStepProgressProps {
  steps: readonly { id: number; label: string }[];
  currentStep: number;
  onStepClick: (step: number) => void;
}

export default function PatientStepProgress({
  steps,
  currentStep,
  onStepClick,
}: PatientStepProgressProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center mx-6 pointer-events-none">
        {steps.map((step, index) => {
          const isCompleted = currentStep > index;
          const isActive = currentStep === index;

          return (
            <div
              key={step.id}
              className={cn(
                "flex items-center",
                index < steps.length - 1 && "flex-1",
              )}
            >
              {/* Step circle + label */}
              <button
                type="button"
                onClick={() => onStepClick(step.id)}
                className="group flex flex-col items-center gap-1.5 sm:gap-2"
              >
                <div
                  className={cn(
                    "flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border-2 text-xs sm:text-sm font-semibold transition-all duration-300",
                    isCompleted &&
                      "border-white bg-white text-[#4F7DF3] shadow-md",
                    isActive &&
                      "border-white bg-white/20 text-white shadow-lg scale-110 animate-bounce",
                    !isCompleted &&
                      !isActive &&
                      "border-white/30 text-white/40 group-hover:border-white/50 group-hover:text-white/60",
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  ) : (
                    index + 1
                  )}
                </div>
                <span
                  className={cn(
                    "text-[0.65rem] text-xs md:text-base font-medium transition-colors duration-300 whitespace-nowrap",
                    isActive ? "block" : "hidden sm:block",
                    isCompleted && "text-white",
                    isActive && "text-white ",
                    !isCompleted && !isActive && "text-white/40",
                  )}
                >
                  {step.label}
                </span>
              </button>

              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="mx-1 sm:mx-2 -mt-4 sm:-mt-5 h-0.5 flex-1 rounded-full bg-white/20 overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full bg-white transition-all duration-500 ease-out",
                      isCompleted ? "w-full" : "w-0",
                    )}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
