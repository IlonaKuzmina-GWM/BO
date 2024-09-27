'use client';

import DashPageTitle from "@/components/shared/DashPageTitle";
import AllUsers from "@/components/shared/Manager/AllUsers";
import Create from "@/components/shared/Manager/Create";
import KYCUserList from "@/components/shared/Manager/KYCUserList";
import Merchants from "@/components/shared/Manager/Merchants";
import Tabs from "@/components/shared/Tabs/Tabs";
import { useState } from "react";

const ManagerPage = () => {
  const [activeTab, setActiveTab] = useState("Create");

  const tabList = ["Create", "Merchants", "All Users", "KYC User List"];

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

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
        {activeTab === "Create" && <Create />}
        {activeTab === "Merchants" && <Merchants />}
        {activeTab === "All Users" && <AllUsers />}
        {activeTab === "KYC User List" && <KYCUserList />}
      </div>
    </div>
  );
};
export default ManagerPage;
