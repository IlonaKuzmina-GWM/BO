"use client";

import React, { useState } from "react";
import MainSettings from "./MainSettings";
import Cards from "./Cards";
import OpenBanking from "./OpenBanking";
import APMs from "./APMs";
import MerchantConfigurationTabs from "./MerchantConfigurationTabs";

interface MerchantConfigurationBarProps {
  isOpen: boolean;
  handleConfigBarIsOpen: () => void;
}

const MerchantConfigurationBar = ({
  isOpen,
  handleConfigBarIsOpen,
}: MerchantConfigurationBarProps) => {
  const [activeTab, setActiveTab] = useState("Open Banking");

  const tabList = ["Main settings", "Cards", "Open Banking", "APMs"];

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div
      className={`shadow-3xl absolute right-0 top-0 h-screen w-full justify-end bg-secondary ${isOpen ? "flex" : "hidden"}`}
      onClick={handleConfigBarIsOpen}
    >
      <div className="z-10 w-1/2 bg-white" onClick={(e) => e.stopPropagation()} >
        <div className="flex flex-col gap-4 border-b-[1px] border-b-secondary bg-hoverBg px-5 pt-6">
          <h2 className="text-xl uppercase text-main">Merchant title</h2>
          <MerchantConfigurationTabs
            tabList={tabList}
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />
        </div>
        <div className="px-5 py-4">
          {activeTab === "Main settings" && <MainSettings />}
          {activeTab === "Cards" && <Cards />}
          {activeTab === "Open Banking" && <OpenBanking />}
          {activeTab === "APMs" && <APMs />}
        </div>
      </div>
    </div>
  );
};

export default MerchantConfigurationBar;
