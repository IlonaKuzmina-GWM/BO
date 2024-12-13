"use client";

import DashPageTitle from "@/components/shared/DashPageTitle";
import AllUsers from "@/components/shared/Manager/AllUsers";
import Create from "@/components/shared/Manager/Create";
import KYCUserList from "@/components/shared/Manager/KYCUserList";
import Merchants from "@/components/shared/Manager/Merchants";
import Tabs from "@/components/shared/Tabs";
import { useEffect, useState } from "react";
import { useStore } from "@/stores/StoreProvider";
import { observer } from "mobx-react-lite";
import { ROLES } from "@/constants/roles";

const ManagerPage = observer(() => {
  const [activeTab, setActiveTab] = useState<string | null>(null);

  const { authStore } = useStore();

  const userRole = authStore.role;

  const tabList = ["Create", "Merchants", "All Users", "KYC User List"];

  const allowedRolesForTabs = {
    Create: [ROLES.ADMIN, ROLES.DEVELOPER, ROLES.MANAGER, ROLES.AGENT],
    Merchants: [ROLES.ADMIN, ROLES.DEVELOPER, ROLES.MANAGER, ROLES.AGENT],
    "All Users": [ROLES.ADMIN, ROLES.DEVELOPER, ROLES.MANAGER, ROLES.AGENT],
    "KYC User List": [ROLES.ADMIN, ROLES.DEVELOPER],
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
        title="Manager"
        description="Comprehensive transaction history: track and manage all your payments"
      />

      <div className="w-full">
        <Tabs
          tabList={filteredTabsByRole}
          onTabChange={handleTabChange}
          activeTab={activeTab || ""}
        />
        {activeTab === "Create" && <Create />}
        {activeTab === "Merchants" && <Merchants />}
        {activeTab === "All Users" && <AllUsers />}
        {activeTab === "KYC User List" && <KYCUserList />}
      </div>
    </div>
  );
});
export default ManagerPage;
