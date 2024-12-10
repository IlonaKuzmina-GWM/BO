import DashPageTitle from "@/components/shared/DashPageTitle";
import LogsWrapper from "@/components/shared/LogsPage/LogsWrapper";

export default function LogsPage() {

  return (
    <div className="flex w-full flex-col gap-4 xl:gap-6">
      <DashPageTitle
        title="Logs"
        description="Comprehensive overview of all user activities."
      />

      <LogsWrapper />
    </div>
  );
}
