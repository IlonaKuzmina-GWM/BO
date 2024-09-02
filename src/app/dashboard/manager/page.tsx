'use client';

import DashPageTitle from "@/components/shared/DashPageTitle";
import AllUsers from "@/components/shared/Manager/AllUsers";
import Create from "@/components/shared/Manager/Create";
import KYSUserList from "@/components/shared/Manager/KYSUserList";
import Merchants from "@/components/shared/Manager/Merchants";
import Tabs from "@/components/shared/Tabs/Tabs";
import { useState } from "react";

const ManagerPage = () => {
  const [activeTab, setActiveTab] = useState("Create");

  const tabList = ["Create", "Merchants", "All Users", "KYS User List"];

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className="flex min-h-screen w-full flex-col gap-6">
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
        {activeTab === "Create" && <Create />}
        {activeTab === "Merchants" && <Merchants />}
        {activeTab === "All Users" && <AllUsers />}
        {activeTab === "KYS User List" && <KYSUserList />}
      </div>
    </div>
  );
};
export default ManagerPage;
