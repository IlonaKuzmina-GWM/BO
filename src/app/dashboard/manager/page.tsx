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
  const { authStore } = useStore();
  const userRole = authStore.role;

  const [activeTab, setActiveTab] = useState<string | null>(null);
  const tabList = ["Create", "Merchants", "All Users", "KYC User List"];

  const allowedRolesForTabs = {
    Create: ["admin", "manager", "agent", "developer"],
    Merchants: ["admin", "manager", "agent", "developer"],
    "All Users": ["admin", "manager", "agent", "developer"],
    "KYC User List": ["admin", "developer"],
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
