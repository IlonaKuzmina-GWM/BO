import React from "react";

interface IMerchantConfigurationTabs {
  tabList: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const MerchantConfigurationTabs = ({
  tabList,
  activeTab,
  onTabChange,
}: IMerchantConfigurationTabs) => {
  return (
    <div className="flex flex-row gap-6">
      {tabList.map((tab: string, index: number) => (
        <div
          key={tab}
          onClick={() => onTabChange(tab)}
          className={`flex cursor-pointer items-center justify-center text-[16px] pb-2 font-normal leading-[150%] text-main relative ${
            activeTab === tab ? "after:absolute after:w-full after:border-b-[2px] after:bottom-0 after:right-0 after:left-0 after:mx-auto after:border-main" : "bg-hoverBg"
          }`}
        >
          {tab}
        </div>
      ))}
    </div>
  );
};

export default MerchantConfigurationTabs;
