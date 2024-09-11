import DashPageTitle from "@/components/shared/DashPageTitle";
import SiinsWrapper from "@/components/shared/SIINS/SiinsWrapper";

export default function SiinsPage() {
  return (
    <div className="flex w-full flex-col gap-6">
      <DashPageTitle
        title="SIINS"
        description="Comprehensive transaction history: track and manage all your payments"
      />
      
      <SiinsWrapper />
    </div>
  );
}
