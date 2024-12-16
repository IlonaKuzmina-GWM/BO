"use client";

import DashPageTitle from "@/components/shared/DashPageTitle";
import MainDashboardWrapper from "@/components/shared/MainDashboard/MainDashboardWrapper";
import { useStore } from "@/stores/StoreProvider";
import { ROLES } from "@/constants/roles";

const MainDashPage = () => {
  const { authStore } = useStore();
  const userRole = authStore.role;

  const allowedRoles = ["admin", "manager", "agent", "developer"];

  return (
    <div className="flex w-full flex-col gap-4 xl:gap-6">
      <DashPageTitle
        title="Overview"
        description="Explore total volumes, success rates, and country-specific statistics"
      />

      {allowedRoles.includes(userRole as keyof typeof ROLES) && (
        <MainDashboardWrapper />
      )}
    </div>
  );
};

export default MainDashPage;
