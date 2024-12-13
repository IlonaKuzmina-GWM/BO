"use client";

import DashPageTitle from "@/components/shared/DashPageTitle";
import Rules from "@/components/shared/Settings/Rules";
import Integration from "@/components/shared/Settings/Integration";
import Authentication from "@/components/shared/Settings/Authentication";
import Tabs from "@/components/shared/Tabs";
import { useState } from "react";

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("Integration");

  const tabList = ["Integration"];

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className="flex min-h-screen w-full flex-col gap-4 xl:gap-6">
      <DashPageTitle
        title="Settings"
        description="Comprehensive transaction history: track and manage all your payments"
      />

      <div className="w-full">
        <Tabs
          tabList={tabList}
          onTabChange={handleTabChange}
          activeTab={activeTab}
        />
        {activeTab === "Integration" && <Integration />}

        {/* {activeTab === "Rules" && <Rules />} */}
        {/* {activeTab === "Authentication" && <Authentication />} */}
      </div>
    </div>
  );
};
export default SettingsPage;
