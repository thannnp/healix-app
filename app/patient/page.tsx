import PatientForm from "@/features/patient/PatientForm";

export default function PatientPage() {
  return (
    <div className="relative min-h-screen">
      {/* Gradient background — top half */}
      <div className="absolute inset-x-0 top-0 h-full bg-primary" />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-3xl px-4 pt-8 pb-16 sm:px-6">
        <PatientForm />
      </div>
    </div>
  );
}
