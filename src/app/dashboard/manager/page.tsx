"use client";

import DashPageTitle from "@/components/shared/DashPageTitle";
import AllUsers from "@/components/shared/Manager/AllUsers";
import Create from "@/components/shared/Manager/Create";
import KYCUserList from "@/components/shared/Manager/KYCUserList";
import Merchants from "@/components/shared/Manager/Merchants";
import Tabs from "@/components/shared/Tabs/Tabs";
import { useState } from "react";
import Alert from "@/components/UI/Alert";
import { useStore } from "@/stores/StoreProvider";
import { observer } from "mobx-react-lite";
import { ROLES } from "@/constants/roles";

const ManagerPage = observer(() => {
  const { alertStore, authStore } = useStore();
  const [activeTab, setActiveTab] = useState("Create");
  const userRole = authStore.role;

  const tabList = ["Create", "Merchants", "All Users", "KYC User List"];

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const alLowedRolesForKYC = [ROLES.ADMIN, ROLES.OWNER];
  const alLowedRolesForAllUsers = [
    ROLES.ADMIN,
    ROLES.OWNER,
    ROLES.DEVELOPER,
    ROLES.MANAGER,
    ROLES.MERCHANT,
  ];
  const alLowedRolesForMerchants = [
    ROLES.ADMIN,
    ROLES.OWNER,
    ROLES.DEVELOPER,
    ROLES.MANAGER,
  ];
  const alLowedRolesForAccountsCreator = [
    ROLES.ADMIN,
    ROLES.OWNER,
    ROLES.DEVELOPER,
  ];

  return (
    <div className="flex min-h-screen w-full flex-col gap-4 xl:gap-6">
      <DashPageTitle
        title="Manager"
        description="Comprehensive transaction history: track and manage all your payments"
      />

      <div className="w-full">
        <Tabs
          tabList={tabList}
          onTabChange={handleTabChange}
          activeTab={activeTab}
        />
        {activeTab === "KYC User List" && <KYCUserList />}

        {activeTab === "Create" && <Create />}
        {activeTab === "Merchants" && <Merchants />}
        {activeTab === "All Users" && <AllUsers />}
        {activeTab === "KYC User List" && <KYCUserList />}
      </div>

      {alertStore.alertMessage && alertStore.alertType && (
        <Alert type={alertStore.alertType} message={alertStore.alertMessage} />
      )}
    </div>
  );
});
export default ManagerPage;
