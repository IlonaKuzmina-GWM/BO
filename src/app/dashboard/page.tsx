import DashPageTitle from "@/components/shared/DashPageTitle";
import MainDashboardWrapper from "@/components/shared/MainDashboard/MainDashboardWrapper";

const MainDashPage = () => {
  return (
    <div className="flex w-full flex-col gap-4 xl:gap-6">
      <DashPageTitle
        title="Overview"
        description="Explore total volumes, success rates, and country-specific statistics"
      />

      <MainDashboardWrapper />
    </div>
  );
};

export default MainDashPage;
