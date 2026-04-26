import { getSubmittedPatients } from "@/features/patient/actions";
import StaffDashboard from "@/features/staff/StaffDashboard";

export default async function StaffPage() {
  const initialPatients = await getSubmittedPatients();

  return <StaffDashboard initialPatients={initialPatients} />;
}
