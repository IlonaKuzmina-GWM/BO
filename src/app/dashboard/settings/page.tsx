"use client";

import DashPageTitle from "@/components/shared/DashPageTitle";
import Authentication from "@/components/shared/Settings/Authentication";
import Integration from "@/components/shared/Settings/Integration";
import Rules from "@/components/shared/Settings/Rules";
import Tabs from "@/components/shared/Tabs";
import { ROLES } from "@/constants/roles";
import { useStore } from "@/stores/StoreProvider";
import { useEffect, useState } from "react";

const SettingsPage = () => {
  const { authStore } = useStore();
  const userRole = authStore.role;

  const [activeTab, setActiveTab] = useState<string | null>(null);
  const tabList = ["Rules", "Integration", "Authentication"];

  const allowedRolesForTabs = {
    Rules: ["admin", "developer"],
    Integration: ["admin", "merchant", "developer"],
    Authentication: [
      "admin",
      "manager",
      "agent",
      "developer",
      "merchant",
      "finance",
      "user",
      "support",
    ],
  };

  const filteredTabsByRole = tabList.filter((tab) => {
    const allowedRoles =
      allowedRolesForTabs[tab as keyof typeof allowedRolesForTabs];
    return allowedRoles ? allowedRoles.includes(userRole as ROLES) : false;
  });

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    if (!activeTab && filteredTabsByRole.length > 0) {
      setActiveTab(filteredTabsByRole[0]);
    }
  }, [activeTab, filteredTabsByRole]);

  return (
    <div className="flex min-h-screen w-full flex-col gap-4 xl:gap-6">
      <DashPageTitle
        title="Settings"
        description="Comprehensive transaction history: track and manage all your payments"
      />

      <div className="w-full">
        <Tabs
          tabList={filteredTabsByRole}
          activeTab={activeTab || ""}
          onTabChange={handleTabChange}
        />
        {activeTab === "Integration" && <Integration />}

        {activeTab === "Rules" && <Rules />}
        {activeTab === "Authentication" && <Authentication />}
      </div>
    </div>
  );
};
export default SettingsPage;
