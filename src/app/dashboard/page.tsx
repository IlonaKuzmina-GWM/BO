import ChartWrapper from "@/components/shared/Charts/ChartWrapper";
import DashPageTitle from "@/components/shared/DashPageTitle";
import React from "react";

const MainDashPage = () => {
  return (
    <div className="flex min-h-screen w-full flex-col gap-6">
      <DashPageTitle
        title="Overview"
        description="Explore total volumes, success rates, and country-specific statistics"
      />

      <div className="w-full">
        <ChartWrapper
          title={"Gross Volume"}
          dataInterval={"15/08 - 28/08"}
          shortOverview={[
            { title: "$ 183,382", description: "Transactions 4554" },
          ]}
        />
      </div>
    </div>
  );
};

export default MainDashPage;
