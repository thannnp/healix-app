import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

interface PatientSuccessProps {
  onReset: () => void;
}

export default function PatientSuccess({ onReset }: PatientSuccessProps) {
  return (
    <div className="mt-16">
      <div className="rounded-2xl bg-white p-10 shadow-xl text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 mb-6">
          <CheckCircle2 className="h-10 w-10 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">
          Registration Complete
        </h2>
        <p className="mt-2 text-muted-foreground">
          Thank you! Your information has been submitted successfully.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link href="/">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
