"use client";

import DashPageTitle from "@/components/shared/DashPageTitle";
import Rules from "@/components/shared/Settings/Rules";
import Integration from "@/components/shared/Settings/Integration";
import Authentication from "@/components/shared/Settings/Authentication";
import Tabs from "@/components/shared/Tabs";
import { useEffect, useState } from "react";
import { ROLES } from "@/constants/roles";
import { useStore } from "@/stores/StoreProvider";

const SettingsPage = () => {
  const { authStore } = useStore();
  const userRole = Object.values(ROLES).includes(authStore.role as ROLES)
    ? (authStore.role as ROLES)
    : null;

  const [activeTab, setActiveTab] = useState<string | null>(null);

  const tabList = ["Rules", "Integration", "Authentication"];

  const allowedRolesForTabs = {
    Rules: [ROLES.ADMIN, ROLES.DEVELOPER],
    Integration: [ROLES.ADMIN, ROLES.DEVELOPER, ROLES.MERCHANT],
    Authentication: [
      ROLES.ADMIN,
      ROLES.DEVELOPER,
      ROLES.MANAGER,
      ROLES.AGENT,
      ROLES.USER,
      ROLES.SUPPORT,
      ROLES.MERCHANT,
      ROLES.FINANCE,
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
    if (!activeTab && tabList.length > 0) {
      setActiveTab(tabList[0]);
    }
  }, [activeTab, tabList, setActiveTab]);

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
