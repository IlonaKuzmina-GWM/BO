interface ITabs {
  tabList: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Tabs = ({ tabList, activeTab, onTabChange }: ITabs) => {
  return (
    <>
      <button className="flex flex-row rounded-[4px]">
        {tabList.map((tab: string, index: number) => (
          <div
            key={tab}
            onClick={() => onTabChange(tab)}
            className={`flex cursor-pointer items-center justify-center gap-[8px] px-[32px] py-[16px] text-[18px] font-normal leading-[150%] text-main ${
              activeTab === tab ? "bg-white" : "bg-hoverBg"
            } ${index === 0 ? "rounded-tl-[4px]" : ""} ${
              index === tabList.length - 1 ? "rounded-tr-[4px]" : ""
            }`}
          >
            {tab}
          </div>
        ))}
      </button>
    </>
  );
};

export default Tabs;
